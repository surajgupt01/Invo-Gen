import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {
  Currency,
  Item,
  Mode,
  TaxConfig,
  TxnType,
} from "../store/InvoiceTabel";
import { sampleInvoicePdfData } from "./sampleInvoiceData";

type CustomerDetails = {
  CustomerName: string;
  CustomerAddress: string;
  DueDate: string;
  IssueDate: string;
  InvoiceNo: string;
  Currency: string;
  Subject: string;
};

type OwnerDetails = {
  CompanyName: string;
  CompanyAddress: string;
  TaxDetail: string;
  CompanyMail: string;
  OwnerName: string;
  PhNo: string;
  AccountNumber: string;
  BankName: string;
  BankCode: string;
  BankAddress: string;
  paymentMethod: string;
  QR: string;
  UPIID: string;
  companyLogo: string;
};

export type InvoicePdfData = {
  items: Item[];
  total: number;
  subTotal: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  mode: Mode;
  txnType: TxnType;
  taxConfig: TaxConfig;
  currency: Currency;
  details: CustomerDetails;
  ownerDetails: OwnerDetails;
  additionalInfo: string;
  termsConditions: string;
};

type InvoicePdfDocumentProps = {
  data?: InvoicePdfData;
  templateName: string;
};

type TemplateKind = "classic" | "modern" | "regular" | "trendy" | "sassy" | "free";

const templateKinds = new Set(["classic", "modern", "regular", "trendy", "sassy", "free"]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#111827",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 36,
  },
  pageNoPad: {
    backgroundColor: "#ffffff",
    color: "#111827",
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 0,
  },
  row: {
    flexDirection: "row",
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
  },
  right: {
    textAlign: "right",
  },
  muted: {
    color: "#64748b",
    lineHeight: 1.45,
  },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#94a3b8",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  logoBox: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 52,
    height: 52,
    objectFit: "contain",
  },
  table: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tablePlain: {
    marginTop: 24,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    minHeight: 30,
  },
  th: {
    padding: 7,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  td: {
    padding: 7,
    fontSize: 8,
    lineHeight: 1.35,
  },
  descCol: {
    flex: 2.3,
  },
  smallCol: {
    flex: 0.65,
  },
  moneyCol: {
    flex: 0.95,
  },
  totalsWrap: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  totals: {
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    gap: 24,
  },
  qr: {
    width: 68,
    height: 68,
    objectFit: "contain",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 4,
  },
});

