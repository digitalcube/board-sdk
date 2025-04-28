# Board SDK Monorepo

このリポジトリは、Board API のSDK、サンプルアプリケーション、および関連ツールを含むモノレポです。

## パッケージ構成

このモノレポは以下のパッケージで構成されています：

- [`packages/sdk`](./packages/sdk): Board API SDK本体
- [`packages/examples`](./packages/examples): Honoを使用したSDKの使用例
- [`packages/mcp`](./packages/mcp): SDKを利用したModel Context Protocolサーバー

## 開発環境のセットアップ

### 必要条件

- Node.js 18.0.0以上
- npm 7.0.0以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/digitalcube/board-sdk.git
cd board-sdk

# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
# 全パッケージの開発サーバー起動
npm run dev

# 特定のパッケージのみ開発サーバー起動
npm run dev --workspace=@digitalcube/board-sdk
npm run dev --workspace=@board-sdk/examples
npm run dev --workspace=@board-sdk/mcp
```

### ビルド

```bash
# 全パッケージのビルド
npm run build

# 特定のパッケージのみビルド
npm run build --workspace=@digitalcube/board-sdk
npm run build --workspace=@board-sdk/examples
npm run build --workspace=@board-sdk/mcp
```

## 環境変数

各パッケージで使用する環境変数は、それぞれのパッケージディレクトリに `.env` ファイルを作成して設定します。

### SDK

```
BOARD_API_KEY=your_api_key
BOARD_API_BASE_URL=https://api.example.com
```

### Examples & MCP

```
BOARD_API_KEY=your_api_key
BOARD_API_BASE_URL=https://api.example.com
PORT=3000 # Examples用のポート番号（デフォルト：3000）
PORT=4000 # MCP用のポート番号（デフォルト：4000）
```

## ライセンス

MIT 