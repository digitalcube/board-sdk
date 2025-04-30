import { BoardApiClient } from './client.js';
import type { BoardApiConfig } from './client.js';
import { ClientService } from './services/client.js';
import { ClientBranchService } from './services/client-branch.js';
import { ProjectService } from './services/project.js';
import { InvoiceService } from './services/invoice.js';
import { ExpenditurePaymentService } from './services/expenditure-payment.js';

export type * from './types.js';
export { BoardApiClient } from './client.js';
export type { BoardApiConfig } from './client.js';

/**
 * Board API SDK
 */
export class BoardApiSdk {
  private client: BoardApiClient;
  
  /**
   * 顧客関連API
   */
  public readonly clients: ClientService;
  
  /**
   * 顧客支社関連API
   */
  public readonly clientBranches: ClientBranchService;
  
  /**
   * 案件関連API
   */
  public readonly projects: ProjectService;

  /**
   * 請求関連API
   */
  public readonly invoices: InvoiceService;

  /**
   * 支払関連API
   */
  public readonly expenditurePayments: ExpenditurePaymentService;

  /**
   * Board API SDKを初期化します
   * @param config API設定
   */
  constructor(config: BoardApiConfig) {
    this.client = new BoardApiClient(config);
    
    // 各サービスの初期化
    this.clients = new ClientService(this.client);
    this.clientBranches = new ClientBranchService(this.client);
    this.projects = new ProjectService(this.client);
    this.invoices = new InvoiceService(this.client);
    this.expenditurePayments = new ExpenditurePaymentService(this.client);
  }
}
