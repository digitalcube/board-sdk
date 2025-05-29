import { z } from 'zod';
import type {
  ClientParams,
  ClientCreateParams,
  ClientUpdateParams,
  ClientBranchParams,
  ClientBranchCreateParams,
  ClientBranchUpdateParams,
  ProjectCreateParams,
  ProjectUpdateParams
} from '@digitalcube/board-sdk';

export const ClientParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional(),
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

export const ClientBranchParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().optional(),
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

export const ProjectCreateParamsSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  status: z.string().min(1),
  client_id: z.number().int().positive(),
  client_branch_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional()
});

export const ProjectUpdateParamsSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().optional(),
  status: z.string().min(1).optional(),
  client_id: z.number().int().positive().optional(),
  client_branch_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional()
});

export const InvoiceStatusUpdateParamsSchema = z.object({
  invoice_status: z.number().int().positive()
});
