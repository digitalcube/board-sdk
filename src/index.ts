import { BoardApiClient } from './client.js';
import type { BoardApiConfig } from './client.js';
import { ClientService } from './services/client.js';
import { ClientBranchService } from './services/client-branch.js';
import { ProjectService } from './services/project.js';

export type * from './types.js';
export { BoardApiClient } from './client.js';
export type { BoardApiConfig } from './client.js';

/**
 * Board API SDK
 */
export class BoardApiSdk {
  private client: BoardApiClient;
  
  /**
   * 顧客関連API
   */
  public readonly clients: ClientService;
  
  /**
   * 顧客支社関連API
   */
  public readonly clientBranches: ClientBranchService;
  
  /**
   * 案件関連API
   */
  public readonly projects: ProjectService;

  /**
   * Board API SDKを初期化します
   * @param config API設定
   */
  constructor(config: BoardApiConfig) {
    this.client = new BoardApiClient(config);
    
    // 各サービスの初期化
    this.clients = new ClientService(this.client);
    this.clientBranches = new ClientBranchService(this.client);
    this.projects = new ProjectService(this.client);
  }
}

/**
 * Board API SDKを作成します
 * @param config API設定
 * @returns BoardApiSdk インスタンス
 */
export function createBoardApiSdk(config: BoardApiConfig): BoardApiSdk {
  return new BoardApiSdk(config);
} 