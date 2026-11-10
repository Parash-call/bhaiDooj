import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function HiddenSurprise({ onCelebrate, t }) {
  const [revealed, setRevealed] = useState(false);
  const reveal = () => { setRevealed(true); onCelebrate(); };
  return (
    <div className={`hidden-surprise ${revealed ? 'hidden-revealed' : ''}`}>
      {!revealed ? <button type="button" className="button button-secret" onClick={reveal}>{t('secretButton')}</button> :
        <div className="secret-message" role="status"><Sparkles size={21} /><p>{t('secretMessage')}</p><Heart fill="currentColor" size={20} /></div>}
    </div>
  );
}
