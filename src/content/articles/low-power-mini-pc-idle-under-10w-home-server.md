---
title: アイドル10W以下の省電力ミニPC5選｜おうちサーバーの電気代を徹底比較
slug: low-power-mini-pc-idle-under-10w-home-server
description: 24時間稼働のおうちサーバーに最適な、アイドル時消費電力10W以下を実現する省電力ミニPCを5機種厳選。電気代シミュレーションと選び方も解説。
date: 2026-07-13
category: mini-pc
type: comparison
tags: [省電力ミニPC, おうちサーバー, Intel N100, 電気代, 自宅サーバー]
products:
  - name: GMKtec NucBox G3 Plus（Intel N100）
    price: "¥25,000 前後"
    rating: 4.4
    spec: "Intel N100（4コア） / 8GB RAM / 256GB SSD / 2.5GbE×1"
    pros: ["アイドル時6〜8W程度と非常に省電力", "本体サイズが手のひらサイズでラック不要", "価格が安くコスパが高い"]
    cons: ["性能はエントリー向けで重い仮想化には不向き", "拡張性が低くストレージ増設に制限あり"]
    affiliate:
      amazon: "REPLACE_ASIN_G3PLUS"
      rakuten: ""
  - name: ODROID-H4 Ultra
    price: "¥30,000 前後（本体のみ）"
    rating: 4.3
    spec: "Intel N305（8コア） / RAM別売 / M.2 NVMe×2 / SATA×2 / 2.5GbE×2"
    pros: ["SATA×2でNAS的な使い方がしやすい", "N305搭載でCPU性能に余裕がある", "デュアル2.5GbEでネットワーク用途にも強い"]
    cons: ["アイドル電力はSATA接続台数で変動し10W前後になることも", "RAM・SSD・ケースが別売で初期費用がかさむ"]
    affiliate:
      amazon: "REPLACE_ASIN_ODROIDH4"
      rakuten: ""
  - name: Beelink EQ14（Intel N150）
    price: "¥28,000 前後"
    rating: 4.5
    spec: "Intel N150 / 16GB RAM / 500GB SSD / 2.5GbE×2"
    pros: ["最新N150搭載で省電力と性能のバランスが良い", "デュアル2.5GbEでルーター用途にも使える", "メモリ16GB標準でコンテナ運用も余裕"]
    cons: ["ファンが常時回転しやや音が気になる個体もある", "M.2スロットが1本のみで増設に限りあり"]
    affiliate:
      amazon: "REPLACE_ASIN_EQ14"
      rakuten: ""
  - name: Raspberry Pi 5（8GBモデル・NVMe HAT構成）
    price: "¥18,000 前後（本体+HAT+SSD別）"
    rating: 3.9
    spec: "Broadcom BCM2712（4コア） / 8GB RAM / NVMe SSD対応（HAT経由）"
    pros: ["アイドル電力は2〜4W台と圧倒的に低い", "コミュニティが大きく情報が豊富", "小型で置き場所を選ばない"]
    cons: ["x86非対応のためDocker移植性に制約が出る場合がある", "NVMe利用には別売HATが必要で総額が上がりがち"]
    affiliate:
      amazon: "REPLACE_ASIN_PI5"
      rakuten: ""
  - name: MINISFORUM UM790 Pro（Ryzen 7 7840HS）
    price: "¥65,000 前後"
    rating: 4.0
    spec: "AMD Ryzen 7 7840HS（8コア） / 32GB RAM / 1TB SSD / 2.5GbE×1"
    pros: ["高性能でVM・トランスコードも余裕", "USB4/Thunderboltなど拡張性が高い"]
    cons: ["アイドル電力は10〜15W程度とやや高め", "価格帯が上がり省電力サーバー用途としてはオーバースペック気味"]
    affiliate:
      amazon: "REPLACE_ASIN_UM790PRO"
      rakuten: ""
---

## はじめに：おうちサーバーこそ「アイドル電力」が重要

Plexサーバー、Home Assistant、Pi-hole、自宅NASなど、24時間365日稼働させる「おうちサーバー」において最も効いてくるコストは、実は本体価格よりも電気代です。ピーク性能ではなく、待機状態（アイドル時）の消費電力がどれだけ低いかが、年間の電気代を大きく左右します。

例えばアイドル時10Wの機器を1年間つけっぱなしにすると、年間消費電力量はおよそ87.6kWh。電気料金を1kWhあたり31円で計算すると、年間約2,700円程度になります。これが20Wになれば単純計算で倍の約5,400円。ミニPC本体の価格差以上に、5年・10年単位で見ると電気代の差が効いてくるわけです。

本記事では、アイドル時10W前後を目安に、実際におうちサーバー用途で人気のミニPCを5機種ピックアップして比較します。

<!-- AD -->

## 比較早見表

<!-- COMPARE -->

## 選び方のポイント

### 1. CPUアーキテクチャで消費電力が変わる
IntelのN100・N150シリーズはTDP6W前後の設計で、アイドル電力の低さに直結します。一方でAMD Ryzenの高性能モデルは処理性能が高い反面、アイドル時でも10W台になりやすい傾向があります。「常時稼働の軽負荷サーバー」が目的なら、まずはN100/N150系を軸に検討するのがおすすめです。

### 2. SSD・HDDの本数と種類
SATA HDDを複数台接続するNAS的な使い方をすると、ディスクの回転維持だけで消費電力が数W単位で上乗せされます。純粋にアイドル電力を抑えたいなら、NVMe SSD一本構成がベストです。ODROID-H4のようにSATAポートを備える機種は拡張性と引き換えに電力面ではやや不利になる点は覚えておきましょう。

### 3. ネットワークポートの数
2.5GbEを2ポート搭載しているモデルは、ルーターやNAS兼用として使う際に便利ですが、常時通信が発生するとその分わずかに電力が上乗せされます。用途がシンプルなサーバー1台であれば、1ポートモデルでも十分です。

<!-- PRODUCTS -->

## 実測値は個体差・環境差があることに注意

同じCPUを搭載していても、電源ユニットの変換効率、SSDのメーカー、OSの省電力設定（C-State、Wi-Fiの有無）によってアイドル電力は変動します。カタログスペックの「アイドル○W」はあくまで目安とし、購入後はワットチェッカーなどの実測器で自分の運用環境における数値を確認することを強くおすすめします。

<!-- AD -->

## まとめ

- 軽量なDocker運用・Pi-hole・Home Assistant程度なら、Intel N100/N150搭載のGMKtec NucBox G3 PlusやBeelink EQ14が電力・コスパのバランスに優れます。
- NAS的にSATAドライブを使いたいならODROID-H4 Ultraが候補になりますが、ディスク分だけ電力は上振れします。
- とにかく最小消費電力を狙うならRaspberry Pi 5構成が有力ですが、x86ソフトウェアとの互換性は要確認です。
- 重い処理も並行してこなしたいならMINISFORUM UM790 Proのような高性能機も選択肢ですが、アイドル電力は妥協する必要があります。

自分のサーバー用途（軽い自動化なのか、重い変換処理も含むのか）を明確にした上で、性能と消費電力のバランスが取れた1台を選んでみてください。
