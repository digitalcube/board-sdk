# Board API SDK

JavaScript/TypeScript用のBoard API SDKです。

## インストール

```bash
npm install board-sdk
```

または

```bash
yarn add board-sdk
```

## 使い方

```typescript
import { createBoardApiSdk } from 'board-sdk';

// SDKの初期化
const boardApi = createBoardApiSdk({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.example.com' // オプション
});

// 顧客情報の取得
async function getClients() {
  try {
    const clients = await boardApi.clients.list();
    console.log(clients);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 案件情報の取得
async function getProjects() {
  try {
    const projects = await boardApi.projects.list();
    console.log(projects);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}
```

## 機能

- 顧客管理 API
- 顧客支社管理 API
- 案件管理 API

## ライセンス

MIT 