import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PdfTemplateProps } from "@/app/component/InvoicePdfDocument";

// ─── REGISTER LOCAL ROBOTO FONTS (PUBLIC DIR PATH) ───────────────────────────

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `/fonts/Roboto-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `/fonts/Roboto-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function fmtNum(n: string | number | undefined | null, locale: string): string {
  const parsed = parseFloat(String(n || "0"));
  return isNaN(parsed)
    ? "0.00"
    : parsed.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

// ─── TYPE-SAFE STYLES ─────────────────────────────────────────────────────────

const pdfStyles = {
  page: {
    width: "210mm",
    height: "297mm",
    paddingTop: 0,
    paddingBottom: 25,
    paddingRight: 0,
    paddingLeft: 0,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  // 1. DARK HEADER BANNER
  headerBanner: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    paddingHorizontal: 35,
    paddingVertical: 24,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyIdentity: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoFallbackText: {
    color: "#818cf8",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  logoImage: {
    width: 38,
    height: 38,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  companySubText: {
    fontSize: 8,
    color: "#cbd5e1",
    marginTop: 2,
  },
  gstinText: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#a5b4fc",
    marginTop: 2,
  },
  invoiceMetaRight: {
    alignItems: "flex-end",
  },
  taxInvoiceLabel: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#818cf8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 22,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ffffff",
  },

  // 2. INFO GRID (Billing & Dates)
  infoGrid: {
    paddingHorizontal: 35,
    paddingVertical: 18,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  billedToCol: {
    width: "58%",
  },
  billedToPill: {
    fontSize: 6,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#4f46e5",
    backgroundColor: "#e0e7ff",
    borderWidth: 1,
    borderColor: "#c7d2fe",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    textTransform: "uppercase",
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  customerName: {
    fontSize: 11,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 3,
  },
  customerAddress: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.3,
  },
  metaCol: {
    width: "42%",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
    paddingLeft: 20,
    justifyContent: "center",
    gap: 4,
  },
  metaRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  metaValue: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#334155",
  },
  dueDatePill: {
    color: "#4f46e5",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },

  // 3. TABLE SECTION
  tableWrapper: {
    paddingHorizontal: 35,
    paddingVertical: 18,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: 3,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  colDesc: { flex: 3 },
  colHsn: { width: 45, textAlign: "center" },
  colQty: { width: 38, textAlign: "center" },
  colRate: { width: 55, textAlign: "right" },
  colTax: { width: 48, textAlign: "right" },
  colTotal: { width: 65, textAlign: "right" },

  // 4. FOOTER & TOTALS
  footerSection: {
    paddingHorizontal: 35,
  },
  paymentSummaryGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  paymentBox: {
    width: "52%",
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  bankCard: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 3,
    fontSize: 8,
  },
  bankRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  qrImage: {
    width: 48,
    height: 48,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  totalsBox: {
    width: "42%",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#64748b",
  },
  totalDueRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 6,
    marginTop: 4,
  },
  totalDueLabel: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  totalDueValue: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#4f46e5",
  },

  // 5. LEGAL & NOTES
  legalGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    fontSize: 7,
    color: "#64748b",
  },
  legalCol: {
    width: "48%",
  },
  watermarkText: {
    textAlign: "center",
    fontSize: 6,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 12,
  },
} satisfies Parameters<typeof StyleSheet.create>[0];

const styles = StyleSheet.create(pdfStyles);

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function TrendyPdf({ data }: PdfTemplateProps) {
  const { owner, customer, optional, items, config, totals } = data;
  const { mode, txnType, taxConfig, currency } = config;

  const sym: string = mode === "india" ? "₹" : currency?.symbol || "$";
  const locale: string = mode === "india" ? "en-IN" : currency?.locale || "en-US";
  const fmt = (n: string | number | undefined | null) => fmtNum(n, locale);

  return (
    <Document title={`Invoice-${customer.InvoiceNo || "draft"}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainContainer}>
          {/* TOP SECTION */}
          <View>
            {/* 1. DARK HEADER BANNER */}
            <View style={styles.headerBanner}>
              <View style={styles.companyIdentity}>
                <View style={styles.logoBox}>
                  {owner.companyLogo ? (
                    <Image src={owner.companyLogo} style={styles.logoImage} />
                  ) : (
                    <Text style={styles.logoFallbackText}>
                      {owner.CompanyName?.charAt(0) || "I"}
                    </Text>
                  )}
                </View>
                <View>
                  <Text style={styles.companyName}>
                    {owner.CompanyName || "YOUR COMPANY NAME"}
                  </Text>
                  <Text style={styles.companySubText}>
                    {owner.CompanyAddress || "123 Street, City, Country"}
                  </Text>
                  <Text style={styles.companySubText}>
                    {owner.CompanyMail || "contact@company.com"}{" "}
                    {owner.PhNo ? `• ${owner.PhNo}` : ""}
                  </Text>
                  {owner.TaxDetail ? (
                    <Text style={styles.gstinText}>
                      GSTIN: {owner.TaxDetail}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.invoiceMetaRight}>
                <Text style={styles.taxInvoiceLabel}>Tax Invoice</Text>
                <Text style={styles.invoiceNumber}>
                  #{customer.InvoiceNo || "INV-001"}
                </Text>
              </View>
            </View>

            {/* 2. INFO GRID */}
            <View style={styles.infoGrid}>
              <View style={styles.billedToCol}>
                <Text style={styles.billedToPill}>Billed To</Text>
                <Text style={styles.customerName}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={styles.customerAddress}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
              </View>

              <View style={styles.metaCol}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Issue Date:</Text>
                  <Text style={styles.metaValue}>
                    {customer.IssueDate || "N/A"}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Due Date:</Text>
                  <Text style={[styles.metaValue, styles.dueDatePill]}>
                    {customer.DueDate || "Upon Receipt"}
                  </Text>
                </View>
                {customer.Subject ? (
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Subject:</Text>
                    <Text style={[styles.metaValue, { fontSize: 7 }]}>
                      {customer.Subject}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* 3. ITEMS TABLE */}
            <View style={styles.tableWrapper}>
              <View style={styles.tableHeader}>
                <Text style={styles.colDesc}>Description</Text>
                {mode === "india" && <Text style={styles.colHsn}>HSN/SAC</Text>}
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colRate}>Rate</Text>

                {mode === "india" && txnType === "intra" && (
                  <>
                    <Text style={styles.colTax}>CGST</Text>
                    <Text style={styles.colTax}>SGST</Text>
                  </>
                )}
                {mode === "india" && txnType === "inter" && (
                  <Text style={styles.colTax}>IGST</Text>
                )}
                {mode === "international" && (
                  <Text style={styles.colTax}>{taxConfig?.name || "Tax"}</Text>
                )}

                <Text style={styles.colTotal}>Amount</Text>
              </View>

              {items.map((item, idx: number) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.colDesc, { fontFamily: "Roboto", fontWeight: "bold" }]}>
                    {item.description || "—"}
                  </Text>
                  {mode === "india" && (
                    <Text style={[styles.colHsn, { color: "#94a3b8" }]}>
                      {item.hsn || "—"}
                    </Text>
                  )}
                  <Text style={styles.colQty}>
                    {item.qty || "0"} {item.unit}
                  </Text>
                  <Text style={styles.colRate}>
                    {sym}{fmt(item.rate)}
                  </Text>

                  {mode === "india" && txnType === "intra" && (
                    <>
                      <Text style={[styles.colTax, { color: "#0f766e" }]}>
                        {sym}{fmt(item.cgst)}
                      </Text>
                      <Text style={[styles.colTax, { color: "#0f766e" }]}>
                        {sym}{fmt(item.sgst)}
                      </Text>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <Text style={[styles.colTax, { color: "#4338ca" }]}>
                      {sym}{fmt(item.igst)}
                    </Text>
                  )}
                  {mode === "international" && (
                    <Text style={styles.colTax}>
                      {parseFloat(taxConfig?.rate || "0") > 0
                        ? `${sym}${fmt(item.taxAmt)}`
                        : "0.00"}
                    </Text>
                  )}

                  <Text style={[styles.colTotal, { fontFamily: "Roboto", fontWeight: "bold" }]}>
                    {sym}{fmt(item.amt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* BOTTOM SECTION */}
          <View style={styles.footerSection}>
            <View style={styles.paymentSummaryGrid}>
              {/* Payment Instructions */}
              <View style={styles.paymentBox}>
                <Text style={styles.sectionTitle}>Payment Information</Text>
                {owner.paymentMethod === "Bank" ? (
                  <View style={styles.bankCard}>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Account Name:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.OwnerName || "—"}
                      </Text>
                    </View>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Account Number:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.AccountNumber || "—"}
                      </Text>
                    </View>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Bank / IFSC:</Text>
                      <Text>
                        {owner.BankName || "—"} ({owner.BankCode || "—"})
                      </Text>
                    </View>
                  </View>
                ) : (
                  owner.QR ? (
                    <View style={styles.qrCard}>
                      <Image src={owner.QR} style={styles.qrImage} />
                      <View>
                        <Text style={[styles.sectionTitle, { color: "#94a3b8", marginBottom: 2 }]}>
                          Scan to Pay via UPI
                        </Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold", fontSize: 9 }}>
                          {owner.UPIID || "—"}
                        </Text>
                      </View>
                    </View>
                  ) : null
                )}
              </View>

              {/* Totals Summary */}
              <View style={styles.totalsBox}>
                <View style={styles.summaryRow}>
                  <Text>Subtotal</Text>
                  <Text>{sym}{fmt(totals.subTotal)}</Text>
                </View>

                {mode === "india" && (
                  <>
                    {txnType === "intra" ? (
                      <>
                        <View style={styles.summaryRow}>
                          <Text>CGST Total</Text>
                          <Text>{sym}{fmt(totals.totalCgst)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                          <Text>SGST Total</Text>
                          <Text>{sym}{fmt(totals.totalSgst)}</Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.summaryRow}>
                        <Text>IGST Total</Text>
                        <Text>{sym}{fmt(totals.totalIgst)}</Text>
                      </View>
                    )}
                  </>
                )}

                {mode === "international" && (
                  <View style={styles.summaryRow}>
                    <Text>{taxConfig?.name || "Tax"} ({taxConfig?.rate || "0"}%)</Text>
                    <Text>{sym}{fmt(totals.totalTax)}</Text>
                  </View>
                )}

                <View style={styles.totalDueRow}>
                  <Text style={styles.totalDueLabel}>Total Due</Text>
                  <Text style={styles.totalDueValue}>
                    {sym}{fmt(totals.Total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Legal & Notes */}
            <View style={styles.legalGrid}>
              <View style={styles.legalCol}>
                <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                <Text style={{ fontStyle: "italic", color: "#64748b" }}>
                  {optional.termsConditions ||
                    "Goods once sold will not be taken back. Interest @18% p.a. will be charged if payment is not settled within the due date."}
                </Text>
              </View>

              <View style={[styles.legalCol, { textAlign: "right" }]}>
                <Text style={styles.sectionTitle}>Additional Notes</Text>
                <Text>
                  {optional.additionalInfo || "Thank you for doing business with us!"}
                </Text>
              </View>
            </View>

            <Text style={styles.watermarkText}>
              Computer Generated Invoice • Powered by luen.in
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}