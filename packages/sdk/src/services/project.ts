import { BoardApiClient } from '../client.js';
import type { Project, ProjectParams, ListResponse, ProjectCreateParams, ProjectUpdateParams } from '../types.js';

export class ProjectService {
  private client: BoardApiClient;

  constructor(client: BoardApiClient) {
    this.client = client;
  }

  /**
   * 案件一覧を取得します
   * @param params 検索パラメータ
   * @returns 案件一覧
   */
  async getProjects(params?: ProjectParams): Promise<ListResponse<Project>> {
    return this.client.request<ListResponse<Project>>('/projects', 'GET', undefined, params as Record<string, string | number | boolean> | undefined);
  }

  /**
   * 案件詳細を取得します
   * @param id 案件ID
   * @param responseGroup レスポンスグループ
   * @returns 案件詳細
   */
  async getProject(id: number, responseGroup?: 'small' | 'medium' | 'large'): Promise<Project> {
    const params = responseGroup ? { response_group: responseGroup } : undefined;
    return this.client.request<Project>(`/projects/${id}`, 'GET', undefined, params);
  }

  /**
   * 顧客IDに紐づく案件一覧を取得します
   * @param clientId 顧客ID
   * @param params 検索パラメータ
   * @returns 案件一覧
   */
  async getProjectsByClientId(clientId: number, params?: ProjectParams): Promise<ListResponse<Project>> {
    const queryParams = { ...(params || {}), client_id: clientId };
    return this.client.request<ListResponse<Project>>(
      '/projects', 
      'GET', 
      undefined, 
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 顧客支社IDに紐づく案件一覧を取得します
   * @param clientBranchId 顧客支社ID
   * @param params 検索パラメータ
   * @returns 案件一覧
   */
  async getProjectsByClientBranchId(clientBranchId: number, params?: ProjectParams): Promise<ListResponse<Project>> {
    const queryParams = { ...(params || {}), client_branch_id: clientBranchId };
    return this.client.request<ListResponse<Project>>(
      '/projects', 
      'GET', 
      undefined, 
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 案件を新規作成します
   * @param data 案件作成データ
   * @returns 作成された案件
   */
  async createProject(data: ProjectCreateParams): Promise<Project> {
    return this.client.request<Project>('/projects', 'POST', data);
  }

  /**
   * 特定の顧客に紐づく案件を新規作成します
   * @param clientId 顧客ID
   * @param data 案件作成データ（client_idは不要）
   * @returns 作成された案件
   */
  async createProjectForClient(clientId: number, data: Omit<ProjectCreateParams, 'client_id'>): Promise<Project> {
    const projectData: ProjectCreateParams = {
      ...data,
      client_id: clientId
    };
    return this.createProject(projectData);
  }

  /**
   * 特定の顧客支社に紐づく案件を新規作成します
   * @param clientId 顧客ID
   * @param clientBranchId 顧客支社ID
   * @param data 案件作成データ（client_id、client_branch_idは不要）
   * @returns 作成された案件
   */
  async createProjectForClientBranch(
    clientId: number,
    clientBranchId: number,
    data: Omit<ProjectCreateParams, 'client_id' | 'client_branch_id'>
  ): Promise<Project> {
    const projectData: ProjectCreateParams = {
      ...data,
      client_id: clientId,
      client_branch_id: clientBranchId
    };
    return this.createProject(projectData);
  }

  /**
   * 案件情報を更新します
   * @param id 案件ID
   * @param data 案件更新データ
   * @returns 更新された案件
   */
  async updateProject(id: number, data: ProjectUpdateParams): Promise<Project> {
    return this.client.request<Project>(`/projects/${id}`, 'PATCH', data);
  }

  /**
   * 案件のステータスを更新します
   * @param id 案件ID
   * @param status 新しいステータス
   * @returns 更新された案件
   */
  async updateProjectStatus(id: number, status: string): Promise<Project> {
    return this.updateProject(id, { status });
  }

  /**
   * 案件を削除します
   * @param id 案件ID
   * @returns 削除結果
   */
  async deleteProject(id: number): Promise<void> {
    return this.client.request<void>(`/projects/${id}`, 'DELETE');
  }
} 