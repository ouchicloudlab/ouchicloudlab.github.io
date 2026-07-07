import { site, affiliate, ads, categories } from "./config.mjs";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- アフィリンク生成 -------------------------------------------------
// frontmatter の product.affiliate.amazon などが「ASIN」または「URL」でも動くようにする。
function amazonUrl(ref) {
  if (!ref) return null;
  let url;
  if (/^https?:\/\//.test(ref)) {
    url = ref;
  } else {
    // ASIN とみなす
    url = `https://www.amazon.co.jp/dp/${encodeURIComponent(ref)}`;
  }
  if (affiliate.amazonTag) {
    const sep = url.includes("?") ? "&" : "?";
    url += `${sep}tag=${affiliate.amazonTag}`;
  }
  return url;
}

function rakutenUrl(ref) {
  if (!ref) return null;
  return ref; // 楽天は生成URLをそのまま貼る運用
}

// ---- 広告スロット ----------------------------------------------------
export function adSlot(kind = "inArticle") {
  const slotId = ads.slots[kind];
  if (ads.adsenseClient && slotId) {
    return `
<div class="ad-slot">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${esc(ads.adsenseClient)}"
       data-ad-slot="${esc(slotId)}"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;
  }
  // 未設定時はプレースホルダ（審査通過後に自動で本物に変わる）
  return `<div class="ad-slot ad-placeholder" aria-hidden="true">広告枠（AdSense審査通過後に表示）</div>`;
}

// ---- 商品カード ------------------------------------------------------
export function productCard(p, rank) {
  const amazon = amazonUrl(p.affiliate?.amazon);
  const rakuten = rakutenUrl(p.affiliate?.rakuten);
  const stars =
    p.rating != null
      ? `<span class="stars" title="${p.rating}">${"★".repeat(
          Math.round(p.rating)
        )}${"☆".repeat(5 - Math.round(p.rating))} <b>${p.rating}</b></span>`
      : "";
  const pros = (p.pros || [])
    .map((x) => `<li class="pro">${esc(x)}</li>`)
    .join("");
  const cons = (p.cons || [])
    .map((x) => `<li class="con">${esc(x)}</li>`)
    .join("");

  const buttons = [];
  if (amazon)
    buttons.push(
      `<a class="btn btn-amazon" href="${esc(
        amazon
      )}" rel="${affiliate.rel}" target="_blank">Amazonで見る</a>`
    );
  if (rakuten)
    buttons.push(
      `<a class="btn btn-rakuten" href="${esc(
        rakuten
      )}" rel="${affiliate.rel}" target="_blank">楽天で見る</a>`
    );
  const btnHtml =
    buttons.join("") ||
    `<span class="btn btn-disabled">リンク準備中</span>`;

  return `
<div class="product-card" id="p-${rank}">
  <div class="pc-rank">${rank}</div>
  <div class="pc-body">
    <h3 class="pc-name">${esc(p.name)}</h3>
    <div class="pc-meta">
      ${stars}
      ${p.price ? `<span class="price">${esc(p.price)}</span>` : ""}
    </div>
    ${
      p.spec
        ? `<p class="pc-spec">${esc(p.spec)}</p>`
        : ""
    }
    <div class="pc-proscons">
      <ul class="proscons-list">${pros}${cons}</ul>
    </div>
    <div class="pc-cta">${btnHtml}</div>
  </div>
</div>`;
}

// ---- 比較表 ----------------------------------------------------------
export function comparisonTable(products) {
  if (!products || products.length === 0) return "";
  const rows = products
    .map((p) => {
      const amazon = amazonUrl(p.affiliate?.amazon);
      const link = amazon
        ? `<a href="${esc(amazon)}" rel="${affiliate.rel}" target="_blank">見る</a>`
        : "—";
      return `<tr>
  <td class="ct-name">${esc(p.name)}</td>
  <td>${esc(p.price || "—")}</td>
  <td>${p.rating != null ? esc(p.rating) : "—"}</td>
  <td>${esc(p.spec || "—")}</td>
  <td>${link}</td>
</tr>`;
    })
    .join("");
  return `
<div class="table-wrap">
<table class="compare-table">
  <thead><tr><th>製品</th><th>価格目安</th><th>評価</th><th>主要スペック</th><th>購入</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</div>`;
}

// ---- ページ全体レイアウト -------------------------------------------
export function layout({ title, description, canonical, body, article }) {
  const adsenseHead = ads.adsenseClient
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(
        ads.adsenseClient
      )}" crossorigin="anonymous"></script>`
    : "";

  const nav = Object.entries(categories)
    .map(
      ([slug, c]) =>
        `<a href="/category/${slug}/">${c.emoji} ${esc(c.label)}</a>`
    )
    .join("");

  // 記事ページ用の構造化データ（SEO）
  const jsonLd = article
    ? `<script type="application/ld+json">${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        author: { "@type": "Organization", name: site.author },
        publisher: { "@type": "Organization", name: site.name },
      })}</script>`
    : "";

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || site.description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ""}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description || site.description)}">
<meta property="og:type" content="${article ? "article" : "website"}">
<meta property="og:site_name" content="${esc(site.name)}">
<link rel="stylesheet" href="/styles.css">
<link rel="alternate" type="application/rss+xml" title="${esc(site.name)}" href="/rss.xml">
${adsenseHead}
${jsonLd}
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">☁️ ${esc(site.name)}</a>
    <nav class="main-nav">${nav}</nav>
  </div>
</header>
<main class="container">
${body}
</main>
<footer class="site-footer">
  <div class="container">
    <p class="disclosure">※当サイトはアフィリエイトプログラム（Amazonアソシエイト等）を利用しています。商品リンク経由の購入で当サイトが収益を得る場合があります。価格・在庫は変動するため、最新情報は各販売ページでご確認ください。</p>
    <p>&copy; ${new Date().getFullYear()} ${esc(site.name)} — ${esc(site.tagline)}</p>
  </div>
</footer>
</body>
</html>`;
}
