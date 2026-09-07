# ゆめこ、今日も自爆中。

ピンク髪のXアイコンを主人公にしたアニメ風ティザーサイト。計画書Ver.2（2026-09-08）に基づく初版。

## 内容

- 主役の描き起こしと表情切替（対戦／日常／好奇心）
- 展開して読める創作エピソード3本
- 現在：鉄拳8、ファーカムラム／クニミツ（2026-09-08ユーザー確認）
- 過去：鉄拳7・NARAKAの配信リンク
- ＼ぬ／ボタン、モーション低減への対応

## 開発

Node.js 22.13以降。npm ci → npm run dev。npm run buildで配信用Workerを生成。

## 確認

npm run build と npx tsc --noEmit、npx oxlint appを実施。HTTP応答を確認。
ブラウザーによる画面幅別の目視・操作検証は未実施。
全体のnpm run lintには、未使用のスターター同梱components/uiとhooksに既存の警告・エラーがある。アプリ固有コードの検査は通過。

## 素材・出典

主役はhttps://x.com/Yumeko_TEKKEN/photo のアイコンを参照。本人のバナー画像は使用していない。
ビルトインImageGenで描き起こした2表情をpublic/yumeko-hero.png、public/yumeko-reaction.pngに保存。元アイコンはpublic/yumeko-icon.png。
生成画像は白い不透明背景。透明PNGとして扱わず、白い枠付きのビジュアル面へ配置した。好奇心モードには笑顔素材を再利用。
完全な生成指示はdocs/asset-prompts.md。サイトの台詞・エピソードは創作であり、実際の発言や放送予定の告知ではない。

## 公開

Sites用の設定は.openai/hosting.json。秘密情報や環境変数、依存関係、生成ビルドはGitへ含めない。