function fmtNum(n: string | number, locale: string): string {
  return (parseFloat(String(n || "0")) || 0).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function isImageSrc(src: string) {
  return src.startsWith("data:image/") || src.startsWith("http://") || src.startsWith("https://");
}

function getKind(templateName: string): TemplateKind {
  return templateKinds.has(templateName) ? (templateName as TemplateKind) : "classic";
}

function useInvoiceFormat(data: InvoicePdfData) {
  const sym = data.mode === "india" ? "Rs. " : data.currency.symbol;
  const locale = data.mode === "india" ? "en-IN" : data.currency.locale;
  return (n: string | number) => `${sym}${fmtNum(n, locale)}`;
}

function LogoMark({
  owner,
  accent,
  dark = false,
}: {
  owner: OwnerDetails;
  accent: string;
  dark?: boolean;
}) {
  return (
    <View style={[styles.logoBox, { borderColor: accent, backgroundColor: dark ? "#111827" : "#ffffff" }]}>
      {owner.companyLogo && isImageSrc(owner.companyLogo) ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image src={owner.companyLogo} style={styles.logo} />
      ) : (
        <Text style={{ color: accent, fontSize: 23, fontFamily: "Helvetica-Bold" }}>
          {(owner.CompanyName || "I").charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

function TaxLabels(data: InvoicePdfData) {
  if (data.mode === "india" && data.txnType === "intra") return ["CGST", "SGST"];
  if (data.mode === "india" && data.txnType === "inter") return ["IGST"];
  if (data.mode === "india") return ["Tax"];
  return [data.taxConfig.name || "Tax"];
}

function ItemsTable({
  data,
  accent,
  headerDark = false,
  boxed = true,
  minimal = false,
}: {
  data: InvoicePdfData;
  accent: string;
  headerDark?: boolean;
  boxed?: boolean;
  minimal?: boolean;
}) {
  const fmt = useInvoiceFormat(data);
  const labels = TaxLabels(data);
  const headerColor = headerDark ? "#ffffff" : "#111827";
  const headerBg = headerDark ? "#0f172a" : minimal ? "#ffffff" : "#f8fafc";

  return (
    <View style={boxed ? styles.table : styles.tablePlain}>
      <View
        style={[
          styles.tableHeader,
          {
            backgroundColor: headerBg,
            borderBottomColor: headerDark ? "#0f172a" : accent,
            borderBottomWidth: minimal ? 2 : 1,
          },
        ]}
      >
        <Text style={[styles.th, styles.descCol, { color: headerColor }]}>Description</Text>
        {data.mode === "india" ? (
          <Text style={[styles.th, styles.smallCol, styles.center, { color: headerColor }]}>HSN</Text>
        ) : null}
        <Text style={[styles.th, styles.smallCol, styles.center, { color: headerColor }]}>Qty</Text>
        <Text style={[styles.th, styles.moneyCol, styles.right, { color: headerColor }]}>Rate</Text>
        {labels.map((label) => (
          <Text key={label} style={[styles.th, styles.moneyCol, styles.right, { color: headerColor }]}>
            {label}
          </Text>
        ))}
        <Text style={[styles.th, styles.moneyCol, styles.right, { color: headerColor }]}>Amount</Text>
      </View>

      {data.items.map((item, idx) => (
        <View key={`${item.description}-${idx}`} style={styles.tableRow} wrap={false}>
          <Text style={[styles.td, styles.descCol]}>
            {item.description || `Item ${idx + 1}`}
          </Text>
          {data.mode === "india" ? (
            <Text style={[styles.td, styles.smallCol, styles.center]}>{item.hsn || "-"}</Text>
          ) : null}
          <Text style={[styles.td, styles.smallCol, styles.center]}>
            {item.qty || "0"} {item.unit}
          </Text>
          <Text style={[styles.td, styles.moneyCol, styles.right]}>{fmt(item.rate)}</Text>
          {data.mode === "india" && data.txnType === "intra" ? (
            <>
              <Text style={[styles.td, styles.moneyCol, styles.right, { color: accent }]}>{fmt(item.cgst)}</Text>
              <Text style={[styles.td, styles.moneyCol, styles.right, { color: accent }]}>{fmt(item.sgst)}</Text>
            </>
          ) : null}
          {data.mode === "india" && data.txnType === "inter" ? (
            <Text style={[styles.td, styles.moneyCol, styles.right, { color: accent }]}>{fmt(item.igst)}</Text>
          ) : null}
          {data.mode === "india" && data.txnType === "export" ? (
            <Text style={[styles.td, styles.moneyCol, styles.right]}>Exempt</Text>
          ) : null}
          {data.mode === "international" ? (
            <Text style={[styles.td, styles.moneyCol, styles.right, { color: accent }]}>
              {parseFloat(data.taxConfig.rate) > 0 ? fmt(item.taxAmt) : "Exempt"}
            </Text>
          ) : null}
          <Text style={[styles.td, styles.moneyCol, styles.right, styles.bold]}>{fmt(item.amt)}</Text>
        </View>
      ))}
    </View>
  );
}

function PaymentBlock({ data, accent }: { data: InvoicePdfData; accent: string }) {
  const owner = data.ownerDetails;
  return (
    <View style={{ flex: 1 }}>
      <Text style={[styles.label, { color: accent, marginBottom: 8 }]}>Payment Details</Text>
      {owner.paymentMethod === "Bank" ? (
        <View>
          <Text style={styles.muted}>Owner: {owner.OwnerName}</Text>
          <Text style={styles.muted}>Account: {owner.AccountNumber}</Text>
          <Text style={styles.muted}>Bank: {owner.BankName}</Text>
          <Text style={styles.muted}>Code: {owner.BankCode}</Text>
          <Text style={styles.muted}>Address: {owner.BankAddress}</Text>
        </View>
      ) : owner.QR && isImageSrc(owner.QR) ? (
        <View style={[styles.row, { gap: 10, alignItems: "center" }]}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={owner.QR} style={styles.qr} />
          <View>
            <Text style={styles.muted}>UPI ID</Text>
            <Text style={styles.bold}>{owner.UPIID}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.muted}>Payment details will appear here.</Text>
      )}
    </View>
  );
}

function TotalsBlock({
  data,
  accent,
  dark = false,
}: {
  data: InvoicePdfData;
  accent: string;
  dark?: boolean;
}) {
  const fmt = useInvoiceFormat(data);
  const muted = dark ? "#cbd5e1" : "#64748b";
  const fg = dark ? "#ffffff" : "#111827";

  return (
    <View
      style={[
        styles.totals,
        dark
          ? { backgroundColor: "#0f172a", padding: 16, borderRadius: 10 }
          : {},
      ]}
    >
      <View style={styles.totalRow}>
        <Text style={{ color: muted }}>Subtotal</Text>
        <Text style={{ color: fg }}>{fmt(data.subTotal)}</Text>
      </View>
      {data.mode === "india" && data.txnType === "intra" ? (
        <>
          <View style={styles.totalRow}>
            <Text style={{ color: muted }}>CGST</Text>
            <Text style={{ color: accent }}>{fmt(data.totalCgst)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ color: muted }}>SGST</Text>
            <Text style={{ color: accent }}>{fmt(data.totalSgst)}</Text>
          </View>
        </>
      ) : null}
      {data.mode === "india" && data.txnType === "inter" ? (
        <View style={styles.totalRow}>
          <Text style={{ color: muted }}>IGST</Text>
          <Text style={{ color: accent }}>{fmt(data.totalIgst)}</Text>
        </View>
      ) : null}
      {data.mode === "india" && data.txnType === "export" ? (
        <View style={styles.totalRow}>
          <Text style={{ color: muted }}>Tax</Text>
          <Text style={{ color: fg }}>Exempt / 0%</Text>
        </View>
      ) : null}
      {data.mode === "international" ? (
        <View style={styles.totalRow}>
          <Text style={{ color: muted }}>
            {data.taxConfig.name || "Tax"} ({data.taxConfig.rate || "0"}%)
          </Text>
          <Text style={{ color: accent }}>{fmt(data.totalTax)}</Text>
        </View>
      ) : null}
      <View
        style={[
          styles.totalRow,
          {
            borderTopWidth: 1.5,
            borderTopColor: dark ? "#334155" : "#111827",
            paddingTop: 9,
            marginTop: 5,
          },
        ]}
      >
        <Text style={[styles.bold, { color: dark ? accent : "#111827", fontSize: 13 }]}>Total</Text>
        <Text style={[styles.bold, { color: dark ? "#ffffff" : "#111827", fontSize: 13 }]}>
          {fmt(data.total)}
        </Text>
      </View>
    </View>
  );
}

function NotesFooter({ data, accent }: { data: InvoicePdfData; accent: string }) {
  return (
    <View style={styles.footer} wrap={false}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: accent, marginBottom: 7 }]}>Additional Information</Text>
        <Text style={styles.muted}>{data.additionalInfo || "Thank you for your business."}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: accent, marginBottom: 7 }]}>Terms & Conditions</Text>
        <Text style={styles.muted}>{data.termsConditions || "Please pay by the due date."}</Text>
      </View>
    </View>
  );
}

function ClassicTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#0f766e";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={[styles.between, { borderBottomWidth: 1, borderBottomColor: "#d1d5db", paddingBottom: 12 }]}>
        <View style={[styles.row, { gap: 12, maxWidth: 340 }]}>
          <LogoMark owner={owner} accent={accent} />
          <View>
            <Text style={[styles.bold, { fontSize: 17, color: "#4b5563", marginBottom: 4 }]}>
              {owner.CompanyName || "Company Name"}
            </Text>
            <Text style={styles.muted}>Address: {owner.CompanyAddress}</Text>
            <Text style={styles.muted}>Tax: {owner.TaxDetail}</Text>
            <Text style={styles.muted}>Email: {owner.CompanyMail}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.right, { color: accent, fontSize: 13 }]}>Invoice</Text>
          <Text style={[styles.right, styles.bold]}>INV-{data.details.InvoiceNo || "DRAFT"}</Text>
        </View>
      </View>

      <View style={[styles.between, { marginTop: 22, gap: 24 }]}>
        <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 12 }}>
          <Text style={[styles.label, { color: "#111827", marginBottom: 8 }]}>Billed To</Text>
          <Text style={[styles.bold, { marginBottom: 4 }]}>{data.details.CustomerName || "Customer Name"}</Text>
          <Text style={styles.muted}>{data.details.CustomerAddress}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>Invoice Date</Text>
            <Text>{data.details.IssueDate || "N/A"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>Due Date</Text>
            <Text>{data.details.DueDate || "N/A"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>Currency</Text>
            <Text>{data.mode === "india" ? "INR" : data.currency.code}</Text>
          </View>
        </View>
      </View>

      {data.details.Subject ? (
        <Text style={{ marginTop: 16 }}>
          <Text style={styles.bold}>Subject - </Text>
          {data.details.Subject}
        </Text>
      ) : null}

      <ItemsTable data={data} accent={accent} />

      <View style={styles.totalsWrap} wrap={false}>
        <PaymentBlock data={data} accent={accent} />
        <TotalsBlock data={data} accent={accent} />
      </View>

      <NotesFooter data={data} accent={accent} />
    </Page>
  );
}

function ModernTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#0f766e";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={[styles.page, { padding: 56 }]} wrap>
      <View style={{ alignItems: "center", marginBottom: 46 }}>
        <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#cbd5e1", padding: 18, alignItems: "center" }}>
          <Text style={{ fontSize: 8, color: "#94a3b8", marginBottom: 5 }}>the</Text>
          <Text style={[styles.bold, { fontSize: 22, color: "#0f172a", textTransform: "uppercase" }]}>
            {owner.CompanyName || "Circle"}
          </Text>
          <Text style={[styles.label, { color: "#94a3b8", marginTop: 6 }]}>Design Studio</Text>
        </View>
        <Text style={[styles.muted, { marginTop: 14, textAlign: "center" }]}>
          {owner.CompanyMail} | {owner.PhNo}
          {owner.TaxDetail ? ` | GSTIN: ${owner.TaxDetail}` : ""}
        </Text>
      </View>

      <View style={[styles.between, { marginBottom: 34 }]}>
        <View style={{ maxWidth: 240 }}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Issued To</Text>
          <Text style={[styles.bold, { fontSize: 13, marginBottom: 4 }]}>{data.details.CustomerName || "Customer Name"}</Text>
          <Text style={styles.muted}>{data.details.CustomerAddress}</Text>
        </View>
        <View>
          <Text style={[styles.label, styles.right, { marginBottom: 10 }]}>Invoice Details</Text>
          <Text style={[styles.bold, styles.right, { color: accent, fontSize: 13 }]}>INV-{data.details.InvoiceNo || "DRAFT"}</Text>
          <Text style={[styles.muted, styles.right]}>Date: {data.details.IssueDate || "N/A"}</Text>
          <Text style={[styles.muted, styles.right]}>Due: {data.details.DueDate || "N/A"}</Text>
          <Text style={[styles.muted, styles.right]}>Currency: {data.mode === "india" ? "INR" : data.currency.code}</Text>
        </View>
      </View>

      <ItemsTable data={data} accent={accent} boxed={false} minimal />

      <View style={styles.totalsWrap} wrap={false}>
        <PaymentBlock data={data} accent={accent} />
        <TotalsBlock data={data} accent={accent} />
      </View>

      <View style={[styles.footer, { borderTopColor: "#f1f5f9" }]} wrap={false}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: "#0f172a", marginBottom: 7 }]}>Notes & Terms</Text>
          <Text style={styles.muted}>{data.termsConditions || "Please ensure payment by the due date."}</Text>
          <Text style={[styles.muted, { marginTop: 4 }]}>{data.additionalInfo}</Text>
        </View>
        <Text style={{ fontSize: 34, color: "#e2e8f0", textAlign: "right" }}>Thank You</Text>
      </View>
    </Page>
  );
}

function RegularTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#111827";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={[styles.page, { paddingLeft: 64 }]} wrap>
      <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, backgroundColor: accent }} fixed />
      <View style={[styles.between, { marginBottom: 36 }]}>
        <View>
          <LogoMark owner={owner} accent={accent} dark />
          <Text style={[styles.bold, { fontSize: 17, color: accent, marginTop: 14, textTransform: "uppercase" }]}>
            {owner.CompanyName || "Company Name"}
          </Text>
          <Text style={[styles.muted, { maxWidth: 260 }]}>{owner.CompanyAddress}</Text>
          <Text style={styles.muted}>{owner.CompanyMail}</Text>
          {owner.TaxDetail ? <Text style={styles.muted}>GSTIN: {owner.TaxDetail}</Text> : null}
        </View>
        <View>
          <Text style={[styles.right, { fontSize: 44, color: "#e2e8f0" }]}>INVOICE</Text>
          <Text style={[styles.bold, styles.right, { fontSize: 15 }]}># {data.details.InvoiceNo || "DRAFT"}</Text>
          <Text style={[styles.muted, styles.right]}>Date: {data.details.IssueDate || "N/A"}</Text>
          <Text style={[styles.muted, styles.right]}>Due: {data.details.DueDate || "N/A"}</Text>
        </View>
      </View>

      <View style={[styles.between, { gap: 34, marginBottom: 26 }]}>
        <View style={{ flex: 1, backgroundColor: "#f8fafc", borderLeftWidth: 2, borderLeftColor: "#cbd5e1", padding: 14 }}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Billed To</Text>
          <Text style={[styles.bold, { fontSize: 14 }]}>{data.details.CustomerName || "Customer Name"}</Text>
          <Text style={styles.muted}>{data.details.CustomerAddress}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={[styles.label, styles.right, { marginBottom: 8 }]}>Subject</Text>
          <Text style={[styles.right, styles.bold]}>{data.details.Subject || "General Professional Services"}</Text>
        </View>
      </View>

      <ItemsTable data={data} accent="#0f766e" boxed={false} minimal />

      <View style={[styles.totalsWrap, { borderTopWidth: 2, borderTopColor: accent, paddingTop: 18 }]} wrap={false}>
        <PaymentBlock data={data} accent={accent} />
        <TotalsBlock data={data} accent={accent} />
      </View>

      <NotesFooter data={data} accent={accent} />
    </Page>
  );
}

function TrendyTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#6366f1";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={styles.pageNoPad} wrap>
      <View style={[styles.between, { backgroundColor: "#0f172a", padding: 36, color: "#ffffff" }]}>
        <View style={[styles.row, { gap: 14, maxWidth: 350 }]}>
          <LogoMark owner={owner} accent={accent} dark />
          <View>
            <Text style={[styles.bold, { fontSize: 18, color: "#ffffff", textTransform: "uppercase" }]}>
              {owner.CompanyName || "Company Name"}
            </Text>
            <Text style={{ color: "#cbd5e1", lineHeight: 1.45 }}>{owner.CompanyAddress}</Text>
            <Text style={{ color: "#cbd5e1" }}>{owner.CompanyMail} | {owner.PhNo}</Text>
            {owner.TaxDetail ? <Text style={{ color: accent }}>GSTIN: {owner.TaxDetail}</Text> : null}
          </View>
        </View>
        <View>
          <Text style={[styles.bold, styles.right, { fontSize: 32, color: accent }]}>INVOICE</Text>
          <Text style={[styles.right, { color: "#c7d2fe" }]}>INV-{data.details.InvoiceNo || "DRAFT"}</Text>
        </View>
      </View>

      <View style={{ padding: 36, flex: 1 }}>
        <View style={[styles.between, { marginBottom: 28 }]}>
          <View>
            <Text style={[styles.label, { color: accent, marginBottom: 10 }]}>Bill To</Text>
            <Text style={[styles.bold, { fontSize: 16 }]}>{data.details.CustomerName || "Customer Name"}</Text>
            <Text style={[styles.muted, { maxWidth: 260 }]}>{data.details.CustomerAddress}</Text>
          </View>
          <View>
            <View style={styles.totalRow}>
              <Text style={[styles.label, { marginRight: 16 }]}>Issued Date</Text>
              <Text>{data.details.IssueDate || "N/A"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.label, { marginRight: 16 }]}>Due Date</Text>
              <Text style={{ color: accent }}>{data.details.DueDate || "N/A"}</Text>
            </View>
            {data.details.Subject ? (
              <View style={styles.totalRow}>
                <Text style={[styles.label, { marginRight: 16 }]}>Subject</Text>
                <Text>{data.details.Subject}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <ItemsTable data={data} accent={accent} headerDark />

        <View style={styles.totalsWrap} wrap={false}>
          <PaymentBlock data={data} accent={accent} />
          <TotalsBlock data={data} accent={accent} />
        </View>

        <NotesFooter data={data} accent={accent} />
      </View>
    </Page>
  );
}

function SassyTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#4f46e5";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, backgroundColor: accent }} fixed />
      <View style={[styles.between, { alignItems: "flex-end", marginBottom: 28, paddingTop: 12 }]}>
        <View style={[styles.row, { gap: 14, alignItems: "center" }]}>
          <LogoMark owner={owner} accent={accent} />
          <View>
            <Text style={[styles.bold, { fontSize: 19, color: "#0f172a", textTransform: "uppercase" }]}>
              {owner.CompanyName || "Company Name"}
            </Text>
            <Text style={styles.muted}>{owner.CompanyMail}</Text>
            {owner.TaxDetail ? <Text style={[styles.bold, { color: accent }]}>GSTIN: {owner.TaxDetail}</Text> : null}
          </View>
        </View>
        <View>
          <Text style={[styles.bold, styles.right, { fontSize: 42, color: "#f1f5f9" }]}>INVOICE</Text>
          <Text style={[styles.label, styles.right]}>Tax Document</Text>
        </View>
      </View>

      <View style={[styles.between, { gap: 20, marginBottom: 24 }]}>
        <View style={{ flex: 1.35, borderWidth: 1, borderColor: "#eef2ff", backgroundColor: "#f8fafc", padding: 16, borderRadius: 10 }}>
          <Text style={[styles.label, { color: accent, marginBottom: 10 }]}>Billed To</Text>
          <Text style={[styles.bold, { fontSize: 16 }]}>{data.details.CustomerName || "Customer Name"}</Text>
          <Text style={styles.muted}>{data.details.CustomerAddress}</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: "#eef2ff", padding: 16, borderRadius: 10, borderBottomWidth: 4, borderBottomColor: accent }}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Invoice No.</Text>
            <Text style={[styles.bold, { color: accent }]}>#{data.details.InvoiceNo || "DRAFT"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Date</Text>
            <Text>{data.details.IssueDate || "N/A"}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.bold}>{data.details.DueDate || "N/A"}</Text>
          </View>
        </View>
      </View>

      <ItemsTable data={data} accent={accent} headerDark />

      <View style={styles.totalsWrap} wrap={false}>
        <PaymentBlock data={data} accent={accent} />
        <TotalsBlock data={data} accent={accent} />
      </View>

      <NotesFooter data={data} accent={accent} />
    </Page>
  );
}

