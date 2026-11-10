import { Heart } from 'lucide-react';

export default function Footer({ t }) {
  return <footer className="site-footer"><span>{t('footer')}</span><Heart size={16} fill="currentColor" /><a href="#home">{t('backTop')}</a></footer>;
}
