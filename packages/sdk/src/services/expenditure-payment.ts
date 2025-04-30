import { BoardApiClient } from '../client.js';
import type { 
  ExpenditurePayment,
  ExpenditurePaymentParams, 
  ListResponse, 
  PaymentStatusUpdateParams,
  PaymentLockUpdateParams,
  PaymentStatusValue,
  ExpenditureStatusValue
} from '../types.js';
import { PaymentStatus } from '../types.js';

export class ExpenditurePaymentService {
  private client: BoardApiClient;

  constructor(client: BoardApiClient) {
    this.client = client;
  }

  /**
   * 支払リストを取得します
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getExpenditurePayments(params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    return this.client.request<ListResponse<ExpenditurePayment>>('/expenditure_payments', 'GET', undefined, params as Record<string, string | number | boolean> | undefined);
  }

  /**
   * 発注IDに紐づく支払リストを取得します
   * @param expenditureId 発注ID
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getExpenditurePaymentsByExpenditureId(expenditureId: number, params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    const queryParams = { ...(params || {}), expenditure_id: expenditureId };
    return this.client.request<ListResponse<ExpenditurePayment>>(
      '/expenditure_payments',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 請求日の範囲内の支払リストを取得します
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 支払リスト
   */
  async getExpenditurePaymentsByInvoiceDateRange(startDate: string, endDate: string, params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    const queryParams = {
      ...(params || {}),
      invoice_date_gteq: startDate,
      invoice_date_lteq: endDate
    };
    return this.client.request<ListResponse<ExpenditurePayment>>(
      '/expenditure_payments',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 支払期限の範囲内の支払リストを取得します
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 支払リスト
   */
  async getExpenditurePaymentsByPaymentDateRange(startDate: string, endDate: string, params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    const queryParams = {
      ...(params || {}),
      payment_date_gteq: startDate,
      payment_date_lteq: endDate
    };
    return this.client.request<ListResponse<ExpenditurePayment>>(
      '/expenditure_payments',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 指定された支払ステータスの支払リストを取得します
   * @param statusValues 支払ステータス配列
   * @param params その他の検索パラメータ
   * @returns 支払リスト
   * @example
   * ```ts
   * // 請求書受領済と支払済みの支払を取得
   * client.expenditurePayments.getExpenditurePaymentsByPaymentStatus([PaymentStatus.INVOICE_RECEIVED, PaymentStatus.PAID]);
   * ```
   */
  async getExpenditurePaymentsByPaymentStatus(statusValues: PaymentStatusValue[], params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    const queryParams = {
      ...(params || {}),
      payment_status_in: statusValues.join(',')
    };
    return this.client.request<ListResponse<ExpenditurePayment>>(
      '/expenditure_payments',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 指定された発注ステータスの支払リストを取得します
   * @param statusValues 発注ステータス配列
   * @param params その他の検索パラメータ
   * @returns 支払リスト
   * @example
   * ```ts
   * // 発注確定と発注済みの支払を取得
   * client.expenditurePayments.getExpenditurePaymentsByExpenditureStatus([ExpenditureStatus.ORDER_CONFIRMED, ExpenditureStatus.ORDERED]);
   * ```
   */
  async getExpenditurePaymentsByExpenditureStatus(statusValues: ExpenditureStatusValue[], params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    const queryParams = {
      ...(params || {}),
      expenditure_expenditure_status_in: statusValues.join(',')
    };
    return this.client.request<ListResponse<ExpenditurePayment>>(
      '/expenditure_payments',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 請求書未受領の支払リストを取得します
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getInvoiceNotReceivedPayments(params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    return this.getExpenditurePaymentsByPaymentStatus([PaymentStatus.INVOICE_NOT_RECEIVED], params);
  }

  /**
   * 請求書受領済みの支払リストを取得します
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getInvoiceReceivedPayments(params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    return this.getExpenditurePaymentsByPaymentStatus([PaymentStatus.INVOICE_RECEIVED], params);
  }

  /**
   * 支払済みの支払リストを取得します
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getPaidPayments(params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    return this.getExpenditurePaymentsByPaymentStatus([PaymentStatus.PAID], params);
  }

  /**
   * 振込予約済みの支払リストを取得します
   * @param params 検索パラメータ
   * @returns 支払リスト
   */
  async getTransferReservedPayments(params?: ExpenditurePaymentParams): Promise<ListResponse<ExpenditurePayment>> {
    return this.getExpenditurePaymentsByPaymentStatus([PaymentStatus.TRANSFER_RESERVED], params);
  }

  /**
   * 支払ステータスを更新します
   * @param id 支払ID
   * @param status 新しい支払ステータス値
   * @returns void
   * @example
   * ```ts
   * // 支払ステータスを支払済みに更新
   * client.expenditurePayments.updatePaymentStatus(123456, PaymentStatus.PAID);
   * ```
   */
  async updatePaymentStatus(id: number, status: PaymentStatusValue): Promise<void> {
    const data: PaymentStatusUpdateParams = {
      payment_status: status
    };
    return this.client.request<void>(`/expenditure_payments/payment_status/${id}`, 'PATCH', data);
  }

  /**
   * 支払のロック状態を更新します
   * @param id 支払ID
   * @param lockFlg ロックフラグ（0: 未ロック, 1: ロック済み）
   * @returns void
   * @example
   * ```ts
   * // 支払をロックする
   * client.expenditurePayments.updateLockStatus(123456, 1);
   * ```
   */
  async updateLockStatus(id: number, lockFlg: 0 | 1): Promise<void> {
    const data: PaymentLockUpdateParams = {
      lock_flg: lockFlg
    };
    return this.client.request<void>(`/expenditure_payments/lock_flg/${id}`, 'PATCH', data);
  }
} 