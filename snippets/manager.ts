// Own implementation the the lnpay api


export class BaseSeviLnPay {
  private VERSION = "js0.1.0";

  constructor(public publicApiKey: string, public endpointUrl = "https://lnpay.co/v1/") {

  }

  protected async processGetRequest(path: string) {
    const response = await window.fetch(this.endpointUrl + path, {
      method: "GET",
      headers: {
        "X-Api-Key": this.publicApiKey,
        "X-LNPay-sdk": this.VERSION,
      },
    });
    return response.json();
  }
  protected async processPostRequest(path: string, dataObject: any) {
    const response = await window.fetch(this.endpointUrl + path, {
      method: "POST",
      body: JSON.stringify(dataObject),
      headers: {
        "X-Api-Key": this.publicApiKey,
        "Content-Type": "application/json",
        "X-LNPay-sdk": this.VERSION,
      },
    });
    return response.json();
  }
}

export class SeviLnpayWallet extends BaseSeviLnPay {
  constructor(publicApiKey: string, public accessKey: string) {
    super(publicApiKey);
  }

  /**
   * @see https://docs.lnpay.co/wallet/get-balance
   */
  async getInfo() {
    return this.processGetRequest("wallet/" + this.accessKey);
  }

  /**
   * @see https://docs.lnpay.co/wallet/get-transactions
   */
  async getTransactions() {
    return this.processGetRequest("wallet/" + this.accessKey + "/transactions");
  }

  /**
   * @see https://docs.lnpay.co/wallet/generate-invoice
   * @param params {"num_satoshis":1,"memo":"Test Memo"}
   */
  async createInvoice(params) {
    return this.processPostRequest(
      "wallet/" + this.accessKey + "/invoice",
      params
    );
  }

  /**
   * @see https://docs.lnpay.co/wallet/pay-invoice
   * @param params {"payment_request":"lnbc11111..."}
   */
  async payInvoice(params) {
    return this.processPostRequest(
      "wallet/" + this.accessKey + "/withdraw",
      params
    );
  }

  /**
   * @see https://docs.lnpay.co/wallet/transfers-between-wallets
   * @param params {"dest_wallet_id":"w_xxx","num_satoshis":1,...} note: wallet_id OR a wallet access key (WAK)
   */
  async internalTransfer(params) {
    return this.processPostRequest(
      "wallet/" + this.accessKey + "/transfer",
      params
    );
  }

  /**
   * @see https://docs.lnpay.co/wallet/lnurl-withdraw
   * @param params {"num_satoshis":2"}
   */
  async getLnurl(params) {
    return this.processGetRequest(
      "wallet/" +
        this.accessKey +
        "/lnurl/withdraw?num_satoshis=" +
        params.num_satoshis
    );
  }

  async getTransactionInfo(transactionId: string) {
    return this.processGetRequest('lntx/' + transactionId);
  }
}
