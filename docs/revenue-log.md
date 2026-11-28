# 収益ログ

revenue-strategist が次の作業を選ぶときの根拠にするファイル。推測ではなく、実際の数字だけを書く。

## 売上記録（Amazonアソシエイト）

| 期間 | クリック | 注文 | 発送 | 売上 | 紹介料 | メモ |
|---|---|---|---|---|---|---|
| 2026年10月 | 41 | 1（直接） | 1 | ¥52,636 | ¥1,053 | 初の成果。10/11 にクリック12回が集中し、同じ日に注文。料率2%＝PC・周辺機器カテゴリ。この価格帯の掲載商品は東芝 N300 8TB（¥52,200前後）、Beelink Mini S12 Pro（¥55,000前後）、GMKtec G10（¥48,600前後）など。2026-11-28 に確認した東芝 N300 8TB（B0DJCP4KM1）のAmazon価格が ¥52,750 で、売上額とほぼ一致するため、**売れたのはN300 8TBの可能性が高い**（＝ nas-hdd-comparison-wd-red-ironwolf 経由と推定。レポートの「注文商品」画面で要確認） |

**ここから言えること**: 2%の料率でも、数万円の機材なら1件で約1,000円になる。数千円の小物を何件も売るより、**ミニPC・HDD・NASなど数万円クラスの機材の比較記事と、そこへ読者を送る導線**が収益の軸。

## 施策ログ

| 日付 | 作業 | 対象 | 狙い |
|---|---|---|---|
| 2026-11-27 | AdSense審査対策（全記事の表現修正、自動公開を停止して人のレビューを必須化） | 全記事 | 審査通過 |
| 2026-11-28 | マルチエージェントの収益化サイクル（`/grow-revenue`）を導入 | .claude/ | 更新の継続と、収益化の優先順位付け |
| 2026-11-28 | 入門記事3本に、検証済みASINの商品ブロックと比較記事への内部リンクを追加 | immich-selfhosted-google-photos-alternative-guide / jitaku-server-nyumon / proxmox-nyumon-minipc | 機材の話を読んだ読者が買える場所を作る |
| 2026-11-28 | WD Red Plus 4TB の型番表記をASINの実物（WD40EFZZ-AJP・キャッシュ128MB）に合わせて修正 | nas-hdd-comparison-wd-red-ironwolf | 誤表記の解消 |
| 2026-11-28 | ASIN付きの全商品（30件）をブラウザで確認し、比較記事7本の価格を更新。記事ごとに priceCheckedOn を設定 | mini-pc-osusume-2026 ほか6本 | 古い価格による信頼低下を防ぐ |
| 2026-11-28 | 在庫切れの GMKtec G10 のリンクを、同じ機種の在庫ありASIN（B0HJ8N3HZC、販売元 GMKtec-JP）に差し替え | mini-pc-osusume-2026 | 最安機のリンク切れ（売れない状態）を解消 |
| 2026-11-28 | 「Amazonで検索」のままだった商品のうち5件を商品ページへの直リンクに変更（PoEスイッチ3件・ワットチェッカー2件。RS-WFWATTCH1は後継のWATTCH2に差し替え） | poe-switch-home-network-guide / watt-checker-home-server-power-measurement | 検索結果経由より成約率の高い直リンクにする |
| 2026-11-28 | 新規記事「NASバックアップの3-2-1ルール実践ガイド」を公開（外付けHDD・ポータブルHDD・2台目NAS・NAS用HDDの6商品） | nas-backup-3-2-1-rule-guide | NAS購入者の「2台目のHDD」需要を取る。HDD比較・NAS比較記事への内部リンク |

## 次回への申し送り
- `search` のまま残しているもの: Ubiquiti USW-Lite-8-PoE（Amazonは第三者出品で3万円台のみ）、Buffalo BS-GS2016P（新品の通常出品なし）、中古法人PC 6機種（出品ごとに状態が違うため検索が妥当）。
- APC BR1000S-JP（B01N7P3E52）は、カートに入る新品の出品がない（2026-11-28）。次回も同じなら、同等の正弦波UPSへの差し替えを検討する。
- 価格の確認は、月1回を目安に行う。比較表の注記に日付が出るため、確認日から60日を超えないようにする。
- `src/lib/config.mjs` の `site.priceCheckedOn` はビルドで使われていない（記事ごとの frontmatter の priceCheckedOn だけが使われる）。
