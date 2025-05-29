import 'dotenv/config'; // 環境変数をロード
import { BoardApiSdk } from '@digitalcube/board-sdk';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from 'zod';
import type { 
  ProjectParams, 
  ClientParams,
  ClientCreateParams,
  ClientUpdateParams,
  ClientBranchParams,
  ClientBranchCreateParams,
  ClientBranchUpdateParams,
  ProjectCreateParams,
  ProjectUpdateParams,
  InvoiceParams,
  ExpenditurePaymentParams,
  PaymentStatusValue,
  ExpenditureStatusValue,
  InvoiceStatusValue,
  OrderStatusValue
} from '@digitalcube/board-sdk';
import {
  ClientParamsSchema,
  ClientCreateParamsSchema,
  ClientUpdateParamsSchema,
  ClientBranchParamsSchema,
  ClientBranchCreateParamsSchema,
  ClientBranchUpdateParamsSchema,
  ProjectParamsSchema,
  ProjectCreateParamsSchema,
  ProjectUpdateParamsSchema,
  InvoiceParamsSchema,
  ExpenditurePaymentParamsSchema,
  PaymentStatusUpdateParamsSchema,
  PaymentLockUpdateParamsSchema
} from './types.js';

const boardSdk = new BoardApiSdk({
  apiKey: process.env.BOARD_API_KEY as string,
  apiToken: process.env.BOARD_API_TOKEN as string,
});

/**
 * Create an MCP server
 */
const server = new McpServer({
  name: "dc_board_mcp_server",
  description: 'This is a server that can be used to interact with Board',
  version: "0.0.1",
});

// --- MCP Tools --- //


