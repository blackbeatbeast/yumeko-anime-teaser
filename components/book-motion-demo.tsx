'use client';
import { MousePointer2 } from 'lucide-react';
import { assetPath } from '@/lib/assets';
import FeatureDemo, { type FeatureState } from './feature-demo';
const scenes=[
 {label:'本を開く',title:'いつもの書店から、読みたい一冊。',detail:'作品を選ぶ。本文を開く。',duration:10000},
 {label:'読む範囲',title:'どこから、どこまで。',detail:'範囲を決めて、声を準備。',duration:11000},
 {label:'声を分ける',title:'地の文と、台詞の声。',detail:'同じ本に、ふたつの話し方。',duration:9500},
];
function BookScene({index,time}:FeatureState){
 const frame=index===0?(time<4200?'shop':'viewer'):index===1?(time<2200?'viewer':time<6100?'range':'prepare'):(time<3700?'narration':'dialogue');
 const pointer=index===0&&time>3100&&time<4200||index===1&&time>5300&&time<6300||index===2&&time>3000&&time<3900;
 return <div className={`book-native-scene book-frame-${frame}`}>
  <picture key={frame}><source media="(max-width:640px)" srcSet={assetPath(`/demos/book-${frame}-360.webp`)} /><img src={assetPath(`/demos/book-${frame}-1200.webp`)} alt="" width={1200} height={750} loading="lazy" /></picture>
  {pointer&&<MousePointer2 className="pv-pointer book-pointer" size={27} fill="#ffd34a" />}
 </div>;
}
export default function BookMotionDemo(){
 return <FeatureDemo id="bookvoice" name="BookVoice" scenes={scenes} className="book-stage" description="BookVoiceの実際のUIを隔離して撮影した、架空の本による紹介。BOOK☆WALKERの公開UIを参照した本文表示です。本を開く、読む範囲を選ぶ、地の文と台詞の設定を変える流れを示します。実書籍、ログイン情報、音声生成は使用していません。">{state=><BookScene {...state}/>}</FeatureDemo>;
}
