# 日本円ハッカソン事前テスト　出題用Webページ

## テストページ
https://terrier-lover.github.io/jpyc_hack_prep_test_page/

## システム概要
- 構成
  - Web ページ (React, Typescript)
  - スマートコントラクト (Solidity, Rinkeby network)
- 利用ライブラリ
  - Web ページ
    - [ethers](https://www.npmjs.com/package/ethers)
    - [@3rdweb/react](https://www.npmjs.com/package/@3rdweb/react)
  - スマートコントラクト
    - [@openzeppelin/contracts](https://www.npmjs.com/package/@openzeppelin/contracts)
    - [base64-sol](https://www.npmjs.com/package/base64-sol/v/1.0.1)
- 管理者向け機能
  - 質問内容・正解をスマートコントラクトにて追加・変更可能
  - 質問数は自由に設定可能
  - 最低合格正答数を指定可能 
- ユーザー向けページの機能
  - Metamask ウォレットでの接続
  - 質問の閲覧、回答の選択・送信、トランザクションの承認画面のポップアップ等
  - 一定数以上の正答数でNFTを発行可能 (1度のトランザクションで)


## システム詳細
### スマートコントラクト
| 役割           | コントラクト名  |コード行数      |サイズ(KB)      |
| ------------- | ------------- | -------------|-------------|
| クイズ問題、ユーザーの回答ステータスの保持等  | JPYCQuiz.sol  | 255          | 11.832 |
| On-chain NFT の保有等  | JPYCQuizRewardNFT.sol  | 237 |24.499 (\*1) |

(\*1) On-chain にてSVGのコードが含まれており、サイズが大きいです。コントラクトのサイズ上限は 24.576 KB なのでギリギリです（汗）
NFTのオーナー情報等が JPYCQuizRewardNFT.sol にて保存されるため、[こちらの情報](https://ethereum.org/en/developers/tutorials/downsizing-contracts-to-fight-the-contract-size-limit/)を参照しつつサイズ縮小に励みます。Static call等の利用を考えてます。


### Web ページ
#### 利用ライブラリ
- ステート管理
  - [React Context](https://reactjs.org/docs/context.html)
- データフェッチング
  - [React Query](https://react-query.tanstack.com/overview)
- ブロックチェーン関連
  - [ethers](https://www.npmjs.com/package/ethers)
  - [@3rdweb/react](https://www.npmjs.com/package/@3rdweb/react)
- デザイン
  - [Chakra UI](https://chakra-ui.com/docs/getting-started) (\*2)

(\*2) @3rdweb/react が Chakra UI を内部で利用してるため、Chakra UIのデザインに従いました

## インストール方法
```
$ git clone https://github.com/terrier-lover/rewards_distributer.git
```

## 準備

## hardhat/.env
hardhat/.env.example を参照し、以下パラメータを指定してください。
- RINKEBY_URL
  - **必須項目** Rinkeby URL
- RINKEBY_PRIVATE_KEY_OWNER
  - **必須項目** コントラクトをデプロイするアカウント(EOA)を指定します
- RINKEBY_PRIVATE_KEY_OTHER1
  - **オプショナル** ユーザーとしてクイズを解くアカウント(EOA)を指定します

## hardhat/hardhat.config.ts
**オプショナル**　Hardhatの設定ファイル。

## frontend/src/CustomInputs.ts
Rinkeby以外のネットワークを利用する場合、以下項目を変更してください。
- SUPPORTED_CHAIN_IDS_IN_WEB
  - **オプショナル** どのネットワークのチェインIDをサポートするか指定します
- NETWORK_NAMES, CHAIN_IDS, CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS
  - **オプショナル** 新たにネットワークを指定する際に変更が必要です

## Hardhatとフロントのソースコードインストール
### フロントエンド
```
$ cd frontend
$ npm install
```

### Hardhat
```
$ cd hardhat
$ npm install
```

## スマートコントラクトのデプロイ
```
$ cd hardhat 
```
**ここで .env ファイルを準備してください**

### Rinkebyでのデプロイ
```
$ npx hardhat run scripts/deploy.ts --network rinkeby
```

### ローカルでのデプロイ
```
$ npx hardhat node
$ npx hardhat run scripts/deploy.ts --network localhost
```

### Hardhat　コンパイルもしくはデプロイ後の必須アクション
スマートコントラクトに変更をした場合、hardhat/typechain以下にTypeScriptで用いられるタイプ情報が自動生成されます。
hardhat/typechain/ 以下のファイルを frontend/src/typechain/ にコピーしてください。

```
$ cd [本ソースコードをインストールしたルートディレクトリ]
$ cp -R hardhat/typechain/* frontend/src/typechain/
```

### Frontend　Webサーバーの準備
```
$ cd frontend
$ npm start
```

## Hardhat　テスト方法
```
$ cd hardhat
$ npx hardhat test
```