function FreeTemplate({ data }: { data: InvoicePdfData }) {
  const accent = "#134e4a";
  const owner = data.ownerDetails;

  return (
    <Page size="A4" style={[styles.page, { paddingLeft: 70 }]} wrap>
      <View style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 34, backgroundColor: accent }} fixed />
      <View style={[styles.between, { borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingBottom: 28, marginBottom: 34 }]}>
        <View style={{ maxWidth: 340 }}>
          <View style={[styles.row, { gap: 12, alignItems: "flex-start" }]}>
            {owner.companyLogo ? <LogoMark owner={owner} accent={accent} /> : null}
            <View>
              <Text style={[styles.bold, { fontSize: 26, color: accent, textTransform: "uppercase" }]}>
                {owner.CompanyName || "Company Name"}
              </Text>
              <Text style={[styles.label, { color: "#0f766e" }]}>Professional Services</Text>
            </View>
          </View>
          <Text style={[styles.bold, { color: "#334155", marginTop: 22 }]}>Registered Office:</Text>
          <Text style={styles.muted}>{owner.CompanyAddress}</Text>
          <Text style={styles.muted}>{owner.CompanyMail} | {owner.PhNo}</Text>
          {owner.TaxDetail ? <Text style={[styles.bold, { color: accent }]}>GSTIN: {owner.TaxDetail}</Text> : null}
        </View>
        <View>
          <Text style={[styles.bold, styles.right, { fontSize: 48, color: "#f8fafc" }]}>INV</Text>
          <Text style={[styles.bold, styles.right, { fontSize: 23 }]}>#{data.details.InvoiceNo || "DRAFT"}</Text>
          <Text style={[styles.muted, styles.right]}>Issue Date: {data.details.IssueDate || "N/A"}</Text>
          <Text style={[styles.muted, styles.right]}>Due Date: {data.details.DueDate || "N/A"}</Text>
        </View>
      </View>

      <View style={[styles.between, { marginBottom: 28, gap: 36 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: accent, marginBottom: 10 }]}>To</Text>
          <Text style={[styles.bold, { fontSize: 18 }]}>{data.details.CustomerName || "Customer Name"}</Text>
          <Text style={styles.muted}>{data.details.CustomerAddress}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={[styles.label, { color: accent, marginBottom: 10 }]}>Re</Text>
          <Text style={styles.bold}>{data.details.Subject || "Invoice"}</Text>
        </View>
      </View>

      <ItemsTable data={data} accent={accent} boxed={false} minimal />

      <View style={styles.totalsWrap} wrap={false}>
        <PaymentBlock data={data} accent={accent} />
        <TotalsBlock data={data} accent="#2dd4bf" dark />
      </View>

      <NotesFooter data={data} accent={accent} />
    </Page>
  );
}

function TemplatePage({ data, kind }: { data: InvoicePdfData; kind: TemplateKind }) {
  if (kind === "modern") return <ModernTemplate data={data} />;
  if (kind === "regular") return <RegularTemplate data={data} />;
  if (kind === "trendy") return <TrendyTemplate data={data} />;
  if (kind === "sassy") return <SassyTemplate data={data} />;
  if (kind === "free") return <FreeTemplate data={data} />;
  return <ClassicTemplate data={data} />;
}

export default function InvoicePdfDocument({
  data = sampleInvoicePdfData,
  templateName,
}: InvoicePdfDocumentProps) {
  const kind = getKind(templateName);

  return (
    <Document title={`Invoice-${data.details.InvoiceNo || "draft"}`}>
      <TemplatePage data={data} kind={kind} />
    </Document>
  );
}
