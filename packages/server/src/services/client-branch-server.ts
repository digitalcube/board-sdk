import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import type { ClientBranch, ClientBranchParams, ClientBranchCreateParams, ClientBranchUpdateParams, ListResponse } from '@digitalcube/board-sdk';
import { ClientBranchParamsSchema, ClientBranchCreateParamsSchema, ClientBranchUpdateParamsSchema, ApiResponse } from '../types.js';

/**
 * 顧客支社関連のサーバーAPI実装
 */
export class ClientBranchServerService {
  private sdk: BoardApiSdk;

  /**
   * ClientBranchServerServiceを初期化します
   * @param sdk BoardApiSdkインスタンス
   */
  constructor(sdk: BoardApiSdk) {
    this.sdk = sdk;
  }

  /**
   * 顧客支社一覧を取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 顧客支社一覧レスポンス
   */
  async getClientBranches(params?: unknown): Promise<ApiResponse<ListResponse<ClientBranch>>> {
    try {
      const validatedParams = params 
        ? ClientBranchParamsSchema.parse(params) 
        : undefined;
      
      const clientBranches = await this.sdk.clientBranches.getClientBranches(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranches, null, 2)
          }
        ],
        data: clientBranches
      };
    } catch (error) {
      console.error('Error getting client branches:', error);
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
   * 顧客支社詳細を取得するエンドポイント
   * @param id 顧客支社ID
   * @param responseGroup レスポンスグループ
   * @returns 顧客支社詳細レスポンス
   */
  async getClientBranch(id: unknown, responseGroup?: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedResponseGroup = responseGroup 
        ? z.enum(['small', 'medium', 'large']).parse(responseGroup) 
        : undefined;
      
      const clientBranch = await this.sdk.clientBranches.getClientBranch(validatedId, validatedResponseGroup);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error(`Error getting client branch ${id}:`, error);
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
   * 顧客IDに紐づく顧客支社一覧を取得するエンドポイント
   * @param clientId 顧客ID
   * @param params 検索パラメータ
   * @returns 顧客支社一覧レスポンス
   */
  async getClientBranchesByClientId(clientId: unknown, params?: unknown): Promise<ApiResponse<ListResponse<ClientBranch>>> {
    try {
      const validatedClientId = z.number().int().positive().parse(clientId);
      const validatedParams = params 
        ? ClientBranchParamsSchema.parse(params) 
        : undefined;
      
      const clientBranches = await this.sdk.clientBranches.getClientBranchesByClientId(validatedClientId, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranches, null, 2)
          }
        ],
        data: clientBranches
      };
    } catch (error) {
      console.error(`Error getting client branches for client ${clientId}:`, error);
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
   * 顧客支社を新規作成するエンドポイント
   * @param data 顧客支社作成データ
   * @returns 作成された顧客支社レスポンス
   */
  async createClientBranch(data: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedData = ClientBranchCreateParamsSchema.parse(data);
      
      const clientBranch = await this.sdk.clientBranches.createClientBranch(validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error('Error creating client branch:', error);
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
   * 特定の顧客に紐づく顧客支社を新規作成するエンドポイント
   * @param clientId 顧客ID
   * @param data 顧客支社作成データ（client_idは不要）
   * @returns 作成された顧客支社レスポンス
   */
  async createClientBranchForClient(clientId: unknown, data: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedClientId = z.number().int().positive().parse(clientId);
      const validatedData = ClientBranchCreateParamsSchema.omit({ client_id: true }).parse(data);
      
      const clientBranch = await this.sdk.clientBranches.createClientBranchForClient(validatedClientId, validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error(`Error creating client branch for client ${clientId}:`, error);
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
   * 顧客支社情報を更新するエンドポイント
   * @param id 顧客支社ID
   * @param data 顧客支社更新データ
   * @returns 更新された顧客支社レスポンス
   */
  async updateClientBranch(id: unknown, data: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedData = ClientBranchUpdateParamsSchema.parse(data);
      
      const clientBranch = await this.sdk.clientBranches.updateClientBranch(validatedId, validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error(`Error updating client branch ${id}:`, error);
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
   * 顧客支社を削除するエンドポイント
   * @param id 顧客支社ID
   * @returns 削除結果レスポンス
   */
  async deleteClientBranch(id: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      await this.sdk.clientBranches.deleteClientBranch(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Client branch with ID ${validatedId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting client branch ${id}:`, error);
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
   * 顧客支社をアーカイブするエンドポイント
   * @param id 顧客支社ID
   * @returns アーカイブされた顧客支社レスポンス
   */
  async archiveClientBranch(id: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      const clientBranch = await this.sdk.clientBranches.archiveClientBranch(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error(`Error archiving client branch ${id}:`, error);
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
   * 顧客支社のアーカイブを解除するエンドポイント
   * @param id 顧客支社ID
   * @returns アーカイブ解除された顧客支社レスポンス
   */
  async unarchiveClientBranch(id: unknown): Promise<ApiResponse<ClientBranch>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      const clientBranch = await this.sdk.clientBranches.unarchiveClientBranch(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ],
        data: clientBranch
      };
    } catch (error) {
      console.error(`Error unarchiving client branch ${id}:`, error);
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
