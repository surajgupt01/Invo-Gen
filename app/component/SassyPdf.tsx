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
      fontStyle: "normal",
    },
    {
      src: `/fonts/Roboto-Italic.ttf`,
      fontWeight: "normal",
      fontStyle: "italic", // <--- Registers the italic variant
    },
    {
      src: `/fonts/Roboto-Bold.ttf`,
      fontWeight: "bold",
      fontStyle: "normal",
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

// ─── TYPE-SAFE STYLES (MATCHED TO INVOICE PREVIEW 4 DESIGN) ──────────────────

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
  accentBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#4f46e5", // Indigo accent top bar
  },
  contentPadding: {
    paddingHorizontal: 35,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  // 1. HEADER SECTION
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  companyIdentity: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    maxWidth: "65%",
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 34,
    height: 34,
    objectFit: "contain",
  },
  logoFallbackText: {
    fontSize: 16,
  },
  companyName: {
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  companySubText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  gstinText: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#4f46e5",
    textTransform: "uppercase",
    marginTop: 2,
  },
  documentTitleRight: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  taxDocPill: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#4f46e5",
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#e0e7ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    textTransform: "uppercase",
    marginTop: 4,
  },

  // 2. INFO CARDS
  cardsGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 12,
  },
  cardBilledTo: {
    width: "58%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f8fafc",
  },
  billedToHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4f46e5",
  },
  sectionTitle: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  customerName: {
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.3,
  },

  cardInvoiceMeta: {
    width: "38%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
    borderLeftColor: "#4f46e5",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    gap: 4,
  },
  metaRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 8,
    paddingVertical: 2,
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

  // 3. TABLE SECTION
  tableContainer: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
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

  // 4. BOTTOM PAYMENT & TOTALS
  bottomSection: {
    marginTop: 15,
  },
  paymentSummaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
  },
  paymentBox: {
    width: "52%",
  },
  paymentTitle: {
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
    borderRadius: 6,
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  qrImage: {
    width: 45,
    height: 45,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  totalsContainer: {
    width: "42%",
    gap: 4,
  },
  subtotalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#475569",
    paddingHorizontal: 4,
  },
  totalDueBanner: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  totalDueLabel: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  totalDueValue: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },

  // 5. LEGAL & FOOTER
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
  footerBranding: {
    fontSize: 6,
    color: "#cbd5e1",
    textTransform: "uppercase",
    textAlign: "right",
    marginTop: 4,
  },
} satisfies Parameters<typeof StyleSheet.create>[0];

