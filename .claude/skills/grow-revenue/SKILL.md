---
name: grow-revenue
description: おうちクラウド Lab の収益化サイクルを1回まわす。戦略担当が作業を選び、執筆担当が書き、商品検証担当とレビュー担当が並行で確認してから main に公開する。「サイトを更新して」「記事を増やして」「収益化を進めて」と頼まれたときに使う。
---

# 収益化サイクル（マルチエージェント）

このサイトは AdSense の審査中で、**人（＝この手順のレビュー工程）を通していない記事は main に入れない**。下の順番を省略しない。

## 1. 戦略（revenue-strategist）
`revenue-strategist` を起動し、推奨作業リストを受け取る。原則として**1件目だけ**を今回の作業にする（量より質。1回のサイクルで公開するのは新規記事1本、または既存記事の改修2〜3本まで）。

## 2. 商品の検証（product-verifier）※商品を扱う作業のときだけ
戦略担当が挙げた商品候補を `product-verifier` に渡し、ASINと価格の検証結果を受け取る。
「確認済み」「検索結果で一致」のASINだけを、次の工程に渡す。「未確認」は `search` にする。

**Amazon.co.jp は WebFetch を 503 で拒否する（2026-11-28 時点）。** そのため product-verifier の結果が「未確認」ばかりになるときは、オーケストレーターがアプリ内ブラウザ（`mcp__Claude_Browser__*`）で `https://www.amazon.co.jp/dp/<ASIN>` を開き、次のJSで商品名・価格・在庫を読む。在庫切れで再入荷予定のない商品は使わない。
```js
({title: document.querySelector('#productTitle')?.innerText.trim(), price: document.querySelector('#corePrice_feature_div .a-offscreen, .a-price .a-offscreen')?.innerText, avail: document.querySelector('#availability')?.innerText.trim()})
```
検証済みの表はスクラッチパッドのファイルに保存し、執筆担当にはそのパスを渡す。

## 3. 執筆（article-writer）
次の情報をすべて依頼文に書いて `article-writer` を起動する（サブエージェントはこの会話を見られない）。
- 作業の種類と対象（新規ならトピックとキーワード、改修なら対象ファイル）
- 商品ごとの検証済みASIN・価格の表（2. の結果）
- 送るべき内部リンク
`npm run build` が ⚠️ なしで通ったという報告を受けるまで、次に進まない。

## 4. レビュー（compliance-reviewer）
`compliance-reviewer` に、変更したファイルと 2. の検証結果を渡して審査させる。
- 「要修正」 → 指摘を `article-writer` に渡して直させ、もう一度審査する（最大2往復）。
- 2往復しても合格しない場合、または「不合格」の場合 → main には入れず、`draft/<slug>` ブランチにコミットしてプッシュし、ユーザーに理由を報告する。

## 5. 公開
合格したら、オーケストレーター（このスキルを実行しているエージェント）が自分で最終確認する。
1. `git diff` を読み、レビュー後に意図しない変更が混ざっていないかを確かめる。
2. `npm run build` を実行する。
3. `docs/revenue-log.md` の「施策ログ」に1行追記する（日付、作業内容、対象slug、狙い）。
4. `main` にコミットしてプッシュする（deploy.yml が自動で公開する）。コミットメッセージには、作業内容とレビュー合格の旨を書く。
5. 新規記事なら `scripts/topics.txt` の該当行を `# [done]` にする。

## 6. 報告
ユーザーには、何を公開したか（URL `https://ouchicloudlab.github.io/articles/<slug>/`）、なぜそれを選んだか、`search` のまま残した商品、次のサイクルの候補を短く伝える。
売上レポート（Amazonアソシエイトの画面など）を共有されたら、その数字を `docs/revenue-log.md` の「売上記録」に追記する。戦略担当は、次回からその記録を根拠に使う。
