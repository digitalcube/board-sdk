import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import type { Project, ProjectParams, ProjectCreateParams, ProjectUpdateParams, ListResponse } from '@digitalcube/board-sdk';
import { ProjectParamsSchema, ProjectCreateParamsSchema, ProjectUpdateParamsSchema, ApiResponse } from '../types.js';

/**
 * 案件関連のサーバーAPI実装
 */
export class ProjectServerService {
  private sdk: BoardApiSdk;

  /**
   * ProjectServerServiceを初期化します
   * @param sdk BoardApiSdkインスタンス
   */
  constructor(sdk: BoardApiSdk) {
    this.sdk = sdk;
  }

  /**
   * 案件一覧を取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 案件一覧レスポンス
   */
  async getProjects(params?: unknown): Promise<ApiResponse<ListResponse<Project>>> {
    try {
      const validatedParams = params 
        ? ProjectParamsSchema.parse(params) 
        : undefined;
      
      const projects = await this.sdk.projects.getProjects(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2)
          }
        ],
        data: projects
      };
    } catch (error) {
      console.error('Error getting projects:', error);
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
   * 案件詳細を取得するエンドポイント
   * @param id 案件ID
   * @param responseGroup レスポンスグループ
   * @returns 案件詳細レスポンス
   */
  async getProject(id: unknown, responseGroup?: unknown): Promise<ApiResponse<Project>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedResponseGroup = responseGroup 
        ? z.enum(['small', 'medium', 'large']).parse(responseGroup) 
        : undefined;
      
      const project = await this.sdk.projects.getProject(validatedId, validatedResponseGroup);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ],
        data: project
      };
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
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
   * 顧客IDに紐づく案件一覧を取得するエンドポイント
   * @param clientId 顧客ID
   * @param params 検索パラメータ
   * @returns 案件一覧レスポンス
   */
  async getProjectsByClientId(clientId: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Project>>> {
    try {
      const validatedClientId = z.number().int().positive().parse(clientId);
      const validatedParams = params 
        ? ProjectParamsSchema.parse(params) 
        : undefined;
      
      const projects = await this.sdk.projects.getProjectsByClientId(validatedClientId, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2)
          }
        ],
        data: projects
      };
    } catch (error) {
      console.error(`Error getting projects for client ${clientId}:`, error);
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
   * 顧客支社IDに紐づく案件一覧を取得するエンドポイント
   * @param clientBranchId 顧客支社ID
   * @param params 検索パラメータ
   * @returns 案件一覧レスポンス
   */
  async getProjectsByClientBranchId(clientBranchId: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Project>>> {
    try {
      const validatedClientBranchId = z.number().int().positive().parse(clientBranchId);
      const validatedParams = params 
        ? ProjectParamsSchema.parse(params) 
        : undefined;
      
      const projects = await this.sdk.projects.getProjectsByClientBranchId(validatedClientBranchId, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2)
          }
        ],
        data: projects
      };
    } catch (error) {
      console.error(`Error getting projects for client branch ${clientBranchId}:`, error);
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
   * 案件を新規作成するエンドポイント
   * @param data 案件作成データ
   * @returns 作成された案件レスポンス
   */
  async createProject(data: unknown): Promise<ApiResponse<Project>> {
    try {
      const validatedData = ProjectCreateParamsSchema.parse(data);
      
      const project = await this.sdk.projects.createProject(validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ],
        data: project
      };
    } catch (error) {
      console.error('Error creating project:', error);
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
   * 特定の顧客に紐づく案件を新規作成するエンドポイント
   * @param clientId 顧客ID
   * @param data 案件作成データ（client_idは不要）
   * @returns 作成された案件レスポンス
   */
  async createProjectForClient(clientId: unknown, data: unknown): Promise<ApiResponse<Project>> {
    try {
      const validatedClientId = z.number().int().positive().parse(clientId);
      const validatedData = ProjectCreateParamsSchema.omit({ client_id: true }).parse(data);
      
      const project = await this.sdk.projects.createProjectForClient(validatedClientId, validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ],
        data: project
      };
    } catch (error) {
      console.error(`Error creating project for client ${clientId}:`, error);
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
   * 案件情報を更新するエンドポイント
   * @param id 案件ID
   * @param data 案件更新データ
   * @returns 更新された案件レスポンス
   */
  async updateProject(id: unknown, data: unknown): Promise<ApiResponse<Project>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedData = ProjectUpdateParamsSchema.parse(data);
      
      const project = await this.sdk.projects.updateProject(validatedId, validatedData);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ],
        data: project
      };
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
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
   * 案件のステータスを更新するエンドポイント
   * @param id 案件ID
   * @param status 新しいステータス
   * @returns 更新された案件レスポンス
   */
  async updateProjectStatus(id: unknown, status: unknown): Promise<ApiResponse<Project>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedStatus = z.string().min(1).parse(status);
      
      const project = await this.sdk.projects.updateProjectStatus(validatedId, validatedStatus);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ],
        data: project
      };
    } catch (error) {
      console.error(`Error updating project status ${id}:`, error);
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
   * 案件を削除するエンドポイント
   * @param id 案件ID
   * @returns 削除結果レスポンス
   */
  async deleteProject(id: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      
      await this.sdk.projects.deleteProject(validatedId);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Project with ID ${validatedId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
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