const styles = StyleSheet.create(pdfStyles);

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function SassyPdf({ data }: PdfTemplateProps) {
  const { owner, customer, optional, items, config, totals } = data;
  const { mode, txnType, taxConfig, currency } = config;

  // Safe symbol resolution: Check mode AND fallback currency code
  const isIndia = mode === "india" || currency?.code === "INR";
  const sym: string = isIndia ? "₹" : currency?.symbol || "$";
  const locale: string = isIndia ? "en-IN" : currency?.locale || "en-US";
  const fmt = (n: string | number | undefined | null) => fmtNum(n, locale);

  return (
    <Document title={`Invoice-${customer.InvoiceNo || "draft"}`}>
      <Page size="A4" style={styles.page}>
        {/* Top Accent Color Bar */}
        <View style={styles.accentBar} />

        <View style={styles.contentPadding}>
          {/* TOP SECTION */}
          <View>
            {/* 1. HEADER */}
            <View style={styles.header}>
              <View style={styles.companyIdentity}>
                <View style={styles.logoBox}>
                  {owner.companyLogo ? (
                    <Image src={owner.companyLogo} style={styles.logoImage} />
                  ) : (
                    <Text style={styles.logoFallbackText}>⚡</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.companyName}>
                    {owner.CompanyName || "YOUR COMPANY NAME"}
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

              <View style={styles.documentTitleRight}>
                <Text style={styles.invoiceTitle}>INVOICE</Text>
                <Text style={styles.taxDocPill}>Tax Document</Text>
              </View>
            </View>

            {/* 2. INFO CARDS */}
            <View style={styles.cardsGrid}>
              <View style={styles.cardBilledTo}>
                <View style={styles.billedToHeader}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.sectionTitle}>Billed To</Text>
                </View>
                <Text style={styles.customerName}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={styles.customerAddress}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
              </View>

              <View style={styles.cardInvoiceMeta}>
                <View style={[styles.metaRow, { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }]}>
                  <Text style={styles.metaLabel}>Invoice No.</Text>
                  <Text style={[styles.metaValue, { color: "#4f46e5" }]}>
                    #{customer.InvoiceNo || "INV-001"}
                  </Text>
                </View>
                <View style={[styles.metaRow, { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" }]}>
                  <Text style={styles.metaLabel}>Date</Text>
                  <Text style={styles.metaValue}>{customer.IssueDate || "N/A"}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Due Date</Text>
                  <Text style={[styles.metaValue, { color: "#0f172a" }]}>
                    {customer.DueDate || "Upon Receipt"}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. STRUCTURED DATA TABLE */}
            <View style={styles.tableContainer}>
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
                  <View style={styles.colDesc}>
                    <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1e293b" }}>
                      {item.description || "—"}
                    </Text>
                    {customer.Subject ? (
                      <Text style={{ fontSize: 6, color: "#94a3b8", marginTop: 1 }}>
                        {customer.Subject}
                      </Text>
                    ) : null}
                  </View>

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
          <View style={styles.bottomSection}>
            <View style={styles.paymentSummaryRow}>
              {/* Payment Details */}
              <View style={styles.paymentBox}>
                <Text style={styles.paymentTitle}>Payment Details</Text>
                {owner.paymentMethod === "Bank" ? (
                  <View style={styles.bankCard}>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Beneficiary:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.OwnerName || "—"}
                      </Text>
                    </View>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Account No:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.AccountNumber || "—"}
                      </Text>
                    </View>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Bank / Code:</Text>
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
                        <Text style={[styles.sectionTitle, { color: "#94a3b8" }]}>
                          Scan UPI to Pay
                        </Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold", fontSize: 9, color: "#4f46e5" }}>
                          {owner.UPIID || "—"}
                        </Text>
                      </View>
                    </View>
                  ) : null
                )}
              </View>

              {/* Total Calculation Block */}
              <View style={styles.totalsContainer}>
                <View style={styles.subtotalRow}>
                  <Text>Subtotal</Text>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#0f172a" }}>
                    {sym}{fmt(totals.subTotal)}
                  </Text>
                </View>

                {mode === "india" && (
                  <>
                    {txnType === "intra" ? (
                      <>
                        <View style={styles.subtotalRow}>
                          <Text>CGST</Text>
                          <Text>{sym}{fmt(totals.totalCgst)}</Text>
                        </View>
                        <View style={styles.subtotalRow}>
                          <Text>SGST</Text>
                          <Text>{sym}{fmt(totals.totalSgst)}</Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.subtotalRow}>
                        <Text>IGST</Text>
                        <Text>{sym}{fmt(totals.totalIgst)}</Text>
                      </View>
                    )}
                  </>
                )}

                {mode === "international" && (
                  <View style={styles.subtotalRow}>
                    <Text>{taxConfig?.name || "Tax"} ({taxConfig?.rate || "0"}%)</Text>
                    <Text>{sym}{fmt(totals.totalTax)}</Text>
                  </View>
                )}

                {/* Highlighted Banner */}
                <View style={styles.totalDueBanner}>
                  <Text style={styles.totalDueLabel}>Total Due</Text>
                  <Text style={styles.totalDueValue}>
                    {sym}{fmt(totals.Total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Legal / Notes */}
            <View style={styles.legalGrid}>
              <View style={styles.legalCol}>
                <Text style={[styles.sectionTitle, { color: "#0f172a", marginBottom: 3 }]}>
                  Terms & Conditions
                </Text>
                <Text style={{ fontStyle: "italic", color: "#94a3b8" }}>
                  {optional.termsConditions ||
                    "1. Quotes are valid for 30 days.\n2. Overdue payments are subject to a 2% monthly fee."}
                </Text>
              </View>

              <View style={[styles.legalCol, { textAlign: "right" }]}>
                <Text style={[styles.sectionTitle, { color: "#0f172a", marginBottom: 3 }]}>
                  Additional Info
                </Text>
                <Text>
                  {optional.additionalInfo || "Thank you for your partnership!"}
                </Text>
                <Text style={styles.footerBranding}>
                  Generated via VokaPay • {owner.CompanyName || "Invoice"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}