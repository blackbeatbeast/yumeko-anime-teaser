import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ゆめこ、今日も自爆中。 | アニメ風ティザー', description: '勝ちたい。遊びたい。口が先に動く。ぬ普及委員長・ゆめこの、ゲームと日常を描くアニメ風コンセプトサイト。', icons: {icon:'/yumeko-icon.png'} };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="ja"><body>{children}</body></html>}
