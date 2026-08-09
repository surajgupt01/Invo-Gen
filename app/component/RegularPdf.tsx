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

// ─── TYPE-SAFE STYLES (MATCHED TO INVOICE PREVIEW DESIGN) ────────────────────

const pdfStyles = {
  page: {
    width: "210mm",
    height: "297mm",
    paddingTop: 28,
    paddingBottom: 28,
    paddingRight: 32,
    paddingLeft: 52, // Left padding accounts for the 10px accent bar + margin
    fontSize: 9,
    fontFamily: "Roboto",
    color: "#1e293b",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 10,
    height: "297mm",
    backgroundColor: "#0f172a", // slate-900
  },
  contentContainer: {
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  companyIdentity: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoTextFallback: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  logoImage: {
    width: 42,
    height: 42,
    objectFit: "contain",
  },
  companyDetails: {
    fontSize: 8,
    color: "#64748b",
    gap: 2,
  },
  companyName: {
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  invoiceMeta: {
    alignItems: "flex-end",
  },
  invoiceTitleWatermark: {
    fontSize: 28,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#e2e8f0",
    letterSpacing: -1,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
  },
  metaText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  txnTag: {
    fontSize: 6,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginTop: 4,
  },

  // 2. CLIENT INFO & SUBJECT
  clientSubjectCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  clientSection: {
    width: "58%",
  },
  subjectSection: {
    width: "38%",
    alignItems: "flex-end",
  },
  sectionTag: {
    fontSize: 6,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  clientAddress: {
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.3,
  },
  subjectText: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "right",
  },

  // 3. ITEMS TABLE
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
    paddingVertical: 7,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  colDesc: { flex: 2.5 },
  colHsn: { flex: 0.8, textAlign: "center" },
  colQty: { flex: 0.8, textAlign: "center" },
  colRate: { flex: 1.2, textAlign: "right" },
  colTax: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1.4, textAlign: "right" },

  // 4. TOTALS & PAYMENT SECTION
  bottomSection: {
    marginTop: 16,
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  paymentBox: {
    width: "50%",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  paymentField: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    marginBottom: 2,
  },
  qrContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qrImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  calculationsCard: {
    width: "45%",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
  },
  calcRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#64748b",
  },
  grandTotalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: "#0f172a",
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalText: {
    fontSize: 11,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
  },

  // 5. FOOTER
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    fontSize: 7,
    color: "#64748b",
  },
  footerCol: {
    width: "48%",
  },
} satisfies Parameters<typeof StyleSheet.create>[0];

