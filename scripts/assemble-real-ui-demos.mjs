// Assemble screenshots captured from isolated copies of the real application UI.
 // Application source and fixture adapters remain in ignored work/real-ui.
import {mkdirSync,writeFileSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ffmpeg=require('../work/qa/node_modules/ffmpeg-static');
const input=resolve('work/real-ui/screens'),out=resolve('public/demos');
mkdirSync(out,{recursive:true});
const items=[
 {id:'bookvoice',prefix:'book',size:'960:600',poster:3,captions:['架空の短編を、実際の操作画面に表示。','実際の「ページ範囲」で1〜3ページを指定。','実際の「声と設定」で台詞の話し方を選ぶ。音声再生なし。']},
 {id:'aine',prefix:'aine',size:'960:600',poster:3,captions:['実際のAINE画面で、架空の相手ソラとの会話を開く。','実際の入力欄に、紹介用のメッセージを入力。','デモモードの台本返信を表示。AI・相手への通信なし。']},
 {id:'babylog',prefix:'baby',size:'440:900',poster:2,captions:['既存の確認用画面で、架空のこまめの記録を表示。','実際のミルク入力画面で、架空の80mLを保存。','実際の紙ビューに切り替える。記録は隔離画面のメモリ内だけ。']},
 {id:'micbridge',prefix:'mic',size:'960:720',poster:2,captions:['実際のUI部品を表示。デバイス名と状態は紹介用。','架空の文章を入力し、「Irodori音声」を選ぶ画面。','「ミュート」に切り替える。音声処理・デバイス接続なし。']},
];
function run(args){const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{encoding:'utf8',windowsHide:true});if(result.status!==0)throw new Error(result.stderr);}
for(const item of items){
 const inputs=[];
 for(let n=1;n<=3;n++){
  const png=resolve(input,item.prefix+'-'+n+'.png');
  inputs.push('-loop','1','-framerate','24','-t','4.6','-i',png);
  run(['-i',png,'-c:v','libwebp','-quality','88',resolve(out,item.id+'-'+n+'.webp')]);
 }
 const filter=[0,1,2].map(n=>'['+n+':v]scale='+item.size+',setsar=1,format=yuv420p[v'+n+']').join(';')+';[v0][v1]xfade=transition=fade:duration=0.4:offset=4.2[x];[x][v2]xfade=transition=fade:duration=0.4:offset=8.4[video]';
 run([...inputs,'-filter_complex',filter,'-map','[video]','-t','13','-an','-c:v','libx264','-preset','medium','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',resolve(out,item.id+'.mp4')]);
 run(['-i',resolve(out,item.id+'.mp4'),'-an','-c:v','libvpx-vp9','-crf','32','-b:v','0','-row-mt','1',resolve(out,item.id+'.webm')]);
 run(['-i',resolve(input,item.prefix+'-'+item.poster+'.png'),'-c:v','libwebp','-quality','88',resolve(out,item.id+'.webp')]);
 writeFileSync(resolve(out,item.id+'.vtt'),'WEBVTT\n\n'+item.captions.map((text,n)=>`${n+1}\n${['00:00.000','00:04.400','00:08.600'][n]} --> ${['00:04.399','00:08.599','00:13.000'][n]}\n${text}\n`).join('\n'));
 console.log(JSON.stringify({id:item.id,dimensions:item.size,duration:13,mp4:statSync(resolve(out,item.id+'.mp4')).size}));
}

