import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Heart, Share2, Sparkles } from 'lucide-react';
import { publicAsset } from '../lib/publicAsset.js';

export default function MemoryCard({ t, onCelebrate }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const makePng = async () => {
    if (!cardRef.current) return;
    return toPng(cardRef.current, { pixelRatio: 3, backgroundColor: '#fff8f8', cacheBust: true, skipFonts: true });
  };
  const download = async () => {
    setDownloading(true); setError(''); setShareMessage('');
    try {
      const dataUrl = await makePng();
      const anchor = document.createElement('a');
      anchor.download = 'bhai-dooj-for-laxmi.png'; anchor.href = dataUrl; anchor.click();
      onCelebrate();
    } catch (reason) {
      setError(`Could not create the card image: ${reason?.message || 'Please try again.'}`);
    } finally { setDownloading(false); }
  };
  const share = async () => {
    setDownloading(true); setError(''); setShareMessage('');
    try {
      const dataUrl = await makePng();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'bhai-dooj-for-laxmi.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Happy Bhai Dooj, Laxmi!', text: 'A little card made with love by your brother. 💗', files: [file] });
        setShareMessage(t('shareSuccess'));
        onCelebrate();
      } else {
        const anchor = document.createElement('a');
        anchor.download = file.name; anchor.href = dataUrl; anchor.click();
        setShareMessage(t('shareFallback'));
        onCelebrate();
      }
    } catch (reason) {
      if (reason?.name !== 'AbortError') setError(`Could not share the card: ${reason?.message || 'Please try again.'}`);
    } finally { setDownloading(false); }
  };
  return (
    <div className="memory-download-layout">
      <div className="download-note"><span className="eyebrow">{t('cardKeepsake')}</span><h3>{t('cardSubhead')}</h3><p>{t('cardDescriptionInner')}</p><div className="card-actions"><button type="button" className="button button-primary" onClick={download} disabled={downloading}>{downloading ? t('makingCard') : <><Download size={17} /> {t('downloadCard')}</>}</button><button type="button" className="button button-light" onClick={share} disabled={downloading}><Share2 size={16} /> {t('shareCard')}</button></div>{shareMessage && <p className="share-message" role="status">{shareMessage}</p>}{error && <p className="inline-error" role="alert">{error}</p>}</div>
      <div className="memory-card-frame" ref={cardRef}>
        <span className="card-decoration card-flower">✿</span><span className="card-decoration card-star">✦</span><span className="card-decoration card-heart">♡</span>
        <div className="card-illustration"><img src={publicAsset('/images/memories/laxmi2.jpg.jpeg')} alt="A childhood photo of Laxmi with her brother" /><i aria-hidden="true">💗</i></div>
        <span className="card-eyebrow"><Sparkles size={13} /> {t('cardGreeting')}</span>
        <h3>{t('happy')}<br /><em>Bhai Dooj</em></h3>
        <span className="card-to">{t('toSister')}</span>
        <strong className="card-name">Laxmi</strong>
        <span className="card-rule"><Heart size={13} fill="currentColor" /></span>
        <p className="card-message">{t('cardMessage')}<br />{t('cardMessageSecond')}</p>
        <span className="card-from">{t('cardFrom')}</span>
      </div>
    </div>
  );
}
