// 共通の型定義
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

// 顧客関連の型定義
export interface Client {
  id: number;
  name: string;
  name_kana: string;
  code: string;
  short_name: string;
  archive_flg: boolean;
  created_at: string;
  updated_at: string;
  // mediumレスポンスグループ用
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  industry_id?: number;
  industry_name?: string;
  memo?: string;
}

export interface ClientParams extends PaginationParams {
  include_archive_flg?: boolean;
  response_group?: 'small' | 'medium' | 'large';
}

export interface ClientCreateParams {
  name: string;
  name_kana: string;
  code?: string;
  short_name: string;
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  industry_id?: number;
  memo?: string;
}

export interface ClientUpdateParams {
  name?: string;
  name_kana?: string;
  code?: string;
  short_name?: string;
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  industry_id?: number;
  memo?: string;
  archive_flg?: boolean;
}

// 顧客支社関連の型定義
export interface ClientBranch {
  id: number;
  client_id: number;
  name: string;
  code: string;
  archive_flg: boolean;
  created_at: string;
  updated_at: string;
  // mediumレスポンスグループ用
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  memo?: string;
}

export interface ClientBranchParams extends PaginationParams {
  include_archive_flg?: boolean;
  response_group?: 'small' | 'medium' | 'large';
}

export interface ClientBranchCreateParams {
  client_id: number;
  name: string;
  code?: string;
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  memo?: string;
}

export interface ClientBranchUpdateParams {
  name?: string;
  code?: string;
  zip?: string;
  address?: string;
  tel?: string;
  fax?: string;
  url?: string;
  memo?: string;
  archive_flg?: boolean;
}

// 案件関連の型定義
export interface Project {
  id: number;
  name: string;
  code: string;
  status: string;
  created_at: string;
  updated_at: string;
  // mediumレスポンスグループ用
  client_id?: number;
  client_name?: string;
  client_branch_id?: number;
  client_branch_name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ProjectParams extends PaginationParams {
  response_group?: 'small' | 'medium' | 'large';
  status?: string;
  client_id?: number;
  client_branch_id?: number;
}

export interface ProjectCreateParams {
  name: string;
  code?: string;
  status: string;
  client_id: number;
  client_branch_id?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ProjectUpdateParams {
  name?: string;
  code?: string;
  status?: string;
  client_id?: number;
  client_branch_id?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
} 