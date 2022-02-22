# 日本円ハッカソン事前テスト　出題用Webページ

## システム概要
- 構成
  - Web ページ (React, Typescript)
  - スマートコントラクト (Solidity, Rinkeby network)
- 利用ライブラリ
  - Web ページ
    - [ethers](https://www.npmjs.com/package/ethers)
    - [@3rdweb/react](https://www.npmjs.com/package/@3rdweb/react)
  - スマートコントラクト
    - [@openzeppelin/contracts] (https://www.npmjs.com/package/@openzeppelin/contracts)
    - [base64-sol] (https://www.npmjs.com/package/base64-sol/v/1.0.1)
- 管理者向け機能
  - 質問内容・正解をスマートコントラクトにて追加・変更可能
  - 質問数は自由に設定可能
  - 最低合格正答数を指定可能 
- ユーザー向けページの機能
  - Metamask ウォレットでの接続
  - 質問の閲覧、回答の選択・送信
  - 一定数以上の正答数でNFTをミント可能
- 10個の質問に対して◯か×を選択(開発時は関係のない質問のみでOK)
- ウォレットを接続し回答ボタンを押すと、injectedウォレットにてトランザクションの承認画面がポップアップする
- スマートコントラクトの要件
    - 7割以上が正解であることをチェックする
    - チェックがOKであれば、参加証NFTを発行する
    - チェックとNFT発行は1度のトランザクションで行う


## システム詳細
質問内容・回答変更時の動作詳細


# テストページ(未完成)
https://terrier-lover.github.io/jpyc_hack_prep_test_page/
