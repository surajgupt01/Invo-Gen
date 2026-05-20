import type {
  Currency,
  Item,
  Mode,
  TaxConfig,
  TxnType,
} from "../store/InvoiceTabel";

const Items: Item[] = [
  {
    description: "Brand Identity Design",
    hsn: "998391",
    unit: "set",
    qty: "1",
    rate: "18000",
    discount: "0",
    gstRate: "18",
    cgst: "1620.00",
    sgst: "1620.00",
    igst: "0.00",
    taxAmt: "0.00",
    amt: "21240.00",
  },
  {
    description: "Landing Page Development",
    hsn: "998314",
    unit: "hr",
    qty: "24",
    rate: "1250",
    discount: "10",
    gstRate: "18",
    cgst: "2430.00",
    sgst: "2430.00",
    igst: "0.00",
    taxAmt: "0.00",
    amt: "31860.00",
  },
  {
    description: "Monthly Support Retainer",
    hsn: "998313",
    unit: "mo",
    qty: "1",
    rate: "7500",
    discount: "0",
    gstRate: "18",
    cgst: "675.00",
    sgst: "675.00",
    igst: "0.00",
    taxAmt: "0.00",
    amt: "8850.00",
  },
];

const subTotal = 52500;
const totalCgst = 4725;
const totalSgst = 4725;
const totalIgst = 0;
const totalTax = 0;
const Total = 61950;
const mode: Mode = "india";
const txnType: TxnType = "intra";
const taxConfig: TaxConfig = { name: "GST", rate: "18" };
const currency: Currency = { code: "INR", symbol: "Rs.", locale: "en-IN" };

const Details = {
  CustomerName: "Acme Studios Pvt. Ltd.",
  CustomerAddress: "42 Park Street\nBengaluru, Karnataka 560001",
  DueDate: "2026-06-15",
  IssueDate: "2026-05-21",
  InvoiceNo: "2026-0018",
  Currency: "INR Rs.",
  Subject: "Creative design and web development services",
};

const OwnerDetails = {
  CompanyName: "Northstar Creative",
  CompanyAddress: "18 Residency Road, Bengaluru, Karnataka 560025",
  TaxDetail: "29AABCN1234L1Z5",
  CompanyMail: "billing@northstar.example",
  OwnerName: "Northstar Creative LLP",
  PhNo: "+91 98765 43210",
  AccountNumber: "123456789012",
  BankName: "HDFC Bank",
  BankCode: "HDFC0001234",
  BankAddress: "MG Road Branch, Bengaluru",
  paymentMethod: "Bank",
  QR: "",
  UPIID: "northstar@upi",
  companyLogo: "",
};

const AdditionalInfo =
  "Thank you for choosing Northstar Creative. This sample invoice is shown for template preview only.";

const TermsConditions =
  "Payment is due within 15 days. Please mention the invoice number while making the transfer.";

type SampleInvoiceData = {
  Items: Item[];
  Total: number;
  subTotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  mode: Mode;
  txnType: TxnType;
  taxConfig: TaxConfig;
  currency: Currency;
  Details: typeof Details;
  AdditionalInfo: string;
  TermsConditions: string;
  OwnerDetails: typeof OwnerDetails;
};

export const sampleInvoiceData: SampleInvoiceData = {
  Items,
  Total,
  subTotal,
  totalCgst,
  totalSgst,
  totalIgst,
  totalTax,
  mode,
  txnType,
  taxConfig,
  currency,
  Details,
  AdditionalInfo,
  TermsConditions,
  OwnerDetails,
};

export const sampleInvoicePdfData = {
  items: Items,
  total: Total,
  subTotal,
  totalCgst,
  totalSgst,
  totalIgst,
  totalTax,
  mode,
  txnType,
  taxConfig,
  currency,
  details: Details,
  ownerDetails: OwnerDetails,
  additionalInfo: AdditionalInfo,
  termsConditions: TermsConditions,
};
