// =============================================================
//  静的サイトビルド
//  src/content/articles/*.md  ->  dist/**/index.html
//  Markdown記事を追加するだけでサイトが増える設計。
// =============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { site, categories } from "../src/lib/config.mjs";
import {
  layout,
  productCard,
  comparisonTable,
  adSlot,
  absUrl,
} from "../src/lib/templates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const articlesDir = path.join(root, "src", "content", "articles");
const distDir = path.join(root, "dist");
const publicDir = path.join(root, "public");

// ---- ユーティリティ --------------------------------------------------
function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}
function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
// 内部の絶対リンク（href="/..." src="/...")にベースパスを付与する。
// 外部リンク(http/https)や #アンカーは対象外。
function applyBase(html) {
  const base = site.base || "";
  if (!base) return html;
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`);
}
function writePage(relPath, html) {
  const out = path.join(distDir, relPath, "index.html");
  ensure(path.dirname(out));
  fs.writeFileSync(out, applyBase(html), "utf8");
}
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensure(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---- 記事の読み込み --------------------------------------------------
function loadArticles() {
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(articlesDir, file), "utf8");
    const { data, content } = matter(raw);
    const slug = data.slug || file.replace(/\.md$/, "");
    return { ...data, slug, markdown: content };
  });
  // 新しい順
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  return articles;
}

// ---- 記事本文レンダリング -------------------------------------------
// Markdown中に置いた特殊コメントを部品に置換する:
//   <!-- PRODUCTS -->    -> 商品カード一覧
//   <!-- COMPARE -->     -> 比較表
//   <!-- AD -->          -> 記事内広告
function renderArticleBody(article) {
  let md = article.markdown;

  const cardsHtml = (article.products || [])
    .map((p, i) => productCard(p, i + 1))
    .join("\n");
  const tableHtml = comparisonTable(article.products);

  md = md
    .replace(/<!--\s*PRODUCTS\s*-->/g, `\n<div class="products">${cardsHtml}</div>\n`)
    .replace(/<!--\s*COMPARE\s*-->/g, `\n${tableHtml}\n`)
    .replace(/<!--\s*AD\s*-->/g, `\n${adSlot("inArticle")}\n`);

  return marked.parse(md);
}

// ---- 各ページ生成 ----------------------------------------------------
function buildArticlePage(article) {
  const cat = categories[article.category];
  const bodyHtml = renderArticleBody(article);
  const canonical = absUrl(`/articles/${article.slug}/`);
  const body = `
<article class="article">
  <nav class="breadcrumb"><a href="/">ホーム</a> › ${
    cat ? `<a href="/category/${article.category}/">${cat.label}</a> › ` : ""
  }<span>${article.title}</span></nav>
  <header class="article-head">
    <div class="badges">
      ${cat ? `<span class="badge">${cat.emoji} ${cat.label}</span>` : ""}
      <span class="date">更新: ${fmtDate(article.date)}</span>
    </div>
    <h1>${article.title}</h1>
    <p class="lead">${article.description || ""}</p>
  </header>
  ${adSlot("inArticle")}
  <div class="article-body">
    ${bodyHtml}
  </div>
  <div class="article-foot">
    ${adSlot("inArticle")}
  </div>
</article>`;
  writePage(`articles/${article.slug}`, layout({
    title: `${article.title} | ${site.name}`,
    description: article.description,
    canonical,
    body,
    article,
  }));
}

function articleCard(a) {
  const cat = categories[a.category];
  return `
<a class="card" href="/articles/${a.slug}/">
  <div class="card-body">
    ${cat ? `<span class="badge small">${cat.emoji} ${cat.label}</span>` : ""}
    <h3>${a.title}</h3>
    <p>${a.description || ""}</p>
    <span class="card-date">${fmtDate(a.date)}</span>
  </div>
</a>`;
}

function buildHome(articles) {
  const cards = articles.map(articleCard).join("\n");
  const body = `
<section class="hero">
  <h1>${site.tagline}</h1>
  <p>${site.description}</p>
</section>
<section class="latest">
  <h2>新着・注目の比較記事</h2>
  <div class="card-grid">${cards}</div>
</section>`;
  writePage("", layout({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    canonical: absUrl("/"),
    body,
  }));
}

function buildCategoryPages(articles) {
  for (const [slug, cat] of Object.entries(categories)) {
    const list = articles.filter((a) => a.category === slug);
    const cards = list.length
      ? list.map(articleCard).join("\n")
      : `<p class="empty">この カテゴリの記事は準備中です。</p>`;
    const body = `
<section class="cat-head">
  <h1>${cat.emoji} ${cat.label} の記事</h1>
</section>
<div class="card-grid">${cards}</div>`;
    writePage(`category/${slug}`, layout({
      title: `${cat.label}の比較記事 | ${site.name}`,
      description: `${cat.label}に関する自宅サーバー機材の比較・レビュー記事一覧。`,
      canonical: absUrl(`/category/${slug}/`),
      body,
    }));
  }
}

function buildSitemap(articles) {
  const urls = [
    absUrl("/"),
    ...Object.keys(categories).map((s) => absUrl(`/category/${s}/`)),
    ...articles.map((a) => absUrl(`/articles/${a.slug}/`)),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
}

function buildRss(articles) {
  const items = articles
    .slice(0, 20)
    .map(
      (a) => `  <item>
    <title>${a.title}</title>
    <link>${absUrl(`/articles/${a.slug}/`)}</link>
    <guid>${absUrl(`/articles/${a.slug}/`)}</guid>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    <description><![CDATA[${a.description || ""}]]></description>
  </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${site.name}</title>
  <link>${absUrl("/")}</link>
  <description>${site.description}</description>
${items}
</channel>
</rss>`;
  fs.writeFileSync(path.join(distDir, "rss.xml"), xml, "utf8");
}

function buildRobots() {
  const txt = `User-agent: *\nAllow: /\nSitemap: ${absUrl("/sitemap.xml")}\n`;
  fs.writeFileSync(path.join(distDir, "robots.txt"), txt, "utf8");
}

// ---- 実行 ------------------------------------------------------------
function main() {
  rmrf(distDir);
  ensure(distDir);

  // public/（styles.css・画像など）をそのままコピー
  copyDir(publicDir, distDir);

  const articles = loadArticles();
  buildHome(articles);
  buildCategoryPages(articles);
  articles.forEach(buildArticlePage);
  buildSitemap(articles);
  buildRss(articles);
  buildRobots();

  console.log(
    `✅ ビルド完了: 記事 ${articles.length} 本 / 出力先 dist/`
  );
  articles.forEach((a) => console.log(`   - /articles/${a.slug}/  (${a.title})`));
}

main();
