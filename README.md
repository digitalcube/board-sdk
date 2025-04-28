# Board API SDK

このSDKはBoard APIを簡単に利用するためのTypeScriptライブラリです。GET、POST、PATCH、DELETE系APIをサポートしています。

## インストール

```
npm install board-api-sdk
```

## 使い方

### SDKの初期化

```typescript
import { createBoardApiSdk } from 'board-api-sdk';

const sdk = createBoardApiSdk({
  apiKey: 'YOUR_API_KEY',
  apiToken: 'YOUR_API_TOKEN',
  // baseUrl: 'https://api.the-board.jp/v1' // デフォルト値
});
```

### 顧客関連API

#### 顧客情報の取得

```typescript
// 顧客一覧の取得
const clients = await sdk.clients.getClients({
  page: 1,
  per_page: 20,
  include_archive_flg: true,
  response_group: 'medium'
});

// 顧客詳細の取得
const client = await sdk.clients.getClient(123, 'medium');
```

#### 顧客の作成・更新・削除

```typescript
// 顧客の新規作成
const newClient = await sdk.clients.createClient({
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
const updatedClient = await sdk.clients.updateClient(123, {
  name: '株式会社サンプル（更新）',
  tel: '03-9876-5432'
});

// 顧客のアーカイブ
const archivedClient = await sdk.clients.archiveClient(123);

// アーカイブの解除
const unarchivedClient = await sdk.clients.unarchiveClient(123);

// 顧客の削除
await sdk.clients.deleteClient(123);
```

### 顧客支社関連API

#### 顧客支社情報の取得

```typescript
// 顧客支社一覧の取得
const branches = await sdk.clientBranches.getClientBranches({
  page: 1,
  per_page: 20,
  include_archive_flg: false,
  response_group: 'medium'
});

// 顧客支社詳細の取得
const branch = await sdk.clientBranches.getClientBranch(456, 'medium');

// 特定の顧客に紐づく顧客支社一覧の取得
const clientBranches = await sdk.clientBranches.getClientBranchesByClientId(123, {
  response_group: 'medium'
});
```

#### 顧客支社の作成・更新・削除

```typescript
// 顧客支社の新規作成
const newBranch = await sdk.clientBranches.createClientBranch({
  client_id: 123,
  name: '渋谷支社',
  code: 'SHIBUYA',
  zip: '150-0001',
  address: '東京都渋谷区神宮前1-1-1',
  tel: '03-1234-5678'
});

// または、特定の顧客に紐づける形で作成
const newBranchForClient = await sdk.clientBranches.createClientBranchForClient(123, {
  name: '新宿支社',
  code: 'SHINJUKU',
  zip: '160-0001',
  address: '東京都新宿区新宿1-1-1',
  tel: '03-2345-6789'
});

// 顧客支社情報の更新
const updatedBranch = await sdk.clientBranches.updateClientBranch(456, {
  name: '渋谷支社（更新）',
  tel: '03-9876-5432'
});

// 顧客支社のアーカイブ
const archivedBranch = await sdk.clientBranches.archiveClientBranch(456);

// アーカイブの解除
const unarchivedBranch = await sdk.clientBranches.unarchiveClientBranch(456);

// 顧客支社の削除
await sdk.clientBranches.deleteClientBranch(456);
```

### 案件関連API

#### 案件情報の取得

```typescript
// 案件一覧の取得
const projects = await sdk.projects.getProjects({
  page: 1,
  per_page: 20,
  status: 'active',
  response_group: 'medium'
});

// 案件詳細の取得
const project = await sdk.projects.getProject(789, 'medium');

// 特定の顧客に紐づく案件一覧の取得
const clientProjects = await sdk.projects.getProjectsByClientId(123, {
  response_group: 'medium'
});

// 特定の顧客支社に紐づく案件一覧の取得
const branchProjects = await sdk.projects.getProjectsByClientBranchId(456, {
  response_group: 'medium'
});
```

#### 案件の作成・更新・削除

```typescript
// 案件の新規作成
const newProject = await sdk.projects.createProject({
  name: 'サンプルプロジェクト',
  code: 'SAMPLE-001',
  status: 'active',
  client_id: 123,
  client_branch_id: 456,
  start_date: '2023-04-01',
  end_date: '2023-12-31',
  description: 'これはサンプルプロジェクトです'
});

// 特定の顧客に紐づける形で作成
const newProjectForClient = await sdk.projects.createProjectForClient(123, {
  name: '顧客紐づけプロジェクト',
  code: 'CLIENT-001',
  status: 'active',
  start_date: '2023-04-01',
  end_date: '2023-12-31'
});

// 特定の顧客支社に紐づける形で作成
const newProjectForBranch = await sdk.projects.createProjectForClientBranch(123, 456, {
  name: '支社紐づけプロジェクト',
  code: 'BRANCH-001',
  status: 'active',
  start_date: '2023-04-01',
  end_date: '2023-12-31'
});

// 案件情報の更新
const updatedProject = await sdk.projects.updateProject(789, {
  name: 'サンプルプロジェクト（更新）',
  end_date: '2024-03-31'
});

// 案件ステータスの更新
const statusUpdatedProject = await sdk.projects.updateProjectStatus(789, 'completed');

// 案件の削除
await sdk.projects.deleteProject(789);
```

## レスポンスグループについて

Board APIでは、レスポンスグループという概念があり、取得する項目を絞り込むことができます。
SDKでもこの機能を利用できます。指定しない場合は `small` が使用されます。

- `small`: 最小限の項目
- `medium`: 標準的な項目
- `large`: すべての項目

## エラーハンドリング

```typescript
try {
  const clients = await sdk.clients.getClients();
  console.log(clients);
} catch (error) {
  console.error('API呼び出しエラー:', error.message);
}
``` 