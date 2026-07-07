// =============================================================
//  サイト全体の設定（ここだけ書き換えれば全ページに反映される）
// =============================================================

export const site = {
  name: "おうちクラウド Lab",
  tagline: "自宅サーバー・homelab 機材を、実測とスペックで比較する",
  // サイトのオリジン（末尾スラッシュなし）。
  //  - GitHub Pages(プロジェクト): "https://YOUR_NAME.github.io"
  //  - 独自ドメイン/Cloudflare:     "https://ouchi-cloud.dev"
  url: "https://flanchan-lgtm.github.io",
  // 公開パスの接頭辞（内部リンクに付く）。
  //  - github.io のサブディレクトリ公開: "/ouchi-cloud-lab"
  //  - 独自ドメインでルート公開:          ""  ← 空にする
  base: "/ouchi-cloud-lab",
  lang: "ja",
  author: "おうちクラウド Lab 編集部",
  // OGP / Twitter 用（任意）
  twitter: "@ouchi_cloud",
  // フッターに出す運営情報
  description:
    "Minisforum・Beelink などのミニPC、Synology/QNAP のNAS、10GbE機材まで。省電力・実測ベースで自宅サーバー機材を比較するメディアです。",
};

// =============================================================
//  アフィリエイト設定
//  ※ 各記事の frontmatter 側でも個別リンクを指定できるが、
//    トラッキングIDはここで一元管理する。
// =============================================================
export const affiliate = {
  // Amazonアソシエイト・トラッキングID
  amazonTag: "ouchicloudlab-22",

  // もしもアフィリエイト等を使う場合の識別子（任意）
  moshimoId: "",

  // 楽天アフィリエイトID（任意）
  rakutenId: "",

  // アフィリンクに付ける共通の rel 属性（Google 推奨）
  rel: "sponsored nofollow noopener",
};

// =============================================================
//  広告設定（Google AdSense）
//  審査通過後に client / slot を入れると広告が表示される。
//  空のうちは「広告枠プレースホルダ」が表示される。
// =============================================================
export const ads = {
  adsenseClient: "", // 例: "ca-pub-1234567890123456"
  slots: {
    inArticle: "", // 記事中に差し込むスロットID
    sidebar: "", // サイドバー用スロットID
  },
};

// =============================================================
//  カテゴリ定義（ナビと一覧ページに使う）
// =============================================================
export const categories = {
  "mini-pc": { label: "ミニPC", emoji: "🖥️" },
  nas: { label: "NAS・ストレージ", emoji: "💾" },
  network: { label: "ネットワーク", emoji: "🌐" },
  guide: { label: "入門ガイド", emoji: "📘" },
};
