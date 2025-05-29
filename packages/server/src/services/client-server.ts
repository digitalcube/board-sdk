import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import type { Client, ClientParams, ClientCreateParams, ClientUpdateParams, ListResponse } from '@digitalcube/board-sdk';
import { ClientParamsSchema, ClientCreateParamsSchema, ClientUpdateParamsSchema, ApiResponse } from '../types.js';

/**
 * 顧客関連のサーバーAPI実装
 */
export class ClientServerService {
  private sdk: BoardApiSdk;

  /**
   * ClientServerServiceを初期化します
   * @param sdk BoardApiSdkインスタンス
   */
  constructor(sdk: BoardApiSdk) {
    this.sdk = sdk;
  }

  /**
   * 顧客一覧を取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 顧客一覧レスポンス
   */
  async getClients(params?: unknown): Promise<ApiResponse<ListResponse<Client>>> {
    try {
      const validatedParams = params 
        ? ClientParamsSchema.parse(params) 
        : undefined;
      
      const clients = await this.sdk.clients.getClients(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clients, null, 2)
          }
        ],
        data: clients
      };
    } catch (error) {
      console.error('Error getting clients:', error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客詳細を取得するエンドポイント
   * @param id 顧客ID
   * @param responseGroup レスポンスグループ
   * @returns 顧客詳細レスポンス
   */
  async getClient(id: unknown, responseGroup?: unknown): Promise<ApiResponse<Client>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedResponseGroup = responseGroup 
        ? z.enum(['small', 'medium', 'large']).parse(responseGroup) 
        : undefined;
      
      const client = await this.sdk.clients.getClient(validatedId, validatedResponseGroup);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ],
        data: client
      };
    } catch (error) {
      console.error(`Error getting client ${id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客を新規作成するエンドポイント
   * @param data 顧客作成データ
   * @returns 作成された顧客レスポンス
   */
  async createClient(data: unknown): Promise<ApiResponse<Client>> {
    try {
      const validatedData = ClientCreateParamsSchema.parse(data);
      
      const client = await this.sdk.clients.createClient(validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ],
        data: client
      };
    } catch (error) {
      console.error('Error creating client:', error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客情報を更新するエンドポイント
   * @param id 顧客ID
   * @param data 顧客更新データ
   * @returns 更新された顧客レスポンス
   */
  async updateClient(id: unknown, data: unknown): Promise<ApiResponse<Client>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedData = ClientUpdateParamsSchema.parse(data);
      
      const client = await this.sdk.clients.updateClient(validatedId, validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ],
        data: client
      };
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客を削除するエンドポイント
   * @param id 顧客ID
   * @returns 削除結果レスポンス
   */
  async deleteClient(id: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      await this.sdk.clients.deleteClient(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Client with ID ${validatedId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客をアーカイブするエンドポイント
   * @param id 顧客ID
   * @returns アーカイブされた顧客レスポンス
   */
  async archiveClient(id: unknown): Promise<ApiResponse<Client>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      const client = await this.sdk.clients.archiveClient(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ],
        data: client
      };
    } catch (error) {
      console.error(`Error archiving client ${id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * 顧客のアーカイブを解除するエンドポイント
   * @param id 顧客ID
   * @returns アーカイブ解除された顧客レスポンス
   */
  async unarchiveClient(id: unknown): Promise<ApiResponse<Client>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      const client = await this.sdk.clients.unarchiveClient(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ],
        data: client
      };
    } catch (error) {
      console.error(`Error unarchiving client ${id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: error instanceof Error ? error.message : String(error) 
            }, null, 2)
          }
        ]
      };
    }
  }
}
