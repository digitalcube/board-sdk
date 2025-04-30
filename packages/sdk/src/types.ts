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

// 請求ステータス定数
export const InvoiceStatus = {
  /** 未請求 */
  UNPAID: 1,
  /** 請求済 */
  BILLED: 2,
  /** 入金済 */
  PAID: 3,
  /** 請求OK */
  BILL_OK: 4,
  /** 一部入金済 */
  PARTIALLY_PAID: 5,
  /** 回収不能 */
  UNCOLLECTIBLE: 9
} as const;

export type InvoiceStatusValue = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

// 受注ステータス定数
export const OrderStatus = {
  /** 見積中(高) */
  ESTIMATE_HIGH: 1,
  /** 見積中(中) */
  ESTIMATE_MEDIUM: 2,
  /** 見積中(低) */
  ESTIMATE_LOW: 3,
  /** 受注確定 */
  ORDER_CONFIRMED: 4,
  /** 受注済 */
  ORDERED: 5,
  /** 見積中(除) */
  ESTIMATE_EXCLUDED: 8,
  /** 失注 */
  LOST: 9
} as const;

export type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

// 発注ステータス定数
export const ExpenditureStatus = {
  /** 見積中(高) */
  ESTIMATE_HIGH: 1,
  /** 見積中(中) */
  ESTIMATE_MEDIUM: 2,
  /** 見積中(低) */
  ESTIMATE_LOW: 3,
  /** 発注確定 */
  ORDER_CONFIRMED: 4,
  /** 発注済 */
  ORDERED: 5,
  /** 見積中(除) */
  ESTIMATE_EXCLUDED: 8,
  /** 見送り */
  CANCELED: 9
} as const;

export type ExpenditureStatusValue = (typeof ExpenditureStatus)[keyof typeof ExpenditureStatus];

// 支払ステータス定数
export const PaymentStatus = {
  /** 請求書未受領 */
  INVOICE_NOT_RECEIVED: 1,
  /** 請求書受領済 */
  INVOICE_RECEIVED: 2,
  /** 支払済 */
  PAID: 3,
  /** 振込予約済 */
  TRANSFER_RESERVED: 4
} as const;

export type PaymentStatusValue = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// 支払方法定数
export const PaymentMethod = {
  /** 銀行振込 */
  BANK_TRANSFER: 1,
  /** 口座振替 */
  ACCOUNT_TRANSFER: 2,
  /** クレジットカード */
  CREDIT_CARD: 3,
  /** 現金支払 */
  CASH: 4,
  /** 代金引換 */
  CASH_ON_DELIVERY: 5,
  /** コンビニ支払 */
  CONVENIENCE_STORE: 6,
  /** 郵便振替 */
  POSTAL_TRANSFER: 7
} as const;

export type PaymentMethodValue = (typeof PaymentMethod)[keyof typeof PaymentMethod];

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

// 請求関連の型定義
export interface Invoice {
  id: number;
  project_id: number;
  project_no: number;
  management_no: string;
  name: string;
  total: number;
  tax: number;
  cost_total: number;
  cost_tax: number;
  invoice_date: string;
  payment_limit_date: string;
  order_status: number;
  order_status_name: string;
  invoice_status: number;
  invoice_status_name: string;
  project_type_id?: number;
  project_type_name?: string;
  project_type2_id?: number;
  project_type2_name?: string;
  project_type3_id?: number;
  project_type3_name?: string;
  group_id?: number;
  group_name?: string;
  paid_date?: string;
  currency: string;
  created_at: string;
  updated_at: string;
  // mediumレスポンスグループ用
  client?: {
    id: number;
    name: string;
    name_disp: string;
    custom_no: string;
  };
  contact?: {
    id: number;
    last_name: string;
    first_name: string;
  };
  user?: {
    id: number;
    last_name: string;
    first_name: string;
  };
  client_branch?: {
    id: number;
    name: string;
  };
  company_branch?: {
    id: number;
    name: string;
  };
  tags?: string[];
  exchange_rate?: number;
  total_jpy?: number;
  tax_jpy?: number;
  // 請求書データ (invoice レスポンスグループ用)
  invoice?: {
    id: number;
    message?: string;
    total?: number;
    tax?: number;
    tax_withholding?: number;
    seal_approval_status?: number;
    document_amount_disp_kbn?: number;
    lock_flg?: number;
    delivery_place?: string;
    details?: InvoiceDetail[];
    invoice_date?: string;
    payment_limit_date?: string;
    disp_invoice_date?: string;
    blank_date_flg?: number;
    multi_bank_info_flg?: number;
  };
}

export interface InvoiceDetail {
  no: number;
  detail_date?: string;
  description?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  price?: number;
  tax_rate?: number;
  tax_withholding_flg?: number;
  tax_included_flg?: number;
  reduced_tax_rate_kbn?: number;
  section_description?: string;
  section_subtotal?: number;
  document_detail_kbn?: number;
  document_detail_kbn_name?: string;
  deduction_applicable?: boolean;
}

export interface InvoiceParams extends PaginationParams {
  invoice_date_gteq?: string;
  invoice_date_lteq?: string;
  invoice_payment_limit_date_gteq?: string;
  invoice_payment_limit_date_lteq?: string;
  project_order_status_in?: string;
  invoice_status_in?: string;
  project_project_no_eq?: number;
  updated_at_gteq?: string;
  updated_at_lteq?: string;
  response_group?: 'small' | 'medium' | 'large' | 'invoice' | 'all';
}

export interface InvoiceStatusUpdateParams {
  invoice_status: number;
}

// 支払関連の型定義
export interface ExpenditurePayment {
  id: number;
  expenditure_id: number;
  expenditure_no: number;
  management_no: string;
  name: string;
  total: number;
  tax: number;
  tax_withholding: number;
  invoice_date: string;
  payment_date: string;
  expenditure_status: number;
  expenditure_status_name: string;
  payment_status: number;
  payment_status_name: string;
  payment_method_kbn: number;
  payment_method_kbn_name: string;
  expenditure_type_id?: number;
  expenditure_type_name?: string;
  expenditure_type2_id?: number;
  expenditure_type2_name?: string;
  expenditure_type3_id?: number;
  expenditure_type3_name?: string;
  group_id?: number;
  group_name?: string;
  currency: string;
  created_at: string;
  updated_at: string;
  // mediumレスポンスグループ用
  payee?: {
    id: number;
    name: string;
    name_disp: string;
    custom_no: string;
  };
  payee_contact?: {
    id: number;
    last_name: string;
    first_name: string;
  };
  user?: {
    id: number;
    last_name: string;
    first_name: string;
  };
  payee_branch?: {
    id: number;
    name: string;
  };
  company_branch?: {
    id: number;
    name: string;
  };
  tags?: string[];
  exchange_rate?: number;
  total_jpy?: number;
  tax_jpy?: number;
  lock_flg?: number;
}

export interface ExpenditurePaymentParams extends PaginationParams {
  invoice_date_gteq?: string;
  invoice_date_lteq?: string;
  payment_date_gteq?: string;
  payment_date_lteq?: string;
  expenditure_expenditure_status_in?: string;
  payment_status_in?: string;
  expenditure_expenditure_no_eq?: number;
  updated_at_gteq?: string;
  updated_at_lteq?: string;
  response_group?: 'small' | 'medium' | 'large' | 'invoice' | 'all';
}

export interface PaymentStatusUpdateParams {
  payment_status: number;
}

export interface PaymentLockUpdateParams {
  lock_flg: number;
} 