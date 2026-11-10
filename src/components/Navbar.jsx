import { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { languageNames } from '../data/translations.js';

export default function Navbar({ animationsEnabled, onToggleAnimations, musicOn, onToggleMusic, language, onChangeLanguage, t }) {
  const [open, setOpen] = useState(false);
  const links = [
    [t('home'), 'home'], [t('memoriesNav'), 'memories'], [t('surpriseNav'), 'surprise'], [t('giftsNav'), 'gifts'],
    [t('quizNav'), 'quiz'], [t('letterNav'), 'letter'], [t('songsNav'), 'songs'], [t('voiceNav'), 'voice'], [t('cardNav'), 'memory-card'],
  ];
  return (
    <header className="site-nav">
      <a className="brand" href="#home" onClick={() => setOpen(false)} aria-label="A Magical World for Laxmi, home">
        <span className="brand-mark"><Heart size={17} fill="currentColor" /></span>
        <span>For Laxmi <span className="brand-heart">♥</span></span>
      </a>
      <button className="menu-toggle icon-button" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="nav-tools">
        <label className="language-control">
          <span className="visually-hidden">{t('language')}</span>
          <select value={language} onChange={(event) => onChangeLanguage(event.target.value)} aria-label={t('language')}>
            {Object.entries(languageNames).map(([code, name]) => <option value={code} key={code}>{name}</option>)}
          </select>
        </label>
        <button type="button" className={`nav-pill ${musicOn ? 'active' : ''}`} onClick={onToggleMusic} aria-pressed={musicOn} title="Toggle gentle background music">
          <span aria-hidden="true">{musicOn ? '♫' : '♪'}</span><span className="tool-label">{t('music')}</span>
        </button>
        <button type="button" className={`nav-pill ${animationsEnabled ? 'active' : ''}`} onClick={onToggleAnimations} aria-pressed={animationsEnabled} title="Toggle decorative animations">
          <span aria-hidden="true">✦</span><span className="tool-label">{animationsEnabled ? t('magicOn') : t('magicOff')}</span>
        </button>
      </div>
    </header>
  );
}