const styles = StyleSheet.create(pdfStyles);

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function RegularPdf({ data }: PdfTemplateProps) {
  const { owner, customer, optional, items, config, totals } = data;
  const { mode, txnType, taxConfig, currency } = config;

  // Currency resolution: Always fallback to "₹" for India mode and valid symbol/code for International
  const sym: string = mode === "india" ? "₹" : currency?.symbol || "$";
  const locale: string = mode === "india" ? "en-IN" : currency?.locale || "en-US";
  const fmt = (n: string | number | undefined | null) => fmtNum(n, locale);

  return (
    <Document title={`Invoice-${customer.InvoiceNo || "draft"}`}>
      <Page size="A4" style={styles.page}>
        {/* Left Side Accent Decoration Bar */}
        <View style={styles.accentBar} />

        <View style={styles.contentContainer}>
          {/* TOP CONTENT WRAPPER */}
          <View>
            {/* 1. HEADER SECTION */}
            <View style={styles.header}>
              <View style={styles.companyIdentity}>
                <View style={styles.logoBox}>
                  {owner.companyLogo ? (
                    <Image src={owner.companyLogo} style={styles.logoImage} />
                  ) : (
                    <Text style={styles.logoTextFallback}>
                      {owner.CompanyName?.charAt(0) || "C"}
                    </Text>
                  )}
                </View>

                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>
                    {owner.CompanyName || "YOUR COMPANY NAME"}
                  </Text>
                  <Text>{owner.CompanyAddress || "123 Street, City, Country"}</Text>
                  <Text>
                    {owner.CompanyMail || "contact@company.com"}{" "}
                    {owner.PhNo ? `• ${owner.PhNo}` : ""}
                  </Text>
                  {owner.TaxDetail ? (
                    <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1e293b" }}>
                      GSTIN: {owner.TaxDetail}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.invoiceMeta}>
                <Text style={styles.invoiceTitleWatermark}>INVOICE</Text>
                <Text style={styles.invoiceNumber}>#{customer.InvoiceNo || "INV-001"}</Text>
                <Text style={styles.metaText}>
                  Date: {customer.IssueDate || "N/A"}
                </Text>
                <Text style={styles.metaText}>
                  Due: {customer.DueDate || "Upon Receipt"}
                </Text>
                <Text style={styles.txnTag}>
                  {mode === "india" ? "Domestic Transaction" : "International Transaction"}
                </Text>
              </View>
            </View>

            {/* 2. CLIENT INFO & SUBJECT */}
            <View style={styles.clientSubjectCard}>
              <View style={styles.clientSection}>
                <Text style={styles.sectionTag}>Billed To</Text>
                <Text style={styles.clientName}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={styles.clientAddress}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
                {customer.CustomerEmail ? (
                  <Text style={[styles.clientAddress, { marginTop: 2 }]}>
                    {customer.CustomerEmail}
                  </Text>
                ) : null}
              </View>

              <View style={styles.subjectSection}>
                <Text style={styles.sectionTag}>Subject</Text>
                <Text style={styles.subjectText}>
                  {customer.Subject || "General Professional Services"}
                </Text>
              </View>
            </View>

            {/* 3. ITEMS TABLE */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.colDesc}>Description</Text>
                {mode === "india" && <Text style={styles.colHsn}>HSN/SAC</Text>}
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colRate}>Rate</Text>

                {/* Dynamic Tax Headers */}
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

                <Text style={styles.colTotal}>Total</Text>
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

                  {/* Dynamic Tax Cells */}
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
                      {sym}{fmt(item.taxAmt)}
                    </Text>
                  )}

                  <Text style={[styles.colTotal, { fontFamily: "Roboto", fontWeight: "bold" }]}>
                    {sym}{fmt(item.amt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* BOTTOM SECTION: TOTALS & FOOTER */}
          <View style={styles.bottomSection}>
            <View style={styles.totalsRow}>
              {/* Payment Info */}
              <View style={styles.paymentBox}>
                <Text style={[styles.sectionTag, { color: "#0f172a", marginBottom: 6 }]}>
                  Payment Methods
                </Text>
                {owner.paymentMethod === "Bank" ? (
                  <View style={{ gap: 2 }}>
                    <View style={styles.paymentField}>
                      <Text style={{ color: "#94a3b8" }}>Account Name:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.OwnerName || "—"}
                      </Text>
                    </View>
                    <View style={styles.paymentField}>
                      <Text style={{ color: "#94a3b8" }}>Account No:</Text>
                      <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                        {owner.AccountNumber || "—"}
                      </Text>
                    </View>
                    <View style={styles.paymentField}>
                      <Text style={{ color: "#94a3b8" }}>Bank / Code:</Text>
                      <Text>
                        {owner.BankName || "—"} ({owner.BankCode || "—"})
                      </Text>
                    </View>
                  </View>
                ) : (
                  owner.QR ? (
                    <View style={styles.qrContainer}>
                      <Image src={owner.QR} style={styles.qrImage} />
                      <View>
                        <Text style={styles.sectionTag}>Scan to Pay</Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold", fontSize: 9 }}>
                          {owner.UPIID || "—"}
                        </Text>
                      </View>
                    </View>
                  ) : null
                )}
              </View>

              {/* Calculations */}
              <View style={styles.calculationsCard}>
                <View style={styles.calcRow}>
                  <Text>Subtotal</Text>
                  <Text>{sym}{fmt(totals.subTotal)}</Text>
                </View>

                {mode === "india" && (
                  <>
                    {txnType === "intra" ? (
                      <>
                        <View style={[styles.calcRow, { color: "#0f766e" }]}>
                          <Text>CGST Total</Text>
                          <Text>{sym}{fmt(totals.totalCgst)}</Text>
                        </View>
                        <View style={[styles.calcRow, { color: "#0f766e" }]}>
                          <Text>SGST Total</Text>
                          <Text>{sym}{fmt(totals.totalSgst)}</Text>
                        </View>
                      </>
                    ) : (
                      <View style={[styles.calcRow, { color: "#4338ca" }]}>
                        <Text>IGST Total</Text>
                        <Text>{sym}{fmt(totals.totalIgst)}</Text>
                      </View>
                    )}
                  </>
                )}

                {mode === "international" && (
                  <View style={styles.calcRow}>
                    <Text>{taxConfig?.name || "Tax"} ({taxConfig?.rate || "0"}%)</Text>
                    <Text>{sym}{fmt(totals.totalTax)}</Text>
                  </View>
                )}

                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalText}>Grand Total</Text>
                  <Text style={styles.grandTotalText}>
                    {sym}{fmt(totals.Total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Legal / Notes Footer */}
            <View style={styles.footer}>
              <View style={styles.footerCol}>
                <Text style={[styles.sectionTag, { color: "#0f172a" }]}>
                  Terms & Conditions
                </Text>
                <Text style={{ fontStyle: "italic", color: "#94a3b8" }}>
                  {optional.termsConditions ||
                    "1. Please pay within the due date to avoid late fees.\n2. Quote invoice number in all correspondence."}
                </Text>
              </View>

              <View style={[styles.footerCol, { alignItems: "flex-end" }]}>
                <Text style={[styles.sectionTag, { color: "#0f172a" }]}>
                  Notes / Additional Info
                </Text>
                <Text style={{ textAlign: "right" }}>
                  {optional.additionalInfo || "Thank you for choosing our services!"}
                </Text>
                <Text style={{ fontSize: 6, color: "#cbd5e1", marginTop: 4 }}>
                  System ID: {customer.InvoiceNo || "INV-001"} • Digital Record
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}