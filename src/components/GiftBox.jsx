import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';

const gifts = [
  { title: 'A little reminder', icon: '🌟', message: 'You make every room brighter just by being your wonderfully real self.' },
  { title: 'A forever memory', icon: '🧸', message: 'We met five years ago, and I’m so glad our friendship grew into family.' },
  { title: 'From my heart', icon: '💌', message: 'Whatever changes, wherever life takes us, you will always have me in your corner.' },
];

export default function GiftBox({ onCelebrate, t }) {
  const [opened, setOpened] = useState([]);
  const toggle = (index) => {
    setOpened((current) => current.includes(index) ? current : [...current, index]);
    onCelebrate();
  };
  return (
    <div className="gift-grid">
      {gifts.map((gift, index) => {
        const isOpen = opened.includes(index);
        return <button type="button" key={gift.title} className={`gift-card ${isOpen ? 'gift-open' : ''}`} aria-expanded={isOpen} onClick={() => toggle(index)}>
          <span className="gift-card-top"><span className="gift-emoji">{gift.icon}</span><span className="gift-number">Little gift 0{index + 1}</span></span>
          <span className="mini-gift" aria-hidden="true"><span className="mini-gift-lid" /><span className="mini-gift-body"><i /></span><span className="mini-gift-bow">∞</span></span>
          <span className="gift-card-title">{isOpen ? t('giftTitles')[index] : t('giftOpen')}</span>
          <span className="gift-reveal">{isOpen ? t('giftMessages')[index] : <><Gift size={15} /> {t('giftInside')}</>}</span>
          {isOpen && <Sparkles className="gift-sparkle" size={19} aria-hidden="true" />}
        </button>;
      })}
    </div>
  );
}
