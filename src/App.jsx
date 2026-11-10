import { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import Navbar from './components/Navbar.jsx';
import Memories from './components/Memories.jsx';
import ScratchCard from './components/ScratchCard.jsx';
import GiftBox from './components/GiftBox.jsx';
import LoveAnimations from './components/LoveAnimations.jsx';
import SisterQuiz from './components/SisterQuiz.jsx';
import SecretLetter from './components/SecretLetter.jsx';
import VoiceRecorder from './components/VoiceRecorder.jsx';
import NepaliSongs from './components/NepaliSongs.jsx';
import Countdown from './components/Countdown.jsx';
import HiddenSurprise from './components/HiddenSurprise.jsx';
import MemoryCard from './components/MemoryCard.jsx';
import Footer from './components/Footer.jsx';
import { createTranslator } from './data/translations.js';
import { publicAsset } from './lib/publicAsset.js';
import './App.css';

const CONFETTI_COLORS = ['#e987ac', '#a991d8', '#f4c96e', '#81c7b1', '#f29b78', '#d2a9e8'];

function useGentleMusic(enabled, setError) {
  const contextRef = useRef(null);
  const intervalRef = useRef(null);
  const activeNotes = useRef([]);

  useEffect(() => {
    if (!enabled) return undefined;
    let disposed = false;
    const playNote = async () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error('This browser does not support background music.');
        const context = contextRef.current || new AudioContextClass();
        contextRef.current = context;
        if (context.state === 'suspended') await context.resume();
        if (disposed) return;
        const progression = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
        const frequency = progression[Math.floor(Date.now() / 1200) % progression.length];
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.05);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(); oscillator.stop(context.currentTime + 1.08);
        activeNotes.current.push(oscillator);
        oscillator.onended = () => { activeNotes.current = activeNotes.current.filter((note) => note !== oscillator); };
      } catch (reason) {
        if (!disposed) setError(reason?.message || 'Background music could not be started.');
      }
    };
    playNote();
    intervalRef.current = window.setInterval(playNote, 1200);
    return () => {
      disposed = true;
      window.clearInterval(intervalRef.current);
      activeNotes.current.forEach((note) => { try { note.stop(); } catch { /* The note may already have ended. */ } });
      activeNotes.current = [];
    };
  }, [enabled, setError]);

  useEffect(() => () => { contextRef.current?.close(); }, []);
}

function Confetti({ burst }) {
  if (!burst) return null;
  return <div key={burst} className="confetti-layer" aria-hidden="true">
    {Array.from({ length: 42 }, (_, index) => <i key={`${burst}-${index}`} style={{
      '--x': `${(index * 37 + 3) % 100}%`,
      '--delay': `${(index % 10) * 0.035}s`,
      '--duration': `${1.5 + (index % 8) * 0.12}s`,
      '--color': CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      '--rotation': `${index * 47}deg`,
    }} />)}
  </div>;
}

