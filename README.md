# 260922_bakery_trip

2026年9月22日（火・休日）に、袋井・愛野周辺の自宅から東京・埼玉のパン店を巡り、同日中に自宅へ戻るためのスマートフォン向けデジタルカタログです。

公開ページ: https://bluewindlife.github.io/260922_bakery_trip/

## v0.5.0

- 9/21案・宿泊地に依存しない「自宅発・自宅着」の日帰り工程へ確定
- 05:00出発を維持し、下田流の開店待ちを前提から除外
- 本命順を **下田流 → 赤坂おぎ乃 和甘 → maru bagel → Comme'N TOKYO 本店** のまま維持
- 和甘はJRE MALLの9月商品「アールグレイロイヤルミルクティー」を中心に更新
- maru bagelは9/22商品を未確定と明示し、公式LINEリンクと安全側の予約期限を掲載
- Comme'Nの「たまご明太サンド」を公式現行メニューで再確認
- 本命は複数写真、比較候補は原則1店1枚。teconaは実食結果により写真カードから除外
- 画像マークアップをHTMLへ一本化し、JavaScriptによる二重生成を廃止
- 読込失敗したfigureと空galleryを自動削除
- CSS/JSにバージョン付きURLを付け、ブラウザキャッシュを更新
- Pages公開後にGitHub Actions内の実ブラウザ（390px幅・1024px幅）で表示検証

調査基準日: 2026-09-15（日本時間）

## 公開

Pages Sourceは **GitHub Actions** です。main更新時に .github/workflows/pages.yml が静的ファイルを公開し、その後に公開URLをChromeで検証します。

## 構成

- index.html — 旅程、店舗カード、写真、根拠リンク
- style.css — モバイル優先UI
- script.js — チェックリスト、当日ステータス、画像失敗時の除去
- scripts/verify-source.mjs — 公開前の構造・重複検査
- scripts/verify-pages.mjs — 公開後の実ブラウザ検査
- .github/workflows/pages.yml — GitHub Pages公開と検証

画像は公式サイト等から出典付きで外部読み込みし、リポジトリには転載していません。ユーザー提供写真は使用していません。
