import { useMemo } from 'react';

const decorations = ['✦', '♡', '✿', '✧', '♥', '❀', '⋆', '🦋'];

export default function LoveAnimations({ enabled }) {
  const items = useMemo(
    () => Array.from({ length: 22 }, (_, index) => ({
      id: index,
      symbol: decorations[index % decorations.length],
      left: `${(index * 47 + 9) % 100}%`,
      delay: `${(index % 9) * -1.7}s`,
      duration: `${12 + (index % 7) * 2}s`,
      size: `${12 + (index % 5) * 4}px`,
    })),
    [],
  );
  if (!enabled) return null;

  return (
    <div className="ambient-decor" aria-hidden="true">
      {items.map((item) => (
        <span key={item.id} style={{ left: item.left, animationDelay: item.delay, animationDuration: item.duration, fontSize: item.size }}>
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
