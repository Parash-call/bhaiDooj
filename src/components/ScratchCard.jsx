import { useEffect, useRef, useState } from 'react';
import { Eraser, Sparkles } from 'lucide-react';

export default function ScratchCard({ t }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, '#f5bcda');
      gradient.addColorStop(0.5, '#d7c8f4');
      gradient.addColorStop(1, '#f6d5bd');
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = gradient;
      context.fillRect(0, 0, rect.width, rect.height);
      context.fillStyle = 'rgba(255,255,255,.55)';
      for (let x = 14; x < rect.width; x += 32) for (let y = 16; y < rect.height; y += 32) {
        context.beginPath(); context.arc(x, y, 1.4, 0, Math.PI * 2); context.fill();
      }
      context.globalCompositeOperation = 'destination-out';
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const erase = (event) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return;
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    context.globalCompositeOperation = 'destination-out';
    context.beginPath(); context.arc(x, y, 25, 0, Math.PI * 2); context.fill();
    if (!drawing.current) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 32) transparent++;
    if (transparent / (pixels.length / 4) > 0.43) setRevealed(true);
  };
  const onPointerDown = (event) => { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); erase(event); };
  const onPointerUp = () => { drawing.current = false; };

  return (
    <div className={`scratch-card ${revealed ? 'scratch-revealed' : ''}`}>
      <div className="scratch-message"><span className="scratch-heart">💗</span><p>{t('scratchMessage')}</p><small>{t('scratchSignoff')}</small></div>
      {!revealed && <canvas ref={canvasRef} className="scratch-canvas" aria-label="Scratch away this layer to reveal a message" onPointerDown={onPointerDown} onPointerMove={(event) => drawing.current && erase(event)} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} />}
      {!revealed && <div className="scratch-label" aria-hidden="true"><Eraser size={18} /> {t('scratchHint')}</div>}
      {!revealed && <button className="scratch-keyboard-reveal" type="button" onClick={() => setRevealed(true)}><Sparkles size={15} /> {t('revealMessage')}</button>}
      {revealed && <span className="revealed-badge">A little love, just for you ✨</span>}
    </div>
  );
}
