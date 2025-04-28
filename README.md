# Board API SDK

JavaScript/TypeScript用のBoard API SDKです。Board APIを使用して顧客、顧客支社、案件を管理するためのクライアントライブラリを提供します。

## インストール

```bash
npm install @digitalcube/board-sdk
```

または

```bash
yarn add @digitalcube/board-sdk
```

## 基本的な使い方

```typescript
import { BoardApiSdk } from '@digitalcube/board-sdk';

// SDKの初期化
const boardApi = new BoardApiSdk({
  apiKey: 'YOUR_API_KEY',
  apiToken: 'YOUR_API_TOKEN',
  baseUrl: 'https://api.example.com' // オプション
});

// 顧客一覧の取得
async function getClients() {
  try {
    const clients = await boardApi.clients.getClients({
      page: 1,
      per_page: 20,
      response_group: 'medium'
    });
    console.log(`顧客数: ${clients.total}`);
    console.log(clients.items);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 案件一覧の取得
async function getProjects() {
  try {
    const projects = await boardApi.projects.getProjects({
      page: 1,
      per_page: 20,
      response_group: 'medium'
    });
    console.log(`案件数: ${projects.total}`);
    console.log(projects.items);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}
```

## 機能

### 顧客管理 API

```typescript
// 顧客一覧の取得
const clients = await boardApi.clients.getClients({
  page: 1,
  per_page: 20,
  response_group: 'medium',
  include_archive_flg: false
});

// 顧客詳細の取得
const client = await boardApi.clients.getClient(clientId, 'medium');

// 顧客の作成
const newClient = await boardApi.clients.createClient({
  name: '株式会社サンプル',
  name_kana: 'カブシキガイシャサンプル',
  short_name: 'サンプル',
  zip: '123-4567',
  address: '東京都渋谷区サンプル1-2-3',
  tel: '03-1234-5678',
  url: 'https://example.com',
  memo: 'サンプル顧客'
});

// 顧客情報の更新
const updatedClient = await boardApi.clients.updateClient(clientId, {
  name: '株式会社サンプル（更新）',
  tel: '03-9876-5432'
});

// 顧客のアーカイブ
const archivedClient = await boardApi.clients.archiveClient(clientId);

// 顧客のアーカイブ解除
const unarchivedClient = await boardApi.clients.unarchiveClient(clientId);

// 顧客の削除
await boardApi.clients.deleteClient(clientId);
```

### 顧客支社管理 API

```typescript
// 顧客支社一覧の取得
const branches = await boardApi.clientBranches.getClientBranches({
  page: 1,
  per_page: 20,
  response_group: 'medium',
  include_archive_flg: false
});

// 特定の顧客に紐づく支社一覧の取得
const clientBranches = await boardApi.clientBranches.getClientBranchesByClientId(clientId, {
  response_group: 'medium'
});

// 顧客支社詳細の取得
const branch = await boardApi.clientBranches.getClientBranch(branchId, 'medium');

// 顧客支社の作成
const newBranch = await boardApi.clientBranches.createClientBranchForClient(clientId, {
  name: '渋谷支社',
  code: 'SHIBUYA',
  zip: '150-0001',
  address: '東京都渋谷区神宮前1-1-1',
  tel: '03-1234-5678'
});

// 顧客支社情報の更新
const updatedBranch = await boardApi.clientBranches.updateClientBranch(branchId, {
  name: '渋谷支社（更新）',
  tel: '03-9876-5432'
});

// 顧客支社のアーカイブ
const archivedBranch = await boardApi.clientBranches.archiveClientBranch(branchId);

// 顧客支社のアーカイブ解除
const unarchivedBranch = await boardApi.clientBranches.unarchiveClientBranch(branchId);

// 顧客支社の削除
await boardApi.clientBranches.deleteClientBranch(branchId);
```

### 案件管理 API

```typescript
// 案件一覧の取得
const projects = await boardApi.projects.getProjects({
  page: 1,
  per_page: 20,
  response_group: 'medium',
  status: 'active' // ステータスによるフィルタリング
});

// 特定の顧客に紐づく案件一覧の取得
const clientProjects = await boardApi.projects.getProjectsByClientId(clientId, {
  response_group: 'medium'
});

// 特定の顧客支社に紐づく案件一覧の取得
const branchProjects = await boardApi.projects.getProjectsByClientBranchId(branchId, {
  response_group: 'medium'
});

// 案件詳細の取得
const project = await boardApi.projects.getProject(projectId, 'medium');

// 案件の作成
const newProject = await boardApi.projects.createProjectForClientBranch(
  clientId,
  branchId,
  {
    name: 'サンプルプロジェクト',
    code: 'SAMPLE-001',
    status: 'active',
    start_date: '2023-04-01',
    end_date: '2023-12-31',
    description: 'これはサンプルプロジェクトです'
  }
);

// 案件情報の更新
const updatedProject = await boardApi.projects.updateProject(projectId, {
  name: 'サンプルプロジェクト（更新版）',
  end_date: '2024-03-31'
});

// 案件ステータスの更新
const statusUpdatedProject = await boardApi.projects.updateProjectStatus(projectId, 'completed');

// 案件の削除
await boardApi.projects.deleteProject(projectId);
```

## レスポンスグループ

APIは「レスポンスグループ」をサポートしており、取得するフィールドの量を調整できます：

- `small`: 基本的なフィールドのみ
- `medium`: 基本フィールド + 追加の詳細情報
- `large`: すべての利用可能なフィールド

## ページネーション

リスト取得APIは自動的にページネーションをサポートしています：

```typescript
const response = await boardApi.clients.getClients({
  page: 1,      // 取得するページ番号
  per_page: 20  // 1ページあたりの結果数
});

console.log(`合計: ${response.total}`);
console.log(`現在のページ: ${response.current_page}`);
console.log(`最終ページ: ${response.last_page}`);
```

## ライセンス

MIT 