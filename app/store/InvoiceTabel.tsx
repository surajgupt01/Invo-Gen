import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Mode     = "india" | "international";
export type TxnType  = "intra" | "inter" | "export";

export interface TaxConfig {
  name: string;   // "VAT" | "Sales Tax" | "GST" | "IGST" | ...
  rate: string;   // numeric string e.g. "20"
}

export interface Currency {
  code:   string;
  symbol: string;
  locale: string;
}

export interface Item {
  description: string;
  hsn:         string;   // India only
  unit:        string;
  qty:         string;
  rate:        string;
  discount:    string;
  // India GST fields
  gstRate:     string;
  cgst:        string;
  sgst:        string;
  igst:        string;
  // International tax field
  taxAmt:      string;
  // Common
  amt:         string;
}

export interface ItemsStore {
  // ── Invoice config ──────────────────────────────────────────────────────────
  mode:       Mode;
  txnType:    TxnType;
  currency:   Currency;
  taxConfig:  TaxConfig;

  // ── Items + aggregates ──────────────────────────────────────────────────────
  Items:      Item[];
  subTotal:   number;
  totalCgst:  number;
  totalSgst:  number;
  totalIgst:  number;
  totalTax:   number;   // international tax total
  Total:      number;

  // ── Actions ─────────────────────────────────────────────────────────────────
  setMode:         (mode: Mode)                              => void;
  setTxnType:      (txnType: TxnType)                        => void;
  setCurrency:     (currency: Currency)                      => void;
  setTaxConfig:    (taxConfig: TaxConfig)                    => void;
  changeHandler:   (key: keyof Item, index: number, value: string) => void;
  addRow:          ()                                        => void;
  delRow:          (idx: number)                             => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const UNITS = ["pcs", "kg", "hr", "ltr", "mtr", "box", "set", "doz"];

export const GST_RATES = ["0", "5", "12", "18", "28"];

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",   locale: "en-US" },
  { code: "EUR", symbol: "€",   locale: "de-DE" },
  { code: "GBP", symbol: "£",   locale: "en-GB" },
  { code: "AUD", symbol: "A$",  locale: "en-AU" },
  { code: "CAD", symbol: "C$",  locale: "en-CA" },
  { code: "SGD", symbol: "S$",  locale: "en-SG" },
  { code: "AED", symbol: "AED", locale: "en-AE" },
  { code: "INR", symbol: "₹",   locale: "en-IN" },
];