// 案件一覧を取得するツール
server.tool(
  'get_board_projects',
  {
    // ProjectParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    status: z.string().optional().describe('ステータスでフィルタリング'),
    client_id: z.number().int().positive().optional().describe('顧客IDでフィルタリング'),
    client_branch_id: z.number().int().positive().optional().describe('顧客支社IDでフィルタリング'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async (params: ProjectParams) => {
    try {
      const projects = await boardSdk.projects.getProjects(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('Error getting projects:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting projects: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 特定の案件情報を取得するツール
server.tool(
  'get_board_project',
  {
    projectId: z.number().int().positive().describe('案件ID'),
    responseGroup: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ projectId, responseGroup }: { projectId: number, responseGroup?: 'small' | 'medium' | 'large' }) => {
    try {
      const project = await boardSdk.projects.getProject(projectId, responseGroup);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error getting project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting project ${projectId}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 特定の顧客IDに紐づく案件一覧を取得するツール
server.tool(
  'get_board_projects_by_client_id',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    status: z.string().optional().describe('ステータスでフィルタリング'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ clientId, ...params }: { clientId: number } & Omit<ProjectParams, 'client_id'>) => {
    try {
      const projects = await boardSdk.projects.getProjectsByClientId(clientId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error getting projects for client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting projects for client ${clientId}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// 特定の顧客支社IDに紐づく案件一覧を取得するツール
server.tool(
  'get_board_projects_by_client_branch_id',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    status: z.string().optional().describe('ステータスでフィルタリング'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ clientBranchId, ...params }: { clientBranchId: number } & Omit<ProjectParams, 'client_branch_id'>) => {
    try {
      const projects = await boardSdk.projects.getProjectsByClientBranchId(clientBranchId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error getting projects for client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting projects for client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

server.tool(
  'create_board_project',
  {
    // ProjectCreateParamsに対応するzodスキーマ
    name: z.string().min(1).describe('案件名'),
    code: z.string().optional().describe('案件コード'),
    status: z.string().min(1).describe('ステータス'),
    client_id: z.number().int().positive().describe('顧客ID'),
    client_branch_id: z.number().int().positive().optional().describe('顧客支社ID'),
    start_date: z.string().optional().describe('開始日'),
    end_date: z.string().optional().describe('終了日'),
    description: z.string().optional().describe('説明')
  },
  async (data: ProjectCreateParams) => {
    try {
      const project = await boardSdk.projects.createProject(data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error creating project: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'create_board_project_for_client',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    // ProjectCreateParamsからclient_idを除いたzodスキーマ
    name: z.string().min(1).describe('案件名'),
    code: z.string().optional().describe('案件コード'),
    status: z.string().min(1).describe('ステータス'),
    client_branch_id: z.number().int().positive().optional().describe('顧客支社ID'),
    start_date: z.string().optional().describe('開始日'),
    end_date: z.string().optional().describe('終了日'),
    description: z.string().optional().describe('説明')
  },
  async ({ clientId, ...data }: { clientId: number } & Omit<ProjectCreateParams, 'client_id'>) => {
    try {
      const project = await boardSdk.projects.createProjectForClient(clientId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error creating project for client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error creating project for client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_project',
  {
    projectId: z.number().int().positive().describe('案件ID'),
    // ProjectUpdateParamsに対応するzodスキーマ
    data: ProjectUpdateParamsSchema.describe('更新データ')
  },
  async ({ projectId, data }: { projectId: number, data: ProjectUpdateParams }) => {
    try {
      const project = await boardSdk.projects.updateProject(projectId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating project ${projectId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_project_status',
  {
    projectId: z.number().int().positive().describe('案件ID'),
    status: z.string().min(1).describe('新しいステータス')
  },
  async ({ projectId, status }: { projectId: number, status: string }) => {
    try {
      const project = await boardSdk.projects.updateProjectStatus(projectId, status);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating status for project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating status for project ${projectId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'delete_board_project',
  {
    projectId: z.number().int().positive().describe('案件ID')
  },
  async ({ projectId }: { projectId: number }) => {
    try {
      await boardSdk.projects.deleteProject(projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Project with ID ${projectId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting project ${projectId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);



// 請求書一覧を取得するツール
server.tool(
  'get_board_invoices',
  {
    // InvoiceParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    invoice_date_gteq: z.string().optional().describe('請求日の開始日'),
    invoice_date_lteq: z.string().optional().describe('請求日の終了日'),
    invoice_payment_limit_date_gteq: z.string().optional().describe('支払期限日の開始日'),
    invoice_payment_limit_date_lteq: z.string().optional().describe('支払期限日の終了日'),
    project_order_status_in: z.string().optional().describe('発注ステータス（カンマ区切りの複数指定可）'),
    invoice_status_in: z.string().optional().describe('請求書ステータス（カンマ区切りの複数指定可）'),
    project_project_no_eq: z.number().int().positive().optional().describe('案件番号'),
    updated_at_gteq: z.string().optional().describe('更新日時の開始日時'),
    updated_at_lteq: z.string().optional().describe('更新日時の終了日時'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: InvoiceParams) => {
    try {
      const invoices = await boardSdk.invoices.getInvoices(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoices:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 特定の案件IDに紐づく請求書一覧を取得するツール
server.tool(
  'get_board_invoices_by_project_id',
  {
    projectId: z.number().int().positive().describe('案件ID'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ projectId, ...params }: { projectId: number } & Omit<InvoiceParams, 'project_id'>) => {
    try {
      const invoices = await boardSdk.invoices.getInvoicesByProjectId(projectId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting invoices for project ${projectId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices for project ${projectId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 請求日の範囲で請求書一覧を取得するツール
server.tool(
  'get_board_invoices_by_date_range',
  {
    startDate: z.string().describe('請求日の開始日（YYYY-MM-DD形式）'),
    endDate: z.string().describe('請求日の終了日（YYYY-MM-DD形式）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ startDate, endDate, ...params }: { startDate: string, endDate: string } & Omit<InvoiceParams, 'invoice_date_gteq' | 'invoice_date_lteq'>) => {
    try {
      const invoices = await boardSdk.invoices.getInvoicesByDateRange(startDate, endDate, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoices by date range:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices by date range: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 支払期限日の範囲で請求書一覧を取得するツール
server.tool(
  'get_board_invoices_by_payment_limit_date_range',
  {
    startDate: z.string().describe('支払期限日の開始日（YYYY-MM-DD形式）'),
    endDate: z.string().describe('支払期限日の終了日（YYYY-MM-DD形式）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ startDate, endDate, ...params }: { startDate: string, endDate: string } & Omit<InvoiceParams, 'invoice_payment_limit_date_gteq' | 'invoice_payment_limit_date_lteq'>) => {
    try {
      const invoices = await boardSdk.invoices.getInvoicesByPaymentLimitDateRange(startDate, endDate, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoices by payment limit date range:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices by payment limit date range: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 請求書ステータスで請求書一覧を取得するツール
server.tool(
  'get_board_invoices_by_status',
  {
    invoice_status_in: z.string().describe('請求書ステータス（カンマ区切りの複数指定可）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: InvoiceParams) => {
    try {
      let statusValues: InvoiceStatusValue[] = [];
      if (params.invoice_status_in) {
        statusValues = params.invoice_status_in.split(',').map(Number) as InvoiceStatusValue[];
      }
      
      const invoices = await boardSdk.invoices.getInvoicesByStatus(statusValues, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoices by status:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices by status: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 発注ステータスで請求書一覧を取得するツール
server.tool(
  'get_board_invoices_by_order_status',
  {
    project_order_status_in: z.string().describe('発注ステータス（カンマ区切りの複数指定可）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: InvoiceParams) => {
    try {
      let statusValues: OrderStatusValue[] = [];
      if (params.project_order_status_in) {
        statusValues = params.project_order_status_in.split(',').map(Number) as OrderStatusValue[];
      }
      
      const invoices = await boardSdk.invoices.getInvoicesByOrderStatus(statusValues, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoices by order status:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoices by order status: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 未払いの請求書一覧を取得するツール
server.tool(
  'get_board_unpaid_invoices',
  {
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: InvoiceParams) => {
    try {
      const invoices = await boardSdk.invoices.getUnpaidInvoices(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting unpaid invoices:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting unpaid invoices: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_invoice_status',
  {
    invoice_id: z.number().int().positive().describe('請求書ID'),
    invoice_status: z.number().int().positive().describe('新しい請求書ステータス')
  },
  async (params: { invoice_id: number, invoice_status: number }) => {
    try {
      const invoice = await boardSdk.invoices.updateInvoiceStatus(
        params.invoice_id, 
        params.invoice_status as InvoiceStatusValue
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoice, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating status for invoice ${params.invoice_id}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating status for invoice ${params.invoice_id}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);


// 支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments',
  {
    // ExpenditurePaymentParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    invoice_date_gteq: z.string().optional().describe('請求日の開始日'),
    invoice_date_lteq: z.string().optional().describe('請求日の終了日'),
    payment_date_gteq: z.string().optional().describe('支払日の開始日'),
    payment_date_lteq: z.string().optional().describe('支払日の終了日'),
    expenditure_expenditure_status_in: z.string().optional().describe('支出ステータス（カンマ区切りの複数指定可）'),
    payment_status_in: z.string().optional().describe('支払ステータス（カンマ区切りの複数指定可）'),
    expenditure_expenditure_no_eq: z.number().int().positive().optional().describe('支出番号'),
    updated_at_gteq: z.string().optional().describe('更新日時の開始日時'),
    updated_at_lteq: z.string().optional().describe('更新日時の終了日時'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      const payments = await boardSdk.expenditurePayments.getExpenditurePayments(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting expenditure payments:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 特定の支出IDに紐づく支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments_by_expenditure_id',
  {
    expenditureId: z.number().int().positive().describe('支出ID'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ expenditureId, ...params }: { expenditureId: number } & Omit<ExpenditurePaymentParams, 'expenditure_id'>) => {
    try {
      const payments = await boardSdk.expenditurePayments.getExpenditurePaymentsByExpenditureId(expenditureId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting expenditure payments for expenditure ${expenditureId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments for expenditure ${expenditureId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 請求日の範囲で支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments_by_invoice_date_range',
  {
    startDate: z.string().describe('請求日の開始日（YYYY-MM-DD形式）'),
    endDate: z.string().describe('請求日の終了日（YYYY-MM-DD形式）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ startDate, endDate, ...params }: { startDate: string, endDate: string } & Omit<ExpenditurePaymentParams, 'invoice_date_gteq' | 'invoice_date_lteq'>) => {
    try {
      const payments = await boardSdk.expenditurePayments.getExpenditurePaymentsByInvoiceDateRange(startDate, endDate, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting expenditure payments by invoice date range:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments by invoice date range: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 支払日の範囲で支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments_by_payment_date_range',
  {
    startDate: z.string().describe('支払日の開始日（YYYY-MM-DD形式）'),
    endDate: z.string().describe('支払日の終了日（YYYY-MM-DD形式）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async ({ startDate, endDate, ...params }: { startDate: string, endDate: string } & Omit<ExpenditurePaymentParams, 'payment_date_gteq' | 'payment_date_lteq'>) => {
    try {
      const payments = await boardSdk.expenditurePayments.getExpenditurePaymentsByPaymentDateRange(startDate, endDate, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting expenditure payments by payment date range:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments by payment date range: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 支払ステータスで支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments_by_payment_status',
  {
    payment_status_in: z.string().describe('支払ステータス（カンマ区切りの複数指定可）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      let statusValues: PaymentStatusValue[] = [];
      if (params.payment_status_in) {
        statusValues = params.payment_status_in.split(',').map(Number) as PaymentStatusValue[];
      }
      
      const payments = await boardSdk.expenditurePayments.getExpenditurePaymentsByPaymentStatus(statusValues, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting expenditure payments by payment status:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments by payment status: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 支出ステータスで支払一覧を取得するツール
server.tool(
  'get_board_expenditure_payments_by_expenditure_status',
  {
    expenditure_expenditure_status_in: z.string().describe('支出ステータス（カンマ区切りの複数指定可）'),
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      let statusValues: ExpenditureStatusValue[] = [];
      if (params.expenditure_expenditure_status_in) {
        statusValues = params.expenditure_expenditure_status_in.split(',').map(Number) as ExpenditureStatusValue[];
      }
      
      const payments = await boardSdk.expenditurePayments.getExpenditurePaymentsByExpenditureStatus(statusValues, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting expenditure payments by expenditure status:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting expenditure payments by expenditure status: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 請求書未受領の支払一覧を取得するツール
server.tool(
  'get_board_invoice_not_received_payments',
  {
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      const payments = await boardSdk.expenditurePayments.getInvoiceNotReceivedPayments(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoice not received payments:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoice not received payments: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 請求書受領済みの支払一覧を取得するツール
server.tool(
  'get_board_invoice_received_payments',
  {
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      const payments = await boardSdk.expenditurePayments.getInvoiceReceivedPayments(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting invoice received payments:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting invoice received payments: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 支払済みの支払一覧を取得するツール
server.tool(
  'get_board_paid_payments',
  {
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    response_group: z.enum(['small', 'medium', 'large', 'invoice', 'all']).optional().describe('レスポンスの詳細度')
  },
  async (params: ExpenditurePaymentParams) => {
    try {
      const payments = await boardSdk.expenditurePayments.getPaidPayments(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting paid payments:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting paid payments: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_payment_status',
  {
    paymentId: z.number().int().positive().describe('支払ID'),
    payment_status: z.number().int().positive().describe('新しい支払ステータス')
  },
  async ({ paymentId, payment_status }: { paymentId: number, payment_status: number }) => {
    try {
      const statusValue = payment_status as PaymentStatusValue;
      const payment = await boardSdk.expenditurePayments.updatePaymentStatus(paymentId, statusValue);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payment, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating status for payment ${paymentId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating status for payment ${paymentId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_payment_lock',
  {
    paymentId: z.number().int().positive().describe('支払ID'),
    lock_flg: z.union([z.literal(0), z.literal(1)]).describe('ロックフラグ（0: ロック解除, 1: ロック）')
  },
  async ({ paymentId, lock_flg }: { paymentId: number, lock_flg: 0 | 1 }) => {
    try {
      const payment = await boardSdk.expenditurePayments.updateLockStatus(paymentId, lock_flg);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payment, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating lock status for payment ${paymentId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating lock status for payment ${paymentId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

/**
 * @todo
 * boardのデータを取得するツールを追加する。
 * ツールは１API１ツールとして作成する。
 * ツールの追加は、boardSdk のメソッドを呼び出すようにする。
 * ツールのパラメーターは、boardSdk のメソッドのパラメーターをそのまま使用する。
 * ツールの戻り値は、boardSdk のメソッドの戻り値をそのまま使用する。
 * ツールの戻り値は、JSON 形式とする。
 */


// 顧客一覧を取得するツール
server.tool(
  'get_board_clients',
  {
    // ClientParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    include_archive_flg: z.boolean().optional().describe('アーカイブ済みの顧客を含めるかどうか'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async (params: ClientParams) => {
    try {
      const clients = await boardSdk.clients.getClients(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clients, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting clients:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting clients: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'get_board_client',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    responseGroup: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ clientId, responseGroup }: { clientId: number, responseGroup?: 'small' | 'medium' | 'large' }) => {
    try {
      const client = await boardSdk.clients.getClient(clientId, responseGroup);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'create_board_client',
  {
    // ClientCreateParamsに対応するzodスキーマ
    name: z.string().min(1).describe('顧客名'),
    name_kana: z.string().min(1).describe('顧客名（カナ）'),
    code: z.string().optional().describe('顧客コード'),
    short_name: z.string().min(1).describe('顧客略称'),
    zip: z.string().optional().describe('郵便番号'),
    address: z.string().optional().describe('住所'),
    tel: z.string().optional().describe('電話番号'),
    fax: z.string().optional().describe('FAX番号'),
    url: z.string().optional().describe('Webサイト'),
    industry_id: z.number().int().positive().optional().describe('業種ID'),
    memo: z.string().optional().describe('メモ')
  },
  async (data: ClientCreateParams) => {
    try {
      const client = await boardSdk.clients.createClient(data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error creating client:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error creating client: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_client',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    // ClientUpdateParamsに対応するzodスキーマ
    data: ClientUpdateParamsSchema.describe('更新データ')
  },
  async ({ clientId, data }: { clientId: number, data: ClientUpdateParams }) => {
    try {
      const client = await boardSdk.clients.updateClient(clientId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'delete_board_client',
  {
    clientId: z.number().int().positive().describe('顧客ID')
  },
  async ({ clientId }: { clientId: number }) => {
    try {
      await boardSdk.clients.deleteClient(clientId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Client with ID ${clientId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'archive_board_client',
  {
    clientId: z.number().int().positive().describe('顧客ID')
  },
  async ({ clientId }: { clientId: number }) => {
    try {
      const client = await boardSdk.clients.archiveClient(clientId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error archiving client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error archiving client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'unarchive_board_client',
  {
    clientId: z.number().int().positive().describe('顧客ID')
  },
  async ({ clientId }: { clientId: number }) => {
    try {
      const client = await boardSdk.clients.unarchiveClient(clientId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(client, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error unarchiving client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error unarchiving client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);


// 顧客支社一覧を取得するツール
server.tool(
  'get_board_client_branches',
  {
    // ClientBranchParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    include_archive_flg: z.boolean().optional().describe('アーカイブ済みの顧客支社を含めるかどうか'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async (params: ClientBranchParams) => {
    try {
      const clientBranches = await boardSdk.clientBranches.getClientBranches(params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranches, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error getting client branches:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting client branches: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'get_board_client_branch',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID'),
    responseGroup: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ clientBranchId, responseGroup }: { clientBranchId: number, responseGroup?: 'small' | 'medium' | 'large' }) => {
    try {
      const clientBranch = await boardSdk.clientBranches.getClientBranch(clientBranchId, responseGroup);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 顧客IDに紐づく顧客支社一覧を取得するツール
server.tool(
  'get_board_client_branches_by_client_id',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    // ClientBranchParamsに対応するzodスキーマ
    page: z.number().int().positive().optional().describe('ページ番号'),
    per_page: z.number().int().positive().optional().describe('1ページあたりの件数'),
    include_archive_flg: z.boolean().optional().describe('アーカイブ済みの顧客支社を含めるかどうか'),
    response_group: z.enum(['small', 'medium', 'large']).optional().describe('レスポンスの詳細度')
  },
  async ({ clientId, ...params }: { clientId: number } & ClientBranchParams) => {
    try {
      const clientBranches = await boardSdk.clientBranches.getClientBranchesByClientId(clientId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranches, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error getting client branches for client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting client branches for client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'create_board_client_branch',
  {
    // ClientBranchCreateParamsに対応するzodスキーマ
    client_id: z.number().int().positive().describe('顧客ID'),
    name: z.string().min(1).describe('顧客支社名'),
    code: z.string().optional().describe('顧客支社コード'),
    zip: z.string().optional().describe('郵便番号'),
    address: z.string().optional().describe('住所'),
    tel: z.string().optional().describe('電話番号'),
    fax: z.string().optional().describe('FAX番号'),
    url: z.string().optional().describe('Webサイト'),
    memo: z.string().optional().describe('メモ')
  },
  async (data: ClientBranchCreateParams) => {
    try {
      const clientBranch = await boardSdk.clientBranches.createClientBranch(data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error('Error creating client branch:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error creating client branch: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'create_board_client_branch_for_client',
  {
    clientId: z.number().int().positive().describe('顧客ID'),
    // ClientBranchCreateParamsからclient_idを除いたzodスキーマ
    name: z.string().min(1).describe('顧客支社名'),
    code: z.string().optional().describe('顧客支社コード'),
    zip: z.string().optional().describe('郵便番号'),
    address: z.string().optional().describe('住所'),
    tel: z.string().optional().describe('電話番号'),
    fax: z.string().optional().describe('FAX番号'),
    url: z.string().optional().describe('Webサイト'),
    memo: z.string().optional().describe('メモ')
  },
  async ({ clientId, ...data }: { clientId: number } & Omit<ClientBranchCreateParams, 'client_id'>) => {
    try {
      const clientBranch = await boardSdk.clientBranches.createClientBranchForClient(clientId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error creating client branch for client ${clientId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error creating client branch for client ${clientId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'update_board_client_branch',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID'),
    // ClientBranchUpdateParamsに対応するzodスキーマ
    data: ClientBranchUpdateParamsSchema.describe('更新データ')
  },
  async ({ clientBranchId, data }: { clientBranchId: number, data: ClientBranchUpdateParams }) => {
    try {
      const clientBranch = await boardSdk.clientBranches.updateClientBranch(clientBranchId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error updating client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'delete_board_client_branch',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID')
  },
  async ({ clientBranchId }: { clientBranchId: number }) => {
    try {
      await boardSdk.clientBranches.deleteClientBranch(clientBranchId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Client branch with ID ${clientBranchId} has been deleted` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error deleting client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error deleting client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'archive_board_client_branch',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID')
  },
  async ({ clientBranchId }: { clientBranchId: number }) => {
    try {
      const clientBranch = await boardSdk.clientBranches.archiveClientBranch(clientBranchId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error archiving client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error archiving client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

server.tool(
  'unarchive_board_client_branch',
  {
    clientBranchId: z.number().int().positive().describe('顧客支社ID')
  },
  async ({ clientBranchId }: { clientBranchId: number }) => {
    try {
      const clientBranch = await boardSdk.clientBranches.unarchiveClientBranch(clientBranchId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientBranch, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error unarchiving client branch ${clientBranchId}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error unarchiving client branch ${clientBranchId}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// サーバーの起動
const transport = new StdioServerTransport();
server.connect(transport).catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
})
