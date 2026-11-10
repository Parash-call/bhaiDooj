import { useState } from 'react';
import { ArrowDown, Heart, Sparkles } from 'lucide-react';

import { languageNames } from '../data/translations.js';

export default function WelcomeScreen({ onEnter, onToggleMusic, musicOn, language, onChangeLanguage, t }) {
  const [entering, setEntering] = useState(false);
  const open = () => {
    setEntering(true);
    window.setTimeout(onEnter, 650);
  };
  return (
    <section className={`welcome-screen ${entering ? 'welcome-leaving' : ''}`} id="home">
      <div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" />
      <label className="welcome-language">
        <span className="visually-hidden">{t('language')}</span>
        <select value={language} onChange={(event) => onChangeLanguage(event.target.value)} aria-label={t('language')}>
          {Object.entries(languageNames).map(([code, name]) => <option value={code} key={code}>{name}</option>)}
        </select>
      </label>
      <div className="welcome-copy">
        <div className="welcome-eyebrow"><Sparkles size={15} /> {t('welcomeEyebrow')}</div>
        <h1>Hey Laxmi! <span className="hero-heart">❤️</span></h1>
        <p>{t('welcomeSubtitle')}</p>
        <p className="welcome-bond">{t('welcomeBond')}</p>
        <button type="button" className="button button-primary welcome-button" onClick={open}>
          {t('openSurprise')} <Heart size={18} fill="currentColor" />
        </button>
        <button type="button" className="welcome-music" onClick={onToggleMusic} aria-pressed={musicOn}>
          <span className="music-bars" aria-hidden="true"><i /><i /><i /><i /></span>
          {musicOn ? t('pauseTune') : t('playTune')}
        </button>
      </div>
      <div className="welcome-art" aria-label="A little illustrated gift and sibling characters">
        <span className="welcome-spark spark-a">✦</span><span className="welcome-spark spark-b">✧</span>
        <div className="cartoon-scene">
          <div className="cartoon-person brother"><span className="person-hair">⌒</span><span className="person-face">◡</span><span className="person-body">♡</span></div>
          <div className="cartoon-person sister"><span className="person-hair">✿</span><span className="person-face">◡</span><span className="person-body">♡</span></div>
          <span className="scene-heart">♥</span>
          <div className="gift-illustration" aria-hidden="true"><span className="gift-lid" /><span className="gift-box"><i /></span><span className="gift-bow">∞</span></div>
        </div>
        <div className="welcome-ground" />
        <span className="welcome-flower flower-left">✿</span><span className="welcome-flower flower-right">❀</span>
      </div>
      <a className="scroll-cue" href="#memories"><span>{t('comeIn')}</span><ArrowDown size={15} /></a>
    </section>
  );
}
