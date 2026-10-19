---
title: "TrueNAS・Unraid・Proxmox比較2026｜自宅サーバーOSの選び方完全ガイド"
slug: truenas-unraid-proxmox-comparison-2026
description: "TrueNAS・Unraid・Proxmox VEの違いを費用・用途・必要スペックで比較。NAS用途かVM/コンテナ用途かで選び方が変わる理由を具体的な数字で解説する。"
date: 2026-10-19
updated: 2026-10-19
category: guide
type: comparison
tags: [TrueNAS, Unraid, Proxmox, 自宅サーバー, NAS]
products:
  - name: TrueNAS（CORE/SCALE）
    price: "¥0（無料・OSS）"
    rating: 4.3
    spec: "ZFSベースのNAS専用OS。SCALE版はLinux/Dockerにも対応"
    pros:
      - ZFSによるデータ保護（スナップショット・チェックサム）が標準
      - 完全無料で商用利用も可能なOSS
      - NAS用途に特化したシンプルなWeb UI
    cons:
      - ZFSプール構成後のディスク構成変更が難しい
      - VM/コンテナ運用はUnraidやProxmoxほど柔軟でない
  - name: Unraid
    price: "¥7,500〜19,500 前後（買い切りライセンス）"
    rating: 4.4
    spec: "異なる容量のHDDを混在できる独自アレイ方式。Docker/VMにも対応"
    pros:
      - 容量の異なるHDDを後から1本ずつ追加できる
      - Docker Community Appsが豊富でメディアサーバー構築が容易
      - GUIが直感的で初心者でも迷いにくい
    cons:
      - ライセンス費用が発生する（容量上限で価格が変わる）
      - パリティ方式のため書き込み速度がZFSのミラー/RAIDZに劣る場面がある
  - name: Proxmox VE
    price: "¥0（無料・OSS、法人向け有償サポートは別途）"
    rating: 4.6
    spec: "KVM仮想化とLXCコンテナを扱うハイパーバイザー型OS。ZFS管理も内蔵"
    pros:
      - VM・LXCを多数同時運用でき自宅ラボ用途に強い
      - ZFSやCeph等ストレージ機能も内蔵しNAS的運用も可能
      - 無料でもクラスタ構成やバックアップ機能が使える
    cons:
      - NAS専用機に比べ、ファイル共有だけを目的とすると設定が煩雑
      - GPU/HBAのパススルー設定（IOMMU）でつまずきやすい
    affiliate:
      amazon: "REPLACE_ASIN_XXX"
      rakuten: ""
chart:
  title: "ライセンス費用の違い（目安）"
  rows:
    - label: "TrueNAS（CORE/SCALE）"
      value: 0
      display: "¥0（無料・OSS）"
      highlight: true
    - label: "Proxmox VE"
      value: 0
      display: "¥0（無料・OSS）"
      highlight: true
    - label: "Unraid Basic"
      value: 7500
      display: "¥7,500 前後"
    - label: "Unraid Plus"
      value: 13500
      display: "¥13,500 前後"
    - label: "Unraid Pro"
      value: 19500
      display: "¥19,500 前後"
  caption: "TrueNASとProxmox VEは無料で始められる一方、Unraidは容量上限に応じて買い切りライセンスが必要になる。ただしUnraidは異容量HDD混在など運用面の自由度で費用差を補える場面がある。"
  note: "※Unraidの価格は執筆時点の公式サイト表示額（米ドル）を1ドル=150円で概算換算した目安。為替・価格改定により変動する。TrueNAS・Proxmox VEはOSSのため無償（法人向け有償サポート/サブスクリプションは別途）。"
---

## この記事で分かること

自宅サーバーOSとして名前が挙がる「TrueNAS」「Unraid」「Proxmox VE」は、どれも無料または低コストで本格的なホームサーバーを組める点が共通している。しかし思想がまったく違うため、「NASとして使いたいのか」「VMやコンテナを動かしたいのか」で選ぶべきものが変わる。本記事では費用・必要スペック・用途適性を具体的な数字と設定例で比較し、2026年時点での選び方を整理する。

## 3製品の思想の違い

- **TrueNAS**：ZFSによるデータ保護を前提にしたNAS専用OS。ファイルサーバーとしての安定性を最優先する設計。
- **Unraid**：容量の異なるHDDを1本ずつ混在・追加できる独自アレイ方式が特徴。NASとDocker/VMホストの中間的な立ち位置。
- **Proxmox VE**：KVMとLXCを扱うハイパーバイザーが本体。NAS機能はあくまで“ついでにできる”位置づけで、複数VM・コンテナの同時運用が主戦場。

つまり「ファイルを守りたいだけ」ならTrueNAS、「ゆるくNASもDockerもやりたい」ならUnraid、「仮想環境をガッツリ作りたい」ならProxmoxという住み分けになる。

