# 日本円ハッカソン事前テスト　出題用Webページ

## テストページ
https://terrier-lover.github.io/jpyc_hack_prep_test_page/

## サンプルデモ
https://user-images.githubusercontent.com/68787800/157796999-35e28bcc-9c6d-450b-ac1a-876051f696cd.mp4

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

## 注記
- モバイル版のサポートはなし。
- 不具合等に関して [issues](https://github.com/terrier-lover/JPYCHackathonPrepTest/issues) にてご連絡ください。

## システム詳細
### スマートコントラクト
| 役割           | コントラクト名  |コード行数      |サイズ(KB)      |
| ------------- | ------------- | -------------|-------------|
| クイズ問題、ユーザーの回答ステータスの保持等  | JPYCQuiz.sol  | 354          | 11.124 |
| NFT  | JPYCQuizRewardNFT.sol  | 135 | 13.291 |
| NFT の SVG データを保有  | JPYCQuizRewardNFTSource.sol  | 150 | 14.435 |


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
  - [Chakra UI](https://chakra-ui.com/docs/getting-started) (\*1)

(\*1) @3rdweb/react が Chakra UI を内部で利用してるため、Chakra UIのデザインに従いました

## 各種操作情報
### ソースコードインストール
```
$ git clone https://github.com/terrier-lover/JPYCHackathonPrepTest.git
```

### hardhat/.env
hardhat/.env.example を参照し、以下パラメータを指定してください。
- RINKEBY_URL
  - **必須項目** Rinkeby URL
- RINKEBY_PRIVATE_KEY_OWNER
  - **必須項目** コントラクトをデプロイするアカウント(EOA)を指定します
- RINKEBY_PRIVATE_KEY_OTHER1
  - **オプショナル** ユーザーとしてクイズを解くアカウント(EOA)を指定します

### hardhat/scripts/deploy.ts
ソースコード内にクイズ情報等を設定する場所があります。適宜情報をアップデートしてください。

- ``MINIMUM_NUMBER_OF_PASS``: 合格に必要な最低数を指定してください。。この最低数以上の正答でNFTが発行できます。
- ``COMMON_SELECTION_LABELS``: 問題の選択肢として利用されるラベルを指定します。○×問題の場合、``["○", "×"]``と指定してください。
- ``QUESTION_SELECTIONS_INFO``: クイズの問題と回答を配列内に指定してください。
個々の問題のデータ形式は以下です。
```
{
  // question, selectionLabels, selectionIDs, solutionHash はブロックチェーンに保存されます
  question: "○ を選択してください。", // 設問を指定
  selectionLabels: ["○", "×"], // 回答の選択肢を配列にて指定
  selectionIDs: ["1298371", "8473629"], // selectionLabelsと同じ数の配列にてユニークなIDを指定
  solutionHash: e1394801b1c262ed26721fd73b0a8cabac4c99b7d71166c5fc872d2d9fb2598f, // どの選択肢が回答かを指定。コード内では選択肢に該当するユニークIDをsha256関数にてハッシュ化しています。
  // solutionIndex は deploy.ts のみに利用されます
  solutionIndex: 0, // どの選択肢が回答かを指定します。
}
```
deploy.ts ファイルでは ``makeQuestionSelection`` 関数を用いてラベル(○×問題の場合は``["○", "×"]``)と
```
{
  question: "○ を選択してください。",
  ...makeQuestionSelection(
    COMMON_SELECTION_LABELS, // deploy.ts 内では ``["○", "×"]`` が該当
    0, // solutionIndex, ○と×のどちらが正答かを指定。0 の場合は ○（マル）が正解、1 の場合は ×（バツ）が正解です。
  )
}
```

### hardhat/hardhat.config.ts
**オプショナル**　Hardhatの設定ファイル。

### frontend/src/CustomInputs.ts
Rinkeby以外のネットワークを利用する場合、以下項目を変更してください。
- SUPPORTED_CHAIN_IDS_IN_WEB
  - **オプショナル** どのネットワークのチェインIDをサポートするか指定します
- NETWORK_NAMES, CHAIN_IDS, CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS
  - **オプショナル** 新たにネットワークを指定する際に変更が必要です

### Hardhatとフロントのソースコードインストール
#### フロントエンド
```
$ cd frontend
$ npm install
```

#### Hardhat
```
$ cd hardhat
$ npm install
```

### スマートコントラクトのデプロイ
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

### Hardhat　テスト方法
```
$ cd hardhat
$ npx hardhat test
```

## License - MIT License

Copyright 2022 TerrierLover

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
