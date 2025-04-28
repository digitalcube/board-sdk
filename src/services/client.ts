import { BoardApiClient } from '../client.js';
import type { Client, ClientParams, ListResponse, ClientCreateParams, ClientUpdateParams } from '../types.js';

export class ClientService {
  private client: BoardApiClient;

  constructor(client: BoardApiClient) {
    this.client = client;
  }

  /**
   * 顧客一覧を取得します
   * @param params 検索パラメータ
   * @returns 顧客一覧
   */
  async getClients(params?: ClientParams): Promise<ListResponse<Client>> {
    return this.client.request<ListResponse<Client>>('/clients', 'GET', undefined, params as Record<string, string | number | boolean> | undefined);
  }

  /**
   * 顧客詳細を取得します
   * @param id 顧客ID
   * @param responseGroup レスポンスグループ
   * @returns 顧客詳細
   */
  async getClient(id: number, responseGroup?: 'small' | 'medium' | 'large'): Promise<Client> {
    const params = responseGroup ? { response_group: responseGroup } : undefined;
    return this.client.request<Client>(`/clients/${id}`, 'GET', undefined, params);
  }

  /**
   * 顧客を新規作成します
   * @param data 顧客作成データ
   * @returns 作成された顧客
   */
  async createClient(data: ClientCreateParams): Promise<Client> {
    return this.client.request<Client>('/clients', 'POST', data);
  }

  /**
   * 顧客情報を更新します
   * @param id 顧客ID
   * @param data 顧客更新データ
   * @returns 更新された顧客
   */
  async updateClient(id: number, data: ClientUpdateParams): Promise<Client> {
    return this.client.request<Client>(`/clients/${id}`, 'PATCH', data);
  }

  /**
   * 顧客を削除します
   * @param id 顧客ID
   * @returns 削除結果
   */
  async deleteClient(id: number): Promise<void> {
    return this.client.request<void>(`/clients/${id}`, 'DELETE');
  }

  /**
   * 顧客をアーカイブします
   * @param id 顧客ID
   * @returns アーカイブされた顧客
   */
  async archiveClient(id: number): Promise<Client> {
    return this.updateClient(id, { archive_flg: true });
  }

  /**
   * 顧客のアーカイブを解除します
   * @param id 顧客ID
   * @returns アーカイブ解除された顧客
   */
  async unarchiveClient(id: number): Promise<Client> {
    return this.updateClient(id, { archive_flg: false });
  }
} 