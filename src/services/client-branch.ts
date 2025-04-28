import { BoardApiClient } from '../client.js';
import type { ClientBranch, ClientBranchParams, ListResponse, ClientBranchCreateParams, ClientBranchUpdateParams } from '../types.js';

export class ClientBranchService {
  private client: BoardApiClient;

  constructor(client: BoardApiClient) {
    this.client = client;
  }

  /**
   * 顧客支社一覧を取得します
   * @param params 検索パラメータ
   * @returns 顧客支社一覧
   */
  async getClientBranches(params?: ClientBranchParams): Promise<ListResponse<ClientBranch>> {
    return this.client.request<ListResponse<ClientBranch>>('/client_branches', 'GET', undefined, params as Record<string, string | number | boolean> | undefined);
  }

  /**
   * 顧客支社詳細を取得します
   * @param id 顧客支社ID
   * @param responseGroup レスポンスグループ
   * @returns 顧客支社詳細
   */
  async getClientBranch(id: number, responseGroup?: 'small' | 'medium' | 'large'): Promise<ClientBranch> {
    const params = responseGroup ? { response_group: responseGroup } : undefined;
    return this.client.request<ClientBranch>(`/client_branches/${id}`, 'GET', undefined, params);
  }

  /**
   * 顧客IDに紐づく顧客支社一覧を取得します
   * @param clientId 顧客ID
   * @param params 検索パラメータ
   * @returns 顧客支社一覧
   */
  async getClientBranchesByClientId(clientId: number, params?: ClientBranchParams): Promise<ListResponse<ClientBranch>> {
    return this.client.request<ListResponse<ClientBranch>>(
      `/clients/${clientId}/client_branches`, 
      'GET', 
      undefined, 
      params as Record<string, string | number | boolean> | undefined
    );
  }

  /**
   * 顧客支社を新規作成します
   * @param data 顧客支社作成データ
   * @returns 作成された顧客支社
   */
  async createClientBranch(data: ClientBranchCreateParams): Promise<ClientBranch> {
    return this.client.request<ClientBranch>('/client_branches', 'POST', data);
  }

  /**
   * 特定の顧客に紐づく顧客支社を新規作成します
   * @param clientId 顧客ID
   * @param data 顧客支社作成データ（client_idは不要）
   * @returns 作成された顧客支社
   */
  async createClientBranchForClient(clientId: number, data: Omit<ClientBranchCreateParams, 'client_id'>): Promise<ClientBranch> {
    const branchData: ClientBranchCreateParams = {
      ...data,
      client_id: clientId
    };
    return this.createClientBranch(branchData);
  }

  /**
   * 顧客支社情報を更新します
   * @param id 顧客支社ID
   * @param data 顧客支社更新データ
   * @returns 更新された顧客支社
   */
  async updateClientBranch(id: number, data: ClientBranchUpdateParams): Promise<ClientBranch> {
    return this.client.request<ClientBranch>(`/client_branches/${id}`, 'PATCH', data);
  }

  /**
   * 顧客支社を削除します
   * @param id 顧客支社ID
   * @returns 削除結果
   */
  async deleteClientBranch(id: number): Promise<void> {
    return this.client.request<void>(`/client_branches/${id}`, 'DELETE');
  }

  /**
   * 顧客支社をアーカイブします
   * @param id 顧客支社ID
   * @returns アーカイブされた顧客支社
   */
  async archiveClientBranch(id: number): Promise<ClientBranch> {
    return this.updateClientBranch(id, { archive_flg: true });
  }

  /**
   * 顧客支社のアーカイブを解除します
   * @param id 顧客支社ID
   * @returns アーカイブ解除された顧客支社
   */
  async unarchiveClientBranch(id: number): Promise<ClientBranch> {
    return this.updateClientBranch(id, { archive_flg: false });
  }
} 