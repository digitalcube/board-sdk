import { BoardApiClient } from '../client.js';
import type { 
  Invoice, 
  InvoiceParams, 
  ListResponse, 
  InvoiceStatusUpdateParams,
  InvoiceStatusValue,
  OrderStatusValue
} from '../types.js';
import { InvoiceStatus } from '../types.js';

export class InvoiceService {
  private client: BoardApiClient;

  constructor(client: BoardApiClient) {
    this.client = client;
  }

  /**
   * 請求リストを取得します
   * @param params 検索パラメータ
   * @returns 請求リスト
   */
  async getInvoices(params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    return this.client.request<ListResponse<Invoice>>('/invoices', 'GET', undefined, params as Record<string, string | number | boolean> | undefined);
  }

  /**
   * プロジェクトIDに紐づく請求リストを取得します
   * @param projectId プロジェクトID
   * @param params 検索パラメータ
   * @returns 請求リスト
   */
  async getInvoicesByProjectId(projectId: number, params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    const queryParams = { ...(params || {}), project_id: projectId };
    return this.client.request<ListResponse<Invoice>>(
      '/invoices',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 請求日の範囲内の請求リストを取得します
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 請求リスト
   */
  async getInvoicesByDateRange(startDate: string, endDate: string, params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    const queryParams = {
      ...(params || {}),
      invoice_date_gteq: startDate,
      invoice_date_lteq: endDate
    };
    return this.client.request<ListResponse<Invoice>>(
      '/invoices',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 支払期限の範囲内の請求リストを取得します
   * @param startDate 開始日（YYYY-MM-DD形式）
   * @param endDate 終了日（YYYY-MM-DD形式）
   * @param params その他の検索パラメータ
   * @returns 請求リスト
   */
  async getInvoicesByPaymentLimitDateRange(startDate: string, endDate: string, params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    const queryParams = {
      ...(params || {}),
      invoice_payment_limit_date_gteq: startDate,
      invoice_payment_limit_date_lteq: endDate
    };
    return this.client.request<ListResponse<Invoice>>(
      '/invoices',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 指定された請求ステータスの請求リストを取得します
   * @param statusValues 請求ステータス配列
   * @param params その他の検索パラメータ
   * @returns 請求リスト
   * @example
   * ```ts
   * // 請求済みと入金済みの請求を取得
   * client.invoices.getInvoicesByStatus([InvoiceStatus.BILLED, InvoiceStatus.PAID]);
   * ```
   */
  async getInvoicesByStatus(statusValues: InvoiceStatusValue[], params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    const queryParams = {
      ...(params || {}),
      invoice_status_in: statusValues.join(',')
    };
    return this.client.request<ListResponse<Invoice>>(
      '/invoices',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 指定された受注ステータスの請求リストを取得します
   * @param statusValues 受注ステータス配列
   * @param params その他の検索パラメータ
   * @returns 請求リスト
   * @example
   * ```ts
   * // 受注確定と受注済みの請求を取得
   * client.invoices.getInvoicesByOrderStatus([OrderStatus.ORDER_CONFIRMED, OrderStatus.ORDERED]);
   * ```
   */
  async getInvoicesByOrderStatus(statusValues: OrderStatusValue[], params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    const queryParams = {
      ...(params || {}),
      project_order_status_in: statusValues.join(',')
    };
    return this.client.request<ListResponse<Invoice>>(
      '/invoices',
      'GET',
      undefined,
      queryParams as Record<string, string | number | boolean>
    );
  }

  /**
   * 未請求の請求リストを取得します
   * @param params 検索パラメータ
   * @returns 請求リスト
   */
  async getUnpaidInvoices(params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    return this.getInvoicesByStatus([InvoiceStatus.UNPAID], params);
  }

  /**
   * 請求済みの請求リストを取得します
   * @param params 検索パラメータ
   * @returns 請求リスト
   */
  async getBilledInvoices(params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    return this.getInvoicesByStatus([InvoiceStatus.BILLED], params);
  }

  /**
   * 入金済みの請求リストを取得します
   * @param params 検索パラメータ
   * @returns 請求リスト
   */
  async getPaidInvoices(params?: InvoiceParams): Promise<ListResponse<Invoice>> {
    return this.getInvoicesByStatus([InvoiceStatus.PAID], params);
  }

  /**
   * 請求ステータスを更新します
   * @param id 請求ID
   * @param status 新しい請求ステータス値
   * @returns void
   * @example
   * ```ts
   * // 請求ステータスを請求済みに更新
   * client.invoices.updateInvoiceStatus(123456, InvoiceStatus.BILLED);
   * ```
   */
  async updateInvoiceStatus(id: number, status: InvoiceStatusValue): Promise<void> {
    const data: InvoiceStatusUpdateParams = {
      invoice_status: status
    };
    return this.client.request<void>(`/invoices/invoice_status/${id}`, 'PATCH', data);
  }
} 