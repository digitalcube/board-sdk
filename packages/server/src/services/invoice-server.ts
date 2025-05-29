import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import type { Invoice, InvoiceParams, InvoiceStatusValue, OrderStatusValue, ListResponse } from '@digitalcube/board-sdk';
import { InvoiceParamsSchema, InvoiceStatusUpdateParamsSchema, ApiResponse } from '../types.js';

/**
 * 請求関連のサーバーAPI実装
 */
export class InvoiceServerService {
  private sdk: BoardApiSdk;

  /**
   * InvoiceServerServiceを初期化します
   * @param sdk BoardApiSdkインスタンス
   */
  constructor(sdk: BoardApiSdk) {
    this.sdk = sdk;
  }

  /**
   * 請求リストを取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoices(params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoices(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error('Error getting invoices:', error);
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
   * プロジェクトIDに紐づく請求リストを取得するエンドポイント
   * @param projectId プロジェクトID
   * @param params 検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoicesByProjectId(projectId: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedProjectId = z.number().int().positive().parse(projectId);
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoicesByProjectId(validatedProjectId, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error(`Error getting invoices for project ${projectId}:`, error);
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
   * 請求日の範囲内の請求リストを取得するエンドポイント
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoicesByDateRange(startDate: unknown, endDate: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedStartDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(startDate);
      const validatedEndDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(endDate);
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoicesByDateRange(validatedStartDate, validatedEndDate, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error(`Error getting invoices for date range ${startDate} to ${endDate}:`, error);
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
   * 支払期限の範囲内の請求リストを取得するエンドポイント
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoicesByPaymentLimitDateRange(startDate: unknown, endDate: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedStartDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(startDate);
      const validatedEndDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(endDate);
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoicesByPaymentLimitDateRange(validatedStartDate, validatedEndDate, validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error(`Error getting invoices for payment limit date range ${startDate} to ${endDate}:`, error);
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
   * 指定された請求ステータスの請求リストを取得するエンドポイント
   * @param statusValues 請求ステータス配列
   * @param params その他の検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoicesByStatus(statusValues: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedStatusValues = z.array(z.number().int().positive()).parse(statusValues);
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoicesByStatus(validatedStatusValues as InvoiceStatusValue[], validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error(`Error getting invoices by status:`, error);
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
   * 指定された受注ステータスの請求リストを取得するエンドポイント
   * @param statusValues 受注ステータス配列
   * @param params その他の検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getInvoicesByOrderStatus(statusValues: unknown, params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedStatusValues = z.array(z.number().int().positive()).parse(statusValues);
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getInvoicesByOrderStatus(validatedStatusValues as OrderStatusValue[], validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error(`Error getting invoices by order status:`, error);
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
   * 未請求の請求リストを取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 請求リストレスポンス
   */
  async getUnpaidInvoices(params?: unknown): Promise<ApiResponse<ListResponse<Invoice>>> {
    try {
      const validatedParams = params 
        ? InvoiceParamsSchema.parse(params) 
        : undefined;
      
      const invoices = await this.sdk.invoices.getUnpaidInvoices(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(invoices, null, 2)
          }
        ],
        data: invoices
      };
    } catch (error) {
      console.error('Error getting unpaid invoices:', error);
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
   * 請求ステータスを更新するエンドポイント
   * @param id 請求ID
   * @param status 新しい請求ステータス値
   * @returns 更新結果レスポンス
   */
  async updateInvoiceStatus(id: unknown, status: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedStatus = z.number().int().positive().parse(status);
      
      await this.sdk.invoices.updateInvoiceStatus(validatedId, validatedStatus as InvoiceStatusValue);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Invoice status for ID ${validatedId} has been updated to ${validatedStatus}` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating invoice status ${id}:`, error);
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