function SectionHeading({ eyebrow, title, description, icon }) {
  return <div className="section-heading">
    <span className="eyebrow">{icon} {eyebrow}</span>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>;
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('shikha-bhaidooj-animations') !== 'false');
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState('');
  const [burst, setBurst] = useState(0);
  const [language, setLanguage] = useState(() => localStorage.getItem('shikha-bhaidooj-language') || 'en');
  const t = createTranslator(language);

  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useGentleMusic(musicOn, setMusicError);
  const toggleAnimations = () => setAnimationsEnabled((enabled) => {
    localStorage.setItem('shikha-bhaidooj-animations', String(!enabled));
    return !enabled;
  });
  const toggleMusic = () => { setMusicError(''); setMusicOn((active) => !active); };
  const celebrate = () => setBurst((count) => count + 1);
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem('shikha-bhaidooj-language', nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  if (!entered) return <WelcomeScreen onEnter={() => setEntered(true)} onToggleMusic={toggleMusic} musicOn={musicOn} language={language} onChangeLanguage={changeLanguage} t={t} />;

  return (
    <div className={`app-shell ${animationsEnabled ? '' : 'animations-off'}`}>
      <LoveAnimations enabled={animationsEnabled} />
      <Navbar animationsEnabled={animationsEnabled} onToggleAnimations={toggleAnimations} musicOn={musicOn} onToggleMusic={toggleMusic} language={language} onChangeLanguage={changeLanguage} t={t} />
      {musicError && <div className="music-error" role="status">{musicError}<button type="button" onClick={() => setMusicError('')} aria-label="Dismiss music message">×</button></div>}
      <main>
        <section className="intro-banner" id="home">
          <div className="intro-content">
            <span className="eyebrow"><Sparkles size={14} /> {t('introEyebrow')}</span>
            <h1>{t('introTitle')}<br /><em>{t('introTitleEm')}</em></h1>
            <p>{t('introBond')}</p>
            <a href="#memories" className="button button-primary">{t('wander')} <Heart size={16} fill="currentColor" /></a>
          </div>
          <div className="intro-photo-story">
            <div className="intro-feature-photo">
              <img src={publicAsset('/images/memories/bhai-tika-photo-2.jpeg')} alt="Shikha celebrating Bhai Tika with her brother" />
              <span className="intro-photo-caption">{t('sisterHeart')}</span>
            </div>
            <div className="intro-side-photo">
              <img src={publicAsset('/images/memories/shikha-photo-1.jpeg')} alt="A favorite portrait of Shikha" />
              <span>{t('favoritePerson')}</span>
            </div>
            <span className="intro-photo-sparkle sparkle-one">✦</span>
            <span className="intro-photo-sparkle sparkle-two">♡</span>
          </div>
        </section>

        <Memories t={t} />

        <section className="section surprise-section" id="surprise">
          <SectionHeading eyebrow={t('surpriseEyebrow')} title={t('surpriseTitle')} description={t('surpriseDescription')} icon="♡" />
          <div className="surprise-layout">
            <ScratchCard t={t} />
            <div className="surprise-note"><span className="note-doodle">✿</span><h3>{language === 'en' ? <>Some things deserve<br />a little reveal.</> : t('surpriseNoteTitle')}</h3><p>{t('surpriseNoteBody')}</p><span className="note-sign">{t('surpriseNoteSign')}</span></div>
          </div>
        </section>

        <section className="section gifts-section" id="gifts">
          <SectionHeading eyebrow={t('giftsEyebrow')} title={t('giftsTitle')} description={t('giftsDescription')} icon="🎁" />
          <GiftBox onCelebrate={celebrate} t={t} />
        </section>

        <section className="quiz-section" id="quiz">
          <div className="quiz-decoration" aria-hidden="true">♡</div>
          <div className="section quiz-inner">
            <SectionHeading eyebrow={t('quizEyebrow')} title={t('quizTitle')} description={t('quizDescription')} icon="✦" />
            <SisterQuiz t={t} language={language} />
            <p className="quiz-customize"><span>{t('quizCustomize')}</span> <code>src/data/quizQuestions.js</code>.</p>
          </div>
        </section>

        <section className="section letter-section" id="letter">
          <SectionHeading eyebrow={t('letterEyebrow')} title={t('letterTitle')} description={t('letterDescription')} icon="💌" />
          <SecretLetter t={t} language={language} />
        </section>

        <NepaliSongs t={t} />

        <section className="section voice-section" id="voice">
          <SectionHeading eyebrow={t('voiceEyebrow')} title={t('voiceTitle')} description={t('voiceDescription')} icon="🎙️" />
          <VoiceRecorder t={t} />
        </section>

        <section className="countdown-wrap">
          <Countdown t={t} />
        </section>

        <section className="hidden-section" aria-label="One last little surprise">
          <HiddenSurprise onCelebrate={celebrate} t={t} />
        </section>

        <section className="section card-section" id="memory-card">
          <SectionHeading eyebrow={t('cardEyebrow')} title={t('cardTitle')} description={t('cardDescription')} icon="♡" />
          <MemoryCard t={t} onCelebrate={celebrate} />
        </section>
      </main>
      <Footer t={t} />
      <Confetti burst={burst} />
    </div>
  );
}
