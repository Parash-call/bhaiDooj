import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function SecretLetter({ t }) {
  const [shown, setShown] = useState(0);
  const letter = t('letterBody');
  useEffect(() => {
    setShown(0);
  }, [letter]);
  useEffect(() => {
    if (shown >= letter.length) return undefined;
    const timer = window.setTimeout(() => setShown((value) => Math.min(value + 3, letter.length)), 14);
    return () => window.clearTimeout(timer);
  }, [shown]);
  const replay = () => setShown(0);
  return (
    <div className="letter-card">
      <div className="letter-stamp" aria-hidden="true">♡</div>
      <span className="letter-topline">{t('letterNote')}</span>
      <h3>{t('dearLaxmi')} <span>❤️</span></h3>
      <p className="letter-body" aria-live="polite">{letter.slice(0, shown)}{shown < letter.length && <span className="type-cursor">|</span>}</p>
      {shown >= letter.length && <p className="letter-signoff">{t('signoff')} <span>{t('signoffBrother')}</span></p>}
      <button type="button" className="button button-outline" onClick={replay}><RotateCcw size={16} /> {t('letterReplay')}</button>
    </div>
  );
}
