import { useEffect, useRef, useState } from 'react';
import { Download, Mic, Play, RotateCcw, Square, Trash2 } from 'lucide-react';

export default function VoiceRecorder({ t }) {
  const recorder = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioType, setAudioType] = useState('audio/webm');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [audioUrl]);

  const start = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Voice recording is not supported in this browser. Try a current version of Chrome, Edge, or Safari.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunks.current = [];
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported(type));
      const nextRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorder.current = nextRecorder;
      nextRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      nextRecorder.onerror = () => { setError('The recording could not be completed. Please try again.'); setStatus('idle'); };
      nextRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: nextRecorder.mimeType || 'audio/webm' });
        if (blob.size) {
          setAudioType(blob.type);
          setAudioUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return URL.createObjectURL(blob); });
          setStatus('ready');
        } else setStatus('idle');
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };
      nextRecorder.start();
      setStatus('recording');
    } catch (reason) {
      if (reason?.name === 'NotAllowedError' || reason?.name === 'PermissionDeniedError') setError('Microphone access was denied. Allow microphone access in your browser settings and try again.');
      else if (reason?.name === 'NotFoundError') setError('No microphone was found. Connect a microphone and try again.');
      else setError(`Could not start recording: ${reason?.message || 'Please try again.'}`);
      setStatus('idle');
    }
  };
  const stop = () => { if (recorder.current?.state === 'recording') recorder.current.stop(); setStatus('processing'); };
  const discard = () => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(''); setStatus('idle'); setError('');
  };
  const save = () => {
    if (!audioUrl) return;
    const anchor = document.createElement('a');
    const extension = audioType.includes('mp4') || audioType.includes('aac') ? 'm4a' : 'webm';
    anchor.href = audioUrl; anchor.download = `a-message-for-shikha.${extension}`; anchor.click();
  };

  return (
    <div className="voice-card">
      <div className={`mic-orb ${status === 'recording' ? 'mic-live' : ''}`}><Mic size={29} /></div>
      <div className="voice-copy"><span className="eyebrow">{t('voiceSubhead')}</span><h3>{t('voicePrompt')}</h3><p>{t('voiceDescriptionInner')}</p></div>
      <div className="voice-actions">
        {status === 'idle' && <button type="button" className="button button-primary" onClick={start}><Mic size={17} /> {t('recordMessage')}</button>}
        {status === 'recording' && <><span className="recording-label"><i /> Recording…</span><button type="button" className="button button-dark" onClick={stop}><Square size={15} fill="currentColor" /> {t('stop')}</button></>}
        {status === 'processing' && <span role="status">{t('saving')}</span>}
        {status === 'ready' && <><button type="button" className="button button-primary" onClick={() => audioRef.current?.play()}><Play size={16} fill="currentColor" /> {t('play')}</button><button type="button" className="button button-light" onClick={save}><Download size={15} /> {t('saveAudio')}</button><button type="button" className="icon-button" onClick={discard} aria-label={t('deleteRecord')}><Trash2 size={17} /></button><audio ref={audioRef} src={audioUrl} controls className="audio-player" /></>}
      </div>
      {error && <p className="inline-error" role="alert">{error}</p>}
      {status === 'ready' && <button className="record-again" type="button" onClick={discard}><RotateCcw size={14} /> {t('deleteRecord')}</button>}
      {status === 'idle' && <span className="permission-note">{t('micNote')}</span>}
    </div>
  );
}
