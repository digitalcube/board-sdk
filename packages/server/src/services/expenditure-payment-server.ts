import { z } from 'zod';
import { BoardApiSdk } from '@digitalcube/board-sdk';
import type { 
  ExpenditurePayment, 
  ExpenditurePaymentParams, 
  PaymentStatusValue, 
  ExpenditureStatusValue, 
  ListResponse 
} from '@digitalcube/board-sdk';
import { 
  ExpenditurePaymentParamsSchema, 
  PaymentStatusUpdateParamsSchema, 
  PaymentLockUpdateParamsSchema, 
  ApiResponse 
} from '../types.js';

/**
 * 支払関連のサーバーAPI実装
 */
export class ExpenditurePaymentServerService {
  private sdk: BoardApiSdk;

  /**
   * ExpenditurePaymentServerServiceを初期化します
   * @param sdk BoardApiSdkインスタンス
   */
  constructor(sdk: BoardApiSdk) {
    this.sdk = sdk;
  }

  /**
   * 支払一覧を取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getExpenditurePayments(params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getExpenditurePayments(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error('Error getting expenditure payments:', error);
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
   * 支払日の範囲内の支払一覧を取得するエンドポイント
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getExpenditurePaymentsByPaymentDateRange(startDate: unknown, endDate: unknown, params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedStartDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(startDate);
      const validatedEndDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(endDate);
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getExpenditurePaymentsByPaymentDateRange(
        validatedStartDate, 
        validatedEndDate, 
        validatedParams
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error(`Error getting expenditure payments for payment date range ${startDate} to ${endDate}:`, error);
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
   * 請求日の範囲内の支払一覧を取得するエンドポイント
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getExpenditurePaymentsByInvoiceDateRange(startDate: unknown, endDate: unknown, params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedStartDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(startDate);
      const validatedEndDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(endDate);
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getExpenditurePaymentsByInvoiceDateRange(
        validatedStartDate, 
        validatedEndDate, 
        validatedParams
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error(`Error getting expenditure payments for invoice date range ${startDate} to ${endDate}:`, error);
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
   * 指定された支払ステータスの支払一覧を取得するエンドポイント
   * @param statusValues 支払ステータス配列
   * @param params その他の検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getExpenditurePaymentsByPaymentStatus(statusValues: unknown, params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedStatusValues = z.array(z.number().int().positive()).parse(statusValues);
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getExpenditurePaymentsByPaymentStatus(
        validatedStatusValues as PaymentStatusValue[], 
        validatedParams
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error(`Error getting expenditure payments by payment status:`, error);
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
   * 指定された経費ステータスの支払一覧を取得するエンドポイント
   * @param statusValues 経費ステータス配列
   * @param params その他の検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getExpenditurePaymentsByExpenditureStatus(statusValues: unknown, params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedStatusValues = z.array(z.number().int().positive()).parse(statusValues);
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getExpenditurePaymentsByExpenditureStatus(
        validatedStatusValues as ExpenditureStatusValue[], 
        validatedParams
      );
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error(`Error getting expenditure payments by expenditure status:`, error);
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
   * 未払いの支払一覧を取得するエンドポイント
   * @param params 検索パラメータ
   * @returns 支払一覧レスポンス
   */
  async getUnpaidExpenditurePayments(params?: unknown): Promise<ApiResponse<ListResponse<ExpenditurePayment>>> {
    try {
      const validatedParams = params 
        ? ExpenditurePaymentParamsSchema.parse(params) 
        : undefined;
      
      const payments = await this.sdk.expenditurePayments.getUnpaidExpenditurePayments(validatedParams);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(payments, null, 2)
          }
        ],
        data: payments
      };
    } catch (error) {
      console.error('Error getting unpaid expenditure payments:', error);
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
   * 支払ステータスを更新するエンドポイント
   * @param id 支払ID
   * @param status 新しい支払ステータス値
   * @returns 更新結果レスポンス
   */
  async updatePaymentStatus(id: unknown, status: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedStatus = z.number().int().positive().parse(status);
      
      await this.sdk.expenditurePayments.updatePaymentStatus(validatedId, validatedStatus as PaymentStatusValue);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Payment status for ID ${validatedId} has been updated to ${validatedStatus}` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating payment status ${id}:`, error);
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
   * 支払ロック状態を更新するエンドポイント
   * @param id 支払ID
   * @param lockFlg ロックフラグ（0: ロック解除, 1: ロック）
   * @returns 更新結果レスポンス
   */
  async updatePaymentLock(id: unknown, lockFlg: unknown): Promise<ApiResponse<void>> {
    try {
      const validatedId = z.number().int().positive().parse(id);
      const validatedLockFlg = z.number().int().min(0).max(1).parse(lockFlg);
      
      await this.sdk.expenditurePayments.updatePaymentLock(validatedId, validatedLockFlg);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              success: true, 
              message: `Payment lock for ID ${validatedId} has been ${validatedLockFlg === 1 ? 'locked' : 'unlocked'}` 
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`Error updating payment lock ${id}:`, error);
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
