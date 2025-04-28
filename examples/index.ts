import { createBoardApiSdk } from './index.js';

// API設定情報（実際の利用時は環境変数などから取得してください）
const apiKey = 'YOUR_API_KEY';
const apiToken = 'YOUR_API_TOKEN';

// SDKの初期化
const sdk = createBoardApiSdk({
  apiKey,
  apiToken,
});

// サンプル1: 顧客一覧の取得
async function getClientsList() {
  try {
    const clients = await sdk.clients.getClients({
      page: 1,
      per_page: 20,
      response_group: 'medium',
    });
    
    console.log(`顧客一覧: 合計${clients.total}件`);
    clients.items.forEach(client => {
      console.log(`- ${client.id}: ${client.name}`);
    });
  } catch (error) {
    console.error('顧客一覧の取得に失敗しました:', error);
  }
}

// サンプル2: 顧客IDから顧客詳細を取得し、その顧客の支社一覧を取得
async function getClientWithBranches(clientId: number) {
  try {
    // 顧客詳細の取得
    const client = await sdk.clients.getClient(clientId, 'medium');
    console.log(`顧客詳細: ${client.id} - ${client.name}`);
    
    // 顧客の支社一覧を取得
    const branches = await sdk.clientBranches.getClientBranchesByClientId(clientId, {
      response_group: 'medium',
    });
    
    console.log(`支社一覧: 合計${branches.total}件`);
    branches.items.forEach(branch => {
      console.log(`- ${branch.id}: ${branch.name}`);
    });
  } catch (error) {
    console.error('顧客詳細または支社一覧の取得に失敗しました:', error);
  }
}

// サンプル3: 特定の顧客に紐づく案件一覧を取得
async function getProjectsByClient(clientId: number) {
  try {
    const projects = await sdk.projects.getProjectsByClientId(clientId, {
      response_group: 'medium',
    });
    
    console.log(`案件一覧: 合計${projects.total}件`);
    projects.items.forEach(project => {
      console.log(`- ${project.id}: ${project.name} (ステータス: ${project.status})`);
    });
  } catch (error) {
    console.error('案件一覧の取得に失敗しました:', error);
  }
}

// サンプル4: 新規顧客を作成
async function createNewClient() {
  try {
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
    
    console.log('新規顧客を作成しました:', newClient);
    return newClient.id;
  } catch (error) {
    console.error('顧客作成に失敗しました:', error);
    return null;
  }
}

// サンプル5: 顧客支社の作成
async function createClientBranch(clientId: number) {
  try {
    const newBranch = await sdk.clientBranches.createClientBranchForClient(clientId, {
      name: '渋谷支社',
      code: 'SHIBUYA',
      zip: '150-0001',
      address: '東京都渋谷区神宮前1-1-1',
      tel: '03-1234-5678'
    });
    
    console.log('新規顧客支社を作成しました:', newBranch);
    return newBranch.id;
  } catch (error) {
    console.error('顧客支社作成に失敗しました:', error);
    return null;
  }
}

// サンプル6: 案件の作成と更新
async function createAndUpdateProject(clientId: number, clientBranchId: number) {
  try {
    // 案件の作成
    const newProject = await sdk.projects.createProjectForClientBranch(
      clientId,
      clientBranchId,
      {
        name: 'サンプルプロジェクト',
        code: 'SAMPLE-001',
        status: 'active',
        start_date: '2023-04-01',
        end_date: '2023-12-31',
        description: 'これはサンプルプロジェクトです'
      }
    );
    
    console.log('新規案件を作成しました:', newProject);
    
    // 案件情報の更新
    const updatedProject = await sdk.projects.updateProject(newProject.id, {
      name: 'サンプルプロジェクト（更新版）',
      end_date: '2024-03-31'
    });
    
    console.log('案件情報を更新しました:', updatedProject);
    
    // ステータスの更新
    const statusUpdatedProject = await sdk.projects.updateProjectStatus(newProject.id, 'completed');
    
    console.log('案件ステータスを更新しました:', statusUpdatedProject);
    
    return newProject.id;
  } catch (error) {
    console.error('案件作成または更新に失敗しました:', error);
    return null;
  }
}

// サンプル7: 顧客のアーカイブと削除
async function archiveAndDeleteClient(clientId: number) {
  try {
    // 顧客のアーカイブ
    const archivedClient = await sdk.clients.archiveClient(clientId);
    console.log('顧客をアーカイブしました:', archivedClient);
    
    // アーカイブの解除（実際には削除前に行わないことが多いですが、例として）
    const unarchivedClient = await sdk.clients.unarchiveClient(clientId);
    console.log('顧客のアーカイブを解除しました:', unarchivedClient);
    
    // 顧客の削除（慎重に行う必要があります）
    // 注: 実際のアプリケーションでは確認プロセスを挟むべきです
    await sdk.clients.deleteClient(clientId);
    console.log('顧客を削除しました');
    
    return true;
  } catch (error) {
    console.error('顧客のアーカイブまたは削除に失敗しました:', error);
    return false;
  }
}

// 一連の操作を実行する例（実際の運用では個別に実行することが多いでしょう）
async function runFullExample() {
  // 1. 新規顧客の作成
  const clientId = await createNewClient();
  if (!clientId) return;
  
  // 2. 顧客支社の作成
  const branchId = await createClientBranch(clientId);
  if (!branchId) return;
  
  // 3. 案件の作成と更新
  const projectId = await createAndUpdateProject(clientId, branchId);
  if (!projectId) return;
  
  // 4. 顧客情報の取得
  await getClientWithBranches(clientId);
  
  // 5. 案件一覧の取得
  await getProjectsByClient(clientId);
  
  // 6. 顧客のアーカイブと削除（実際のアプリケーションでは慎重に行う必要があります）
  // await archiveAndDeleteClient(clientId);
}

// 実行例（コメントアウトしています）
// getClientsList();
// getClientWithBranches(123); // 実際のクライアントIDを指定
// getProjectsByClient(123); // 実際のクライアントIDを指定
// runFullExample(); 