export const TAX_PRESETS = [
  { label: "UK VAT 20%",      name: "VAT",       rate: "20" },
  { label: "EU VAT 19%",      name: "VAT",       rate: "19" },
  { label: "AU GST 10%",      name: "GST",       rate: "10" },
  { label: "SG GST 9%",       name: "GST",       rate: "9"  },
  { label: "UAE VAT 5%",      name: "VAT",       rate: "5"  },
  { label: "US Sales Tax 8%", name: "Sales Tax", rate: "8"  },
  { label: "CA HST 13%",      name: "HST",       rate: "13" },
  { label: "No tax / exempt", name: "Tax",       rate: "0"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const defaultItem = (): Item => ({
  description: "", hsn: "", unit: "pcs",
  qty: "", rate: "", discount: "0",
  gstRate: "18",
  cgst: "0.00", sgst: "0.00", igst: "0.00",
  taxAmt: "0.00", amt: "0.00",
});

/**
 * Pure function — computes all tax fields for a single item.
 * Called both inside the store and (if needed) in the component.
 */
export function calcItem(
  item:        Item,
  mode:        Mode,
  txnType:     TxnType,
  intlTaxRate: string,
): Item {
  const qty  = parseFloat(item.qty)      || 0;
  const rate = parseFloat(item.rate)     || 0;
  const disc = parseFloat(item.discount) || 0;
  const base = qty * rate * (1 - disc / 100);

  if (mode === "india") {
    const gst   = parseFloat(item.gstRate) || 0;
    const tax   = base * gst / 100;
    const noTax = txnType === "export";
    return {
      ...item,
      amt:    (base + (noTax ? 0 : tax)).toFixed(2),
      cgst:   txnType === "intra" ? (tax / 2).toFixed(2) : "0.00",
      sgst:   txnType === "intra" ? (tax / 2).toFixed(2) : "0.00",
      igst:   txnType === "inter" ? tax.toFixed(2)       : "0.00",
      taxAmt: "0.00",
    };
  } else {
    const taxRate = parseFloat(intlTaxRate) || 0;
    const tax     = base * taxRate / 100;
    return {
      ...item,
      amt:    (base + tax).toFixed(2),
      taxAmt: tax.toFixed(2),
      cgst: "0.00", sgst: "0.00", igst: "0.00",
    };
  }
}

/** Recompute all aggregate totals from a list of items. */
function computeTotals(items: Item[], mode: Mode, txnType: TxnType) {
  let subTotal  = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalTax  = 0;

  for (const it of items) {
    const qty  = parseFloat(it.qty)      || 0;
    const rate = parseFloat(it.rate)     || 0;
    const disc = parseFloat(it.discount) || 0;
    subTotal  += qty * rate * (1 - disc / 100);
    totalCgst += parseFloat(it.cgst)   || 0;
    totalSgst += parseFloat(it.sgst)   || 0;
    totalIgst += parseFloat(it.igst)   || 0;
    totalTax  += parseFloat(it.taxAmt) || 0;
  }

  let Total = subTotal;
  if (mode === "india") {
    if (txnType === "intra") Total += totalCgst + totalSgst;
    if (txnType === "inter") Total += totalIgst;
    // export: no tax added
  } else {
    Total += totalTax;
  }

  return { subTotal, totalCgst, totalSgst, totalIgst, totalTax, Total };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useItemsStore = create<ItemsStore>((set, get) => ({
  // ── Initial config ──────────────────────────────────────────────────────────
  mode:      "india",
  txnType:   "intra",
  currency:  CURRENCIES[0],
  taxConfig: { name: "VAT", rate: "20" },

  // ── Initial items + totals ──────────────────────────────────────────────────
  Items: [defaultItem()],
  subTotal:  0,
  totalCgst: 0,
  totalSgst: 0,
  totalIgst: 0,
  totalTax:  0,
  Total:     0,

  // ── Actions ─────────────────────────────────────────────────────────────────

  setMode: (mode) => {
    const { txnType, taxConfig, Items } = get();
    const updated = Items.map(item => calcItem(item, mode, txnType, taxConfig.rate));
    set({ mode, Items: updated, ...computeTotals(updated, mode, txnType) });
  },

  setTxnType: (txnType) => {
    const { mode, taxConfig, Items } = get();
    const updated = Items.map(item => calcItem(item, mode, txnType, taxConfig.rate));
    set({ txnType, Items: updated, ...computeTotals(updated, mode, txnType) });
  },

  setCurrency: (currency) => {
    set({ currency });
    // currency change doesn't affect amounts, only display formatting
  },

  setTaxConfig: (taxConfig) => {
    const { mode, txnType, Items } = get();
    const updated = Items.map(item => calcItem(item, mode, txnType, taxConfig.rate));
    set({ taxConfig, Items: updated, ...computeTotals(updated, mode, txnType) });
  },

  changeHandler: (key, index, value) => {
    const { mode, txnType, taxConfig, Items } = get();
    const updated = Items.map((item, i) => {
      if (i !== index) return item;
      return calcItem({ ...item, [key]: value }, mode, txnType, taxConfig.rate);
    });
    set({ Items: updated, ...computeTotals(updated, mode, txnType) });
  },

  addRow: () => {
    const { mode, txnType, taxConfig, Items } = get();
    const updated = [...Items, calcItem(defaultItem(), mode, txnType, taxConfig.rate)];
    set({ Items: updated, ...computeTotals(updated, mode, txnType) });
  },

  delRow: (idx) => {
    const { mode, txnType, Items } = get();
    const updated = Items.filter((_, i) => i !== idx);
    set({ Items: updated, ...computeTotals(updated, mode, txnType) });
  },
}));