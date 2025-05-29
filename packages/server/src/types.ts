import { z } from 'zod';
import type {
  PaginationParams,
  ClientParams,
  ClientCreateParams,
  ClientUpdateParams,
  ClientBranchParams,
  ClientBranchCreateParams,
  ClientBranchUpdateParams,
  ProjectParams,
  ProjectCreateParams,
  ProjectUpdateParams,
  InvoiceParams,
  InvoiceStatusUpdateParams,
  ExpenditurePaymentParams,
  PaymentStatusUpdateParams,
  PaymentLockUpdateParams
} from '@digitalcube/board-sdk';

export interface ApiResponse<T> {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  data?: T;
}

export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional()
});

export const ClientParamsSchema = PaginationParamsSchema.extend({
  include_archive_flg: z.boolean().optional(),
  response_group: z.enum(['small', 'medium', 'large']).optional()
});

export const ClientCreateParamsSchema = z.object({
  name: z.string().min(1),
  name_kana: z.string().min(1),
  code: z.string().optional(),
  short_name: z.string().min(1),
  zip: z.string().optional(),
  address: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
  url: z.string().optional(),
  industry_id: z.number().int().positive().optional(),
  memo: z.string().optional()
});

export const ClientUpdateParamsSchema = z.object({
  name: z.string().min(1).optional(),
  name_kana: z.string().min(1).optional(),
  code: z.string().optional(),
  short_name: z.string().min(1).optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
  url: z.string().optional(),
  industry_id: z.number().int().positive().optional(),
  memo: z.string().optional(),
  archive_flg: z.boolean().optional()
});

export const ClientBranchParamsSchema = PaginationParamsSchema.extend({
  include_archive_flg: z.boolean().optional(),
  response_group: z.enum(['small', 'medium', 'large']).optional()
});

export const ClientBranchCreateParamsSchema = z.object({
  client_id: z.number().int().positive(),
  name: z.string().min(1),
  code: z.string().optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
  url: z.string().optional(),
  memo: z.string().optional()
});

export const ClientBranchUpdateParamsSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().optional(),
  zip: z.string().optional(),
  address: z.string().optional(),
  tel: z.string().optional(),
  fax: z.string().optional(),
  url: z.string().optional(),
  memo: z.string().optional(),
  archive_flg: z.boolean().optional()
});

export const ProjectParamsSchema = PaginationParamsSchema.extend({
  response_group: z.enum(['small', 'medium', 'large']).optional(),
  status: z.string().optional(),
  client_id: z.number().int().positive().optional(),
  client_branch_id: z.number().int().positive().optional()
});

export const ProjectCreateParamsSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  status: z.string(),
  client_id: z.number().int().positive(),
  client_branch_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional()
});

export const ProjectUpdateParamsSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().optional(),
  status: z.string().optional(),
  client_id: z.number().int().positive().optional(),
  client_branch_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional()
});

export const InvoiceParamsSchema = PaginationParamsSchema.extend({
  invoice_date_gteq: z.string().optional(),
  invoice_date_lteq: z.string().optional(),
  invoice_payment_limit_date_gteq: z.string().optional(),
  invoice_payment_limit_date_lteq: z.string().optional(),
  project_order_status_in: z.string().optional(),
  invoice_status_in: z.string().optional(),
  project_project_no_eq: z.number().int().positive().optional(),
  updated_at_gteq: z.string().optional(),
  updated_at_lteq: z.string().optional(),
  response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional()
});

export const InvoiceStatusUpdateParamsSchema = z.object({
  invoice_status: z.number().int().positive()
});

export const ExpenditurePaymentParamsSchema = PaginationParamsSchema.extend({
  invoice_date_gteq: z.string().optional(),
  invoice_date_lteq: z.string().optional(),
  payment_date_gteq: z.string().optional(),
  payment_date_lteq: z.string().optional(),
  expenditure_expenditure_status_in: z.string().optional(),
  payment_status_in: z.string().optional(),
  expenditure_expenditure_no_eq: z.number().int().positive().optional(),
  updated_at_gteq: z.string().optional(),
  updated_at_lteq: z.string().optional(),
  response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional()
});

export const PaymentStatusUpdateParamsSchema = z.object({
  payment_status: z.number().int().positive()
});

export const PaymentLockUpdateParamsSchema = z.object({
  lock_flg: z.number().int()
});
