// dist/ を配信するだけの最小ローカルサーバー（確認用）
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/lib/config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");
const port = process.env.PORT || 4321;
const base = site.base || "";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    // ルート("/")アクセスはベース付きトップへ誘導（剥がす前に判定）
    if (base && (urlPath === "/" || urlPath === "")) {
      res.writeHead(302, { Location: `${base}/` });
      return res.end();
    }
    // ベースパス（/ouchi-cloud-lab）を剥がして dist ルートへマッピング
    if (base && urlPath.startsWith(base)) urlPath = urlPath.slice(base.length) || "/";
    if (urlPath.endsWith("/")) urlPath += "index.html";
    let file = path.join(dist, urlPath);
    if (!file.startsWith(dist)) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    if (!fs.existsSync(file)) {
      // 拡張子なしで来たらディレクトリ index を試す
      const alt = path.join(dist, urlPath, "index.html");
      if (fs.existsSync(alt)) file = alt;
      else {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<h1>404</h1>");
      }
    }
    const ext = path.extname(file);
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => {
    console.log(`▶ http://localhost:${port}/ で確認できます (Ctrl+C で停止)`);
  });
