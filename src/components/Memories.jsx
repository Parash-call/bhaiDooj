import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';
import { memories as starterMemories } from '../data/memories.js';
import { deleteSavedPhoto, getSavedPhotos, savePhoto } from '../lib/photoStore.js';
import { publicAsset } from '../lib/publicAsset.js';

export default function Memories({ t }) {
  const [items, setItems] = useState(starterMemories);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState('All moments');
  const [storageMessage, setStorageMessage] = useState('');
  const picker = useRef(null);
  const uploadedUrls = useRef([]);
  const categories = ['All moments', 'Portraits'];
  const visibleItems = category === 'All moments' ? items : items.filter((item) => item.category === category);

  useEffect(() => {
    let activeEffect = true;
    getSavedPhotos().then((savedPhotos) => {
      if (!activeEffect) return;
      const restored = savedPhotos.map((photo) => {
        const image = URL.createObjectURL(photo.blob);
        uploadedUrls.current.push(image);
        return { ...photo, image, savedLocally: true };
      });
      setItems((current) => [...current, ...restored.filter((photo) => !current.some((item) => item.id === photo.id))]);
    }).catch((reason) => {
      if (activeEffect) setStorageMessage(`Could not load saved photos: ${reason.message}`);
    });
    return () => {
      activeEffect = false;
      uploadedUrls.current.forEach((url) => URL.revokeObjectURL(url));
      uploadedUrls.current = [];
    };
  }, []);
  useEffect(() => {
    if (!selected) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const addPhotos = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    const additions = files.map((file) => {
      const image = URL.createObjectURL(file);
      uploadedUrls.current.push(image);
      return {
        id: `uploaded-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        caption: 'A new page in our story together.',
        blob: file,
        image,
        color: 'lavender',
        category: 'Portraits',
        savedLocally: true,
      };
    });
    setItems((current) => [...current, ...additions]);
    setCategory('All moments');
    event.target.value = '';
    const results = await Promise.allSettled(additions.map((photo) => savePhoto({
      id: photo.id,
      title: photo.title,
      caption: photo.caption,
      category: photo.category,
      color: photo.color,
      blob: photo.blob,
      savedAt: new Date().toISOString(),
    })));
    const failures = results.filter((result) => result.status === 'rejected');
    setStorageMessage(failures.length
      ? `${failures.length} photo${failures.length === 1 ? '' : 's'} could not be saved permanently; they are only available until this page is refreshed.`
      : 'Your photos are saved privately on this device and will be here when you return.');
  };
  const move = (direction) => setActive((current) => (current + direction + visibleItems.length) % visibleItems.length);
  const removePhoto = async (photo) => {
    try {
      await deleteSavedPhoto(photo.id);
      URL.revokeObjectURL(photo.image);
      uploadedUrls.current = uploadedUrls.current.filter((url) => url !== photo.image);
      setItems((current) => current.filter((item) => item.id !== photo.id));
      setSelected(null);
      setStorageMessage('Photo removed from this device.');
    } catch (reason) {
      setStorageMessage(`Could not remove this photo: ${reason.message}`);
    }
  };

  return (
    <section className="section memories-section" id="memories">
      <div className="section-heading">
        <span className="eyebrow">{t('memoriesEyebrow')}</span>
        <h2>{t('memoriesTitle')} <span>🌷</span></h2>
        <p>{t('memoriesDescription')}</p>
      </div>
      <div className="memory-controls">
        <button className="button button-light" onClick={() => picker.current?.click()} type="button"><ImagePlus size={17} /> {t('addPhotos')}</button>
        <input ref={picker} className="visually-hidden" type="file" accept="image/*" multiple onChange={addPhotos} aria-label="Choose sibling photographs" />
        <div className="gallery-arrows">
          <button type="button" className="icon-button" aria-label="Previous memory" onClick={() => move(-1)}><ChevronLeft /></button>
          <span>{String(active + 1).padStart(2, '0')} <span className="muted">/ {String(visibleItems.length).padStart(2, '0')}</span></span>
          <button type="button" className="icon-button" aria-label="Next memory" onClick={() => move(1)}><ChevronRight /></button>
        </div>
      </div>
      <p className="memory-upload-note">{t('temporaryPhotos')}</p>
      {storageMessage && <p className="storage-message" role="status">{storageMessage}</p>}
      <div className="memory-filters" role="group" aria-label="Filter photos by collection">
        {categories.map((name) => <button key={name} type="button" className={`memory-filter ${category === name ? 'is-selected' : ''}`} aria-pressed={category === name} onClick={() => { setCategory(name); setActive(0); }}>{t(name === 'All moments' ? 'allMoments' : 'portraits')}<span>{name === 'All moments' ? items.length : items.filter((item) => item.category === name).length}</span></button>)}
      </div>
      <div className="polaroid-grid">
        {visibleItems.map((memory, index) => (
          <button type="button" className={`polaroid polaroid-${memory.color || 'lavender'} ${index === active ? 'polaroid-active' : ''}`} key={`${memory.title}-${index}`} onClick={() => { setSelected(memory); setActive(index); }} aria-label={`View ${memory.title}`}>
            <span className="polaroid-picture">
              {memory.image ? <img src={memory.savedLocally || memory.image.startsWith('blob:') ? memory.image : publicAsset(memory.image)} alt={memory.title} /> : <span className="placeholder-art"><span>{memory.art}</span><i>♡</i><b>✦</b></span>}
              <span className="photo-zoom">{t('viewMemory')}</span>
            </span>
            <span className="memory-category">{memory.category || 'Our moments'}{memory.savedLocally ? ' · Saved here' : ''}</span>
            <span className="polaroid-title">{memory.title}</span>
            <span className="polaroid-caption">{memory.caption}</span>
          </button>
        ))}
      </div>
      <div className="timeline">
        <span className="timeline-line" />
        {['Growing up together', 'School days and shared memories', 'Sisters by heart'].map((label, index) => (
          <div className="timeline-stop" key={label}><span className="timeline-dot">{['✿', '♡', '✦'][index]}</span><span>{label}</span></div>
        ))}
      </div>
      {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
        <button type="button" className="lightbox-close icon-button" onClick={() => setSelected(null)} aria-label="Close photo"><X /></button>
        <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
          {selected.image ? <img src={selected.savedLocally || selected.image.startsWith('blob:') ? selected.image : publicAsset(selected.image)} alt={selected.title} /> : <div className={`placeholder-art lightbox-art ${selected.color}`}><span>{selected.art}</span></div>}
          <h3>{selected.title}</h3><p>{selected.caption}</p>
          {selected.savedLocally && <button type="button" className="button button-light" onClick={() => removePhoto(selected)}>{t('removePhoto')}</button>}
        </div>
      </div>}
    </section>
  );
}