<!-- COMPARE -->

<!-- AD -->

## 用途別のおすすめ早見表

スペックや費用だけでなく「何をしたいか」で選ぶと失敗しにくい。

| やりたいこと | おすすめ | 理由 |
|---|---|---|
| 写真・動画のバックアップ先を安定運用したい | TrueNAS | ZFSのスナップショット・チェックサムでデータ破損を検知しやすい |
| 手持ちの容量バラバラなHDDを使い切りたい | Unraid | パリティ方式で異容量HDDを1本から追加・拡張できる |
| Jellyfin/Immichなど自宅サービスをDockerで量産したい | Unraid or TrueNAS SCALE | どちらもCommunity Apps的な仕組みでワンクリック導入しやすい |
| Windows VM・Linux VMを複数同時に動かしたい | Proxmox VE | KVMベースでVM・LXCを多数同時運用でき、クラスタ構成にも対応 |
| 自宅の検証環境（ラボ）を本格的に作りたい | Proxmox VE | スナップショット・バックアップ・ネットワーク仮想化が一通り揃う |

<!-- FIGURE -->

グラフの通り、TrueNASとProxmox VEは導入コストがゼロなのに対し、Unraidは容量上限に応じたライセンス費用が発生する。ただしUnraidの費用は「買い切り」であり、月額課金ではない点は押さえておきたい。

## 費用を3年で均してみる

Unraidのライセンス費用を「本当に高いのか」判断するために、3年間（36ヶ月）で月額換算してみる。

```
月額換算 = ライセンス価格 ÷ 36ヶ月
```

| プラン | 価格（目安） | 月額換算 | 対応ディスク上限（目安） |
|---|---|---|---|
| Unraid Basic | ¥7,500 前後 | 約¥208/月 | 最大6台程度 |
| Unraid Plus | ¥13,500 前後 | 約¥375/月 | 最大12台程度 |
| Unraid Pro | ¥19,500 前後 | 約¥542/月 | 無制限（プール数に制限あり） |
| TrueNAS | ¥0 | ¥0 | ハードウェア依存 |
| Proxmox VE | ¥0 | ¥0 | ハードウェア依存 |

ディスク台数が少ない小規模運用ならUnraid Basicで十分なことが多く、月500円以下の負担で異容量HDD混在運用ができると考えればコストメリットは小さくない。逆に無料のTrueNASやProxmox VEでも、ハードウェア（HBA、メモリ増設など）にお金がかかる点は見落とされがちなので注意したい。

## 必要スペックの目安

| 項目 | TrueNAS | Unraid | Proxmox VE |
|---|---|---|---|
| 推奨メモリの目安 | 8GB〜（ZFSはキャッシュとしてメモリを多く使う） | 4GB〜（軽量運用も可能） | 8GB〜（VMを複数動かすなら16GB以上が現実的） |
| ECCメモリ | 必須ではないが推奨されることが多い | 必須ではない | 必須ではない |
| ブートメディア | SSD推奨 | USBメモリでも動作（公式に採用） | SSD推奨 |
| CPU要件 | 一般的なx86_64であれば動作 | 一般的なx86_64であれば動作 | 仮想化支援機能（VT-x/AMD-V）が実質必須 |

ZFSは「メモリを大量に使う」と言われがちだが、これは積極的にキャッシュへ利用するためであり、動作に大容量メモリが絶対条件というわけではない。ただし快適に使うなら8GB以上は確保したい、という程度に理解しておくとよい。

<!-- PRODUCTS -->

## コンテナ運用の違いを設定例で見る

3製品ともDockerコンテナを扱えるが、設定の“作法”が異なる。TrueNAS SCALEとUnraidはGUIから`docker-compose`相当のYAMLを読み込む運用が一般的で、例えばJellyfinを立てる場合は次のような構成になる。

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin
    container_name: jellyfin
    volumes:
      - /mnt/pool1/config/jellyfin:/config
      - /mnt/pool1/media:/media
    ports:
      - "8096:8096"
    restart: unless-stopped
```

一方Proxmox VEではDockerを直接ホストに入れるのではなく、LXCコンテナやVMの中でDockerを動かす構成が推奨される。ホストOS自体を汚さずに済むメリットがある代わりに、1手順増える点は覚えておきたい。

```bash
# Proxmox VE上でLXCコンテナを作成する例（テンプレートは事前にダウンロード済みとする）
pct create 200 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --hostname docker-host --cores 2 --memory 2048 \
  --rootfs local-lvm:8 --net0 name=eth0,bridge=vmbr0,ip=dhcp
