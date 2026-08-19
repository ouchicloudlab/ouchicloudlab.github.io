// =============================================================
//  記事の自動生成パイプライン（Claude API）
//
//  使い方:
//    ANTHROPIC_API_KEY=sk-... node scripts/generate-article.mjs "省電力ミニPC比較 アイドル10W以下"
//
//  トピック（キーワード）を渡すと、frontmatter付きのMarkdown記事を
//  src/content/articles/ に生成する。GitHub Actions の cron から
//  定期実行すれば「ネタ→記事」までを自動化できる。
//
//  ※ 生成後は人間の最終チェックを推奨（価格・型番・リンクの確認）。
//     商品の affiliate.amazon は "REPLACE_ASIN_xxx" のままなので、
//     公開前に実際のASINへ差し替えること。
// =============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "../src/lib/config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.resolve(__dirname, "..", "src", "content", "articles");

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ARTICLE_MODEL || "claude-sonnet-5";

const topic = process.argv.slice(2).join(" ").trim();
if (!topic) {
  console.error('トピックを指定してください。例: node scripts/generate-article.mjs "自宅NAS おすすめ比較"');
  process.exit(1);
}
if (!API_KEY) {
  console.error("環境変数 ANTHROPIC_API_KEY が未設定です。");
  process.exit(1);
}

const catList = Object.entries(categories)
  .map(([slug, c]) => `${slug}（${c.label}）`)
  .join(" / ");

const SYSTEM = `あなたは日本語の技術系アフィリエイトメディア「おうちクラウド Lab」の編集者です。
自宅サーバー・homelab機材（ミニPC・NAS・ネットワーク機器）の比較/レビュー/入門記事を書きます。

# 出力フォーマット（厳守）
出力は「1本のMarkdownファイルの中身」のみ。前置き・説明・コードフェンスは付けない。
必ず先頭にYAML frontmatterを置く。スキーマ:

---
title: （32〜48文字程度、検索されやすい具体的なタイトル。年号や「おすすめ」「比較」を活用）
slug: （半角英数字とハイフンのみ。内容を表す短いもの）
description: （120文字前後。検索意図に答える説明。メタディスクリプションになる）
date: ${new Date().toISOString().slice(0, 10)}
updated: ${new Date().toISOString().slice(0, 10)}
category: （次から1つ選ぶ: ${catList}）
type: （comparison / guide / review のいずれか）
tags: [3〜5個]
# comparison型のときだけ products を付ける（3〜6製品）:
products:
  - name: 製品名
    price: "¥00,000 前後"
    rating: 4.5   # 0〜5
    spec: "主要スペックを1行で"
    pros: [3個]
    cons: [2個]
    affiliate:
      amazon: "REPLACE_ASIN_XXX"   # 実在ASINは推測で書かず必ずこのプレースホルダにする
      rakuten: ""
---

# 本文ルール
- 本文はMarkdown。h2(##)・h3(###)で構成する。
- comparison型では、本文の適切な位置に次の特殊コメントを入れる:
  - <!-- COMPARE --> … 比較表に自動展開される（一覧の直後に置く）
  - <!-- PRODUCTS --> … 商品カード一覧に展開される（各機種の詳細解説の位置に置く）
  - <!-- AD --> … 記事内広告枠（導入後と結論前など2箇所程度）
- guide/review型では products は不要。<!-- AD --> は使ってよい。
- 事実は一般に正しい範囲で書き、価格や型番を断定しすぎない（「前後」「目安」を使う）。
- 誇大表現・虚偽のスペックは書かない。読者に本当に役立つ実用情報を優先する。

# 品質基準（最重要・AdSense/検索品質ガイドライン対応）
薄い紹介文の羅列は禁止。「どこにでもある一般論」ではなく、読者がその場で判断・作業
できる粒度まで具体化すること。以下を必ず満たす。

- **文字数の目安: 4000〜6000字**（見出しだけ多くて中身が薄い構成は不可）
- **数字は計算過程を書く**。例: 電気代は「W × 24h × 365日 ÷ 1000 × 31円」の式と、
  複数条件を並べた表を出す。単価などの前提条件は明記する。
- **表を2つ以上使う**（比較・早見表・条件別の目安など、Markdownの表で）
- **具体的な設定例やコマンドを載せる**（該当テーマなら docker compose、シェルコマンド等）
- **「つまずきポイント」を必ず書く**。実際に詰まる箇所と、その回避方法。
- **買わない/やらない選択肢にも触れる**。不要なケース、向いていない人を正直に書く。
- **FAQを4問以上**置く。検索されそうな素朴な疑問に答える。
- 記事末尾に **関連記事への内部リンク**を1〜3本入れる（/articles/<slug>/ 形式。
  既存記事の slug が不明な場合はリンクを作らず、文章だけにする）。
- 記事末尾に **注記行**を置く: 数値の出どころ（メーカー公開仕様なのか試算なのか）と、
  価格・仕様が変動する旨を明記する。

# 禁止事項
- **当サイトが測定していない数値を「実測」と書かない**。公開仕様・一般的な目安である
  ことが分かる表現にする（「メーカー公開値」「〜の目安」など）。
- 存在しない製品名・型番・スペックを創作しない。確信が持てない具体値は書かない。
- 「最高」「絶対」などの断定的な誇大表現を使わない。
- rating は「編集部が付けた相対的な目安」であり測定値ではない前提で付ける。`;

const USER = `次のトピックで記事を1本書いてください。トピック: 「${topic}」`;

async function main() {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: "user", content: USER }],
    }),
  });

  if (!res.ok) {
    console.error("API エラー:", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  let md = (data.content || []).map((b) => b.text || "").join("").trim();

  // 念のためコードフェンスが付いていたら剥がす
  md = md.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```\s*$/i, "").trim();

  // slug をfrontmatterから抜く
  const slugMatch = md.match(/^slug:\s*(.+)$/m);
  const slug = (slugMatch ? slugMatch[1] : `draft-${Date.now()}`)
    .trim()
    .replace(/["']/g, "");

  const outPath = path.join(articlesDir, `${slug}.md`);
  fs.writeFileSync(outPath, md + "\n", "utf8");
  console.log(`✅ 記事を生成しました: src/content/articles/${slug}.md`);
  console.log("   公開前に価格・型番・アフィリンク(ASIN)を確認してください。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
