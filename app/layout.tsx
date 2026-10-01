import type { Metadata } from 'next';
import './globals.css';
import './showcase.css';
import './aine-motion.css';
import './feature-demos.css';
import './mic-call-story.css';
import './project-openings.css';
import './aine-call-photos.css';
import './nu-finale.css';
import './book-motion.css';
import './responsive-polish.css';
import { assetPath } from '@/lib/assets';
export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'ゆめこ、今日も創作中。 | AIとつくる制作室', description: 'BookVoice、AINE、育児ログ、IrodoriMicBridge。ゆめこがAIやCodexとつくった、読書・会話・記録・声の4作品を紹介します。', icons: {icon:assetPath('/yumeko-icon.png')} };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}
