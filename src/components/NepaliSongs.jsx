import { useEffect, useRef, useState } from 'react';
import { AudioLines, Music2, Pause, Play, Plus, Repeat, SkipBack, SkipForward, Trash2, Volume2 } from 'lucide-react';
import { nepaliSongs } from '../data/nepaliSongs.js';

const isAudioFile = (file) => file.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|oga|wav|flac|webm)$/i.test(file.name);
const readableName = (fileName) => fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Nepali song';

export default function NepaliSongs({ t }) {
  const [tracks, setTracks] = useState(() => nepaliSongs.map((track, index) => ({
    id: `bundled-${index}`,
    name: track.title,
    fileName: track.file,
    url: track.file ? `${import.meta.env.BASE_URL}audio/${encodeURIComponent(track.file)}` : '',
    youtubeId: track.youtubeId,
    isBundled: true,
  })));
  const [selectedId, setSelectedId] = useState(() => nepaliSongs.length ? 'bundled-0' : null);
  const [error, setError] = useState('');
  const picker = useRef(null);
  const audioRef = useRef(null);
  const nextId = useRef(0);
  const uploadedUrls = useRef([]);
  const selectedTrack = tracks.find((track) => track.id === selectedId);
  const isYouTubeTrack = Boolean(selectedTrack?.youtubeId);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(() => localStorage.getItem('shikha-bhaidooj-song-loop') !== 'false');
  const [volume, setVolume] = useState(() => Number(localStorage.getItem('shikha-bhaidooj-song-volume') || 0.7));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = false;
    }
  }, [volume, loop, selectedId]);

  useEffect(() => () => uploadedUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const addTracks = (event) => {
    const files = Array.from(event.target.files || []);
    const audioFiles = files.filter(isAudioFile);
    if (files.length !== audioFiles.length) setError('Some files were skipped. Please choose audio files such as MP3, M4A, OGG, or WAV.');
    else setError('');
    if (audioFiles.length) {
      const additions = audioFiles.map((file) => ({
        id: nextId.current++,
        name: readableName(file.name),
        fileName: file.name,
        url: URL.createObjectURL(file),
        isBundled: false,
      }));
      uploadedUrls.current.push(...additions.map((track) => track.url));
      setTracks((current) => [...current, ...additions]);
      setSelectedId(additions[0].id);
    }
    event.target.value = '';
  };

  const removeTrack = (trackId) => {
    const removed = tracks.find((track) => track.id === trackId);
    if (removed && !removed.isBundled) {
      URL.revokeObjectURL(removed.url);
      uploadedUrls.current = uploadedUrls.current.filter((url) => url !== removed.url);
    }
    const remaining = tracks.filter((track) => track.id !== trackId);
    setTracks(remaining);
    if (selectedId === trackId) {
      audioRef.current?.pause();
      setPlaying(false);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };
  const selectTrack = (track) => {
    if (track.id === selectedId) return;
    setSelectedId(track.id);
    setPlaying(false);
    setError('');
  };
  const playPause = async () => {
    if (isYouTubeTrack) return;
    if (!selectedTrack || !audioRef.current) {
      setError('Add a song you have permission to use before starting the playlist.');
      return;
    }
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setPlaying(true);
        setError('');
      } catch (reason) {
        setError(`Could not play this song: ${reason.message}`);
      }
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };
  const stepTrack = (direction, resume = playing) => {
    if (tracks.length < 2) return;
    const currentIndex = tracks.findIndex((track) => track.id === selectedId);
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    selectTrack(tracks[nextIndex]);
    if (resume) window.setTimeout(() => audioRef.current?.play().then(() => setPlaying(true)).catch((reason) => setError(`Could not play this song: ${reason.message}`)), 0);
  };
  const playNext = () => {
    const currentIndex = tracks.findIndex((track) => track.id === selectedId);
    if (currentIndex < tracks.length - 1) stepTrack(1, true);
    else if (loop && tracks.length > 1) stepTrack(1, true);
    else setPlaying(false);
  };

  return (
    <section className="section songs-section" id="songs">
      <div className="section-heading">
        <span className="eyebrow"><Music2 size={14} /> {t('songsEyebrow')}</span>
        <h2>{t('songsTitle')} <span>🎶</span></h2>
        <p>{t('songsDescription')}</p>
      </div>
      <div className="song-player-card">
        <div className="song-player-art" aria-hidden="true"><span>♫</span><i>♪</i><b>🎵</b></div>
        <div className="song-player-content">
          <div className="song-player-topline">
            <div>
              <span className="eyebrow">{t('playlistTitle')}</span>
              <h3>{selectedTrack ? selectedTrack.name : t('noSong')}</h3>
            </div>
            <span className="song-count"><AudioLines size={15} /> {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
          </div>
          {isYouTubeTrack && <div className="youtube-song-player">
            <iframe
              key={selectedTrack.id}
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selectedTrack.youtubeId)}?rel=0`}
              title={selectedTrack.name}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <a className="youtube-fallback" href={`https://www.youtube.com/watch?v=${encodeURIComponent(selectedTrack.youtubeId)}`} target="_blank" rel="noreferrer">{t('openOnYouTube')}</a>
          </div>}
          {selectedTrack && !isYouTubeTrack && <audio ref={audioRef} key={selectedTrack.id} className="song-audio-source" preload="metadata" src={selectedTrack.url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={playNext} onError={() => setError(`Could not play “${selectedTrack.name}”. Try another audio format.`)} aria-label={`Play ${selectedTrack.name}`} />}
          {!selectedTrack && <p className="song-empty">{t('songsDescription')}</p>}
          {!isYouTubeTrack && <div className="song-transport" aria-label="Playlist playback controls">
            <button type="button" className="icon-button" onClick={() => stepTrack(-1)} disabled={tracks.length < 2} aria-label="Previous song"><SkipBack size={17} fill="currentColor" /></button>
            <button type="button" className="song-play-button" onClick={playPause} aria-label={playing ? 'Pause playlist' : 'Play playlist'}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
            <button type="button" className="icon-button" onClick={() => stepTrack(1)} disabled={tracks.length < 2} aria-label="Next song"><SkipForward size={17} fill="currentColor" /></button>
            <button type="button" className={`song-loop ${loop ? 'enabled' : ''}`} onClick={() => { const next = !loop; setLoop(next); localStorage.setItem('shikha-bhaidooj-song-loop', String(next)); }} aria-pressed={loop} aria-label="Toggle playlist repeat"><Repeat size={16} /></button>
            <label className="song-volume"><Volume2 size={16} /><span className="visually-hidden">Volume</span><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => { const next = Number(event.target.value); setVolume(next); localStorage.setItem('shikha-bhaidooj-song-volume', String(next)); }} /></label>
          </div>}
          <div className="song-actions">
            <button type="button" className="button button-primary" onClick={() => picker.current?.click()}><Plus size={17} /> {t('addSongs')}</button>
            <input ref={picker} className="visually-hidden" type="file" accept="audio/*,.mp3,.m4a,.aac,.ogg,.oga,.wav,.flac,.webm" multiple onChange={addTracks} aria-label="Choose Nepali song audio files" />
            <span className="song-local-note">{t('audioLocal')}</span>
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}
          {tracks.length > 0 && <ul className="song-list" aria-label="Nepali song playlist">
            {tracks.map((track, index) => <li className={track.id === selectedId ? 'song-selected' : ''} key={track.id}>
              <button type="button" className="song-select" onClick={() => selectTrack(track)} aria-current={track.id === selectedId ? 'true' : undefined}>
                <span className="song-index">{track.id === selectedId ? <AudioLines size={16} /> : String(index + 1).padStart(2, '0')}</span>
                <span className="song-title-wrap"><strong>{track.name}</strong><small>{track.youtubeId ? 'YouTube' : track.fileName}</small></span>
              </button>
              <button type="button" className="song-remove icon-button" onClick={() => removeTrack(track.id)} aria-label={`Remove ${track.name}`}><Trash2 size={15} /></button>
            </li>)}
          </ul>}
        </div>
      </div>
      <p className="song-rights-note">{t('songRightsNote')}</p>
    </section>
  );
}
