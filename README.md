# おうちクラウド Lab

自宅サーバー・homelab機材（ミニPC / NAS / ネットワーク）の比較アフィリエイトメディア。
**Markdownを1本追加するだけで記事が増える**静的サイト＋**Claude APIによる記事自動生成**＋**GitHub Actionsでの自動公開**まで組み込み済み。

---

## 仕組み（全体像）

```
ネタ(scripts/topics.txt)
   │  週次 cron (GitHub Actions)
   ▼
Claude API で記事生成 → src/content/articles/*.md をコミット
   │  push を検知
   ▼
GitHub Actions が npm run build → GitHub Pages に自動公開
```

あなたが継続的にやることは「月1〜2回、生成記事の価格・型番・アフィリンクをチェック」だけ。

---

## ローカルでの使い方

```bash
npm install       # 初回のみ
npm run build     # dist/ を生成
npm run serve     # http://localhost:4321 で確認
# もしくは
npm run dev       # build + serve
```

### 記事を書く（手動）

`src/content/articles/` に `.md` を追加するだけ。frontmatterのスキーマは既存3記事を参照。

- `type: comparison` … 本文に `<!-- COMPARE -->`（比較表）と `<!-- PRODUCTS -->`（商品カード）を置くと、frontmatterの `products:` から自動描画される。
- `<!-- AD -->` … 記事内広告枠に展開される。

### 記事を自動生成する

```bash
ANTHROPIC_API_KEY=sk-... node scripts/generate-article.mjs "自宅NAS おすすめ比較"
```

生成後は必ず内容を確認し、`affiliate.amazon` の `REPLACE_ASIN_xxx` を実際のASINに差し替える。

---

## 公開（初回セットアップ）

### 1. 収益化アカウント（先に申請しておく）
- **Amazonアソシエイト**: 承認後、トラッキングID（例 `xxxx-22`）を `src/lib/config.mjs` の `affiliate.amazonTag` に設定
- **Google AdSense**: 承認後、`src/lib/config.mjs` の `ads.adsenseClient` と各 `slots` を設定
  - ※未設定の間は広告枠プレースホルダ／商品ページ直リンクになるので、審査前でも表示は崩れない

### 2. ドメインとサイトURL
- `src/lib/config.mjs` の `site.url` を本番URLに変更（AdSense/アソシエイト審査には独自ドメイン推奨）

### 3. GitHubへ公開
```bash
git init && git add . && git commit -m "init: おうちクラウド Lab"
gh repo create ouchi-cloud-lab --public --source=. --push
```
- リポジトリ Settings → Pages → Source を「GitHub Actions」に
- push すると `.github/workflows/deploy.yml` が走り自動公開される

### 4. 記事自動生成を有効化
- リポジトリ Settings → Secrets → Actions に `ANTHROPIC_API_KEY` を登録
- `.github/workflows/auto-article.yml` が毎週月曜に `scripts/topics.txt` から1本生成→自動公開
- 手動実行は Actions タブ → 「記事の自動生成（週次）」→ Run workflow

---

## 設定ファイルの場所（ここだけ触ればOK）

| やりたいこと | 触るファイル |
|---|---|
| サイト名・URL・説明 | `src/lib/config.mjs` の `site` |
| Amazon/楽天のアフィリID | `src/lib/config.mjs` の `affiliate` |
| AdSenseの広告設定 | `src/lib/config.mjs` の `ads` |
| カテゴリ追加 | `src/lib/config.mjs` の `categories` |
| 見た目・デザイン | `public/styles.css` |
| 記事ネタの追加 | `scripts/topics.txt` |

---

## 運用のコツ（放置に近づけるために）
- **ネタ切れ防止**: 月1回 `scripts/topics.txt` にトレンドキーワードを10行足すだけ
- **収益化の肝**: 生成記事の `REPLACE_ASIN_xxx` を実ASINに変える作業だけは自動化しない（誤リンク防止）
- **期待値**: SEOで検索流入が育つまで最短2〜3ヶ月。最初は0でも積み上げが効いてくる領域