pct start 200
```

ZFSプールの状態確認はTrueNASでもProxmox VEでも共通のコマンドが使える。

```bash
zpool status
zfs list
```

## つまずきポイント

- **ZFSプール作成後にディスク構成を変更しにくい**：TrueNAS・Proxmox VEともにRAIDZレベルの変更は原則非対応。後から台数を増やしたくなる前提なら、最初からミラー構成を複数作る運用にしておくと柔軟性が高い。
- **UnraidのUSBブートメディアが単一障害点になる**：UnraidはライセンスがUSBメモリのシリアルに紐づくため、USBメモリの故障がそのままシステム停止につながる。バックアップ用USBの用意とライセンスのバックアップが必須。
- **ProxmoxのGPU/HBAパススルーでIOMMUの有効化を忘れる**：BIOS設定とGRUB/カーネルパラメータ両方でIOMMUを有効にしないとパススルーが機能しない。エラーで止まった場合はまずこの設定漏れを疑う。
- **Dockerのパーミッション（PUID/PGID）設定ミス**：TrueNAS SCALEやUnraidでDockerコンテナからNASの共有フォルダにアクセスできない場合、多くはユーザーID/グループIDの不一致が原因。コンテナ側の環境変数でホストのUID/GIDに合わせる。

## 買わない・選ばない方がよいケース

- 市販のNASキット（Synology/QNAPなど）で十分満足している人は、わざわざ自作してTrueNAS/Unraid/Proxmoxへ乗り換える必要はない。保守性やサポート面では完成品に分がある。
- VMやコンテナをほとんど使わず「ファイル共有だけ」できればよい人には、Proxmox VEはオーバースペックで設定の手間が見合わない可能性が高い。
- 停電や故障時の自力復旧に自信がない人は、ZFSやパリティアレイの仕組みを理解しないまま構築すると、トラブル時にデータ復旧で詰まりやすい。まずは重要でないデータで検証してから本運用に移るのが無難。

<!-- AD -->

## FAQ

**Q. TrueNASとUnraid、初心者にはどちらが向いている？**
A. 異容量のHDDを寄せ集めて使いたいならUnraidの方が導入しやすい。すでに同容量のディスクを複数用意できるならTrueNASのZFSの方が長期的なデータ保護の面で安心感がある。

**Q. Proxmoxの上でTrueNASやUnraidを仮想化して動かせる？**
A. 技術的には可能で、ディスクをパススルーしてTrueNASやUnraidをVMとして動かす構成は実例も多い。ただしHBAのパススルー設定（IOMMU）でつまずきやすく、初心者がいきなり挑む構成としては難易度が高め。

**Q. ZFSでないとデータは守れない？**
A. ZFSはチェックサムによるビット化けの検知など優れた機能を持つが、UnraidのパリティアレイもHDD故障時の復旧という意味では実用的な保護を提供する。「絶対にZFSでなければならない」わけではなく、バックアップ（3-2-1ルールなど）を別途用意することの方が重要。

**Q. HDDが1本壊れた場合の復旧のしやすさは？**
A. Unraidはパリティアレイの仕組み上、1台のHDD故障からの復旧が直感的に分かりやすいと評判が高い。TrueNAS/Proxmox VEのZFSミラーやRAIDZも故障ディスクの交換・リシルバーで復旧できるが、コマンドやGUI操作の理解がやや必要になる。

**Q. Unraidのライセンス費用は本当に必要？代替手段は？**
A. Unraidは試用期間（トライアル）があるものの、継続利用には購入が必要になる。費用をかけたくない場合は、同様の用途をTrueNAS SCALE（ZFS＋Docker）やOpenMediaVaultのような無料OSSで代替する選択肢もある。ただし異容量HDD混在のしやすさという独自の強みは失われる点に注意。

## まとめ

TrueNAS・Unraid・Proxmox VEはいずれも無料〜低コストで本格的な自宅サーバーを組めるが、得意分野がはっきり分かれている。ファイル保護を最優先するならTrueNAS、手持ちのHDDを柔軟に使い回しつつDockerも楽しみたいならUnraid、VMやコンテナを本格的に運用したいならProxmox VEが選択肢になる。用途が曖昧なまま高性能なハードウェアだけ揃えても使いこなせないことが多いため、まずは「自分が一番やりたいこと」を1つに絞ってOSを選ぶのが遠回りしないコツだ。

自宅サーバー用のハードウェア選びについては、ミニPCの選び方やNASのRAID構成の基礎を扱った記事もあわせて参考にしてほしい。

---

※本記事の価格・ライセンス条件は執筆時点の公開情報をもとにした目安であり、為替レートや製品改定により変動する。スペック要件は各プロジェクトが公開する一般的な目安を基にしたものであり、当サイトでの実測値ではない。購入・導入前に必ず公式サイトで最新情報を確認してほしい。
