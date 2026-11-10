import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

const PARTS = ['days', 'hours', 'minutes', 'seconds'];

export default function Countdown({ t }) {
  const [target, setTarget] = useState(() => localStorage.getItem('shikha-bhaidooj-date') || '');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const updateDate = (event) => {
    setTarget(event.target.value);
    localStorage.setItem('shikha-bhaidooj-date', event.target.value);
  };
  const targetTime = target ? new Date(`${target}T00:00:00`).getTime() : NaN;
  const remaining = Number.isFinite(targetTime) ? Math.max(0, targetTime - now) : 0;
  const units = {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
  return (
    <div className="countdown-card">
      <div className="countdown-heading"><span className="countdown-icon"><CalendarDays size={19} /></span><div><span className="eyebrow">{t('countdownEyebrow')}</span><h3>{t('countdownTitle')}</h3></div></div>
      <label className="date-picker">{t('setDate')}<input type="date" value={target} onChange={updateDate} /></label>
      {!target ? <p className="countdown-hint">{t('countdownHint')}</p> : remaining === 0 ? <div className="celebration-message" role="status">{t('celebration')}</div> : <div className="countdown-units" aria-live="polite">{PARTS.map((key) => <div className="countdown-unit" key={key}><strong>{String(units[key]).padStart(2, '0')}</strong><span>{t(key)}</span></div>)}</div>}
    </div>
  );
}
