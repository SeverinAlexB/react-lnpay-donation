import { SeviLnpayWallet } from "./manager";

const publicApiKey = ""; // Public api key
const invoiceWalletKey = ''; // Invoice api. Make sure this key the invoice key and not any secret or admin key.

export const defaultWallet = new SeviLnpayWallet(publicApiKey, invoiceWalletKey);