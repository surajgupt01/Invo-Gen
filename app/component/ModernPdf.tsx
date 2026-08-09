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

// ─── REGISTER LOCAL ROBOTO FONTS (SERVER / NODE FILE SYSTEM) ─────────────────

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

// ─── TYPE-SAFE STYLES (MATCHED TO TEMP DESIGN) ──────────────────────────────

const pdfStyles = {
  page: {
    width: "210mm",
    height: "297mm",
    paddingTop: 28,
    paddingBottom: 24,
    paddingRight: 32,
    paddingLeft: 32,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  // 1. EDITORIAL HEADER
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerBorderBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#cbd5e1",
    borderBottomColor: "#cbd5e1",
    paddingHorizontal: 28,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  titleMain: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 4,
  },
  contactSubHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    fontSize: 8,
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  contactGstin: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#334155",
  },

  // 2. INFO GRID
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  issuedToCol: {
    width: "58%",
  },
  invoiceDetailsCol: {
    width: "38%",
    alignItems: "flex-end",
  },
  gridTitle: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  customerName: {
    fontSize: 11,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.3,
  },
  invoiceNoText: {
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#115e59", // text-teal-800
    marginBottom: 3,
  },
  metaText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 1,
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
    paddingVertical: 7,
    paddingHorizontal: 8,
    fontSize: 8,
  },

  // Dynamic Column Distribution
  colDesc: { flex: 2.5 },
  colHsn: { flex: 0.8, textAlign: "center" },
  colQty: { flex: 0.8, textAlign: "center" },
  colRate: { flex: 1.2, textAlign: "right" },
  colTax: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1.4, textAlign: "right" },

  // 4. TOTALS & FOOTER
  footerWrapper: {
    paddingTop: 10,
  },
  totalsRowWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  totalsCard: {
    width: 220,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 4,
    fontSize: 8,
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#64748b",
  },
  amountDueRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderTopColor: "#0f172a",
    paddingTop: 6,
    marginTop: 4,
  },
  amountDueLabel: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  amountDueValue: {
    fontSize: 13,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
  },

  // Bank, Terms & Thank You
  bankTermsSignoffGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
  },
  leftPaymentTermsBox: {
    width: "60%",
    gap: 8,
  },
  sectionHeading: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  paymentCard: {
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 7,
    gap: 2,
  },
  qrContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  qrImage: {
    width: 44,
    height: 44,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  thankYouText: {
    fontSize: 26,
    fontFamily: "Roboto",
    color: "#cbd5e1",
    textAlign: "right",
  },
  watermarkText: {
    textAlign: "center",
    fontSize: 6,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 16,
  },
} satisfies Parameters<typeof StyleSheet.create>[0];

const styles = StyleSheet.create(pdfStyles);

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function ModernPdf({ data }: PdfTemplateProps) {
  const { owner, customer, optional, items, config, totals } = data;
  const { mode, txnType, taxConfig, currency } = config;

  // Currency resolution: Always fallback to "₹" for India mode and valid symbol/code for International
  const sym: string = mode === "india" ? "₹" : currency?.symbol || "$";
  const locale: string = mode === "india" ? "en-IN" : currency?.locale || "en-US";
  const fmt = (n: string | number | undefined | null) => fmtNum(n, locale);

  return (
    <Document title={`Invoice-${customer.InvoiceNo || "draft"}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* TOP SECTION */}
          <View>
            {/* 1. EDITORIAL CENTERED HEADER */}
            <View style={styles.header}>
              <View style={styles.headerBorderBox}>
                <Text style={styles.titleMain}>
                  {owner.CompanyName || "CIRCLE"}
                </Text>
              </View>

              {/* Company Contact */}
              <View style={styles.contactSubHeader}>
                <Text>{owner.CompanyMail || "contact@company.com"}</Text>
                {owner.PhNo ? <Text>•</Text> : null}
                {owner.PhNo ? <Text>{owner.PhNo}</Text> : null}
                {owner.TaxDetail ? <Text>•</Text> : null}
                {owner.TaxDetail ? (
                  <Text style={styles.contactGstin}>
                    GSTIN: {owner.TaxDetail}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* 2. INFO GRID */}
            <View style={styles.infoGrid}>
              <View style={styles.issuedToCol}>
                <Text style={styles.gridTitle}>Issued To:</Text>
                <Text style={styles.customerName}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={styles.customerAddress}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
              </View>

              <View style={styles.invoiceDetailsCol}>
                <Text style={styles.gridTitle}>Invoice Details:</Text>
                <Text style={styles.invoiceNoText}>
                  #{customer.InvoiceNo || "INV-001"}
                </Text>
                <Text style={styles.metaText}>
                  Date:{" "}
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1e293b" }}>
                    {customer.IssueDate || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.metaText}>
                  Due:{" "}
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1e293b" }}>
                    {customer.DueDate || "Upon Receipt"}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.metaText,
                    { fontSize: 7, color: "#94a3b8", textTransform: "uppercase" },
                  ]}
                >
                  Currency: {mode === "india" ? "INR" : currency?.code || "USD"}
                </Text>
              </View>
            </View>

            {/* 3. TABLE SECTION */}
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

                <Text style={styles.colTotal}>Total</Text>
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

          {/* BOTTOM SECTION */}
          <View style={styles.footerWrapper}>
            {/* TOTALS SUMMARY BLOCK */}
            <View style={styles.totalsRowWrapper}>
              <View style={styles.totalsCard}>
                <View style={styles.totalsRow}>
                  <Text>Subtotal</Text>
                  <Text>
                    {sym}{fmt(totals.subTotal)}
                  </Text>
                </View>

                {mode === "india" && (
                  <>
                    {txnType === "intra" ? (
                      <>
                        <View style={[styles.totalsRow, { color: "#0f766e" }]}>
                          <Text>CGST Total</Text>
                          <Text>
                            {sym}{fmt(totals.totalCgst)}
                          </Text>
                        </View>
                        <View style={[styles.totalsRow, { color: "#0f766e" }]}>
                          <Text>SGST Total</Text>
                          <Text>
                            {sym}{fmt(totals.totalSgst)}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={[styles.totalsRow, { color: "#4338ca" }]}>
                        <Text>IGST Total</Text>
                        <Text>
                          {sym}{fmt(totals.totalIgst)}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {mode === "international" && (
                  <View style={styles.totalsRow}>
                    <Text>
                      {taxConfig?.name || "Tax"} ({taxConfig?.rate || "0"}%)
                    </Text>
                    <Text>
                      {sym}{fmt(totals.totalTax)}
                    </Text>
                  </View>
                )}

                <View style={styles.amountDueRow}>
                  <Text style={styles.amountDueLabel}>Amount Due</Text>
                  <Text style={styles.amountDueValue}>
                    {sym}{fmt(totals.Total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* BANK DETAILS, TERMS & THANK YOU SIGN-OFF */}
            <View style={styles.bankTermsSignoffGrid}>
              <View style={styles.leftPaymentTermsBox}>
                <View>
                  <Text style={styles.sectionHeading}>Payment Instructions</Text>
                  {owner.paymentMethod === "Bank" ? (
                    <View style={styles.paymentCard}>
                      <Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Bank: </Text>
                        {owner.BankName || "—"}
                      </Text>
                      <Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Account: </Text>
                        {owner.OwnerName || "—"}
                      </Text>
                      <Text>
                        <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>No: </Text>
                        {owner.AccountNumber || "—"} ({owner.BankCode || "—"})
                      </Text>
                    </View>
                  ) : owner.QR ? (
                    <View style={styles.qrContainer}>
                      <Image src={owner.QR} style={styles.qrImage} />
                      <Text
                        style={{
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          fontSize: 9,
                          color: "#0f766e",
                        }}
                      >
                        {owner.UPIID || "—"}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={{ fontSize: 7, color: "#94a3b8" }}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      { fontSize: 6, color: "#475569" },
                    ]}
                  >
                    Notes & Terms
                  </Text>
                  <Text style={{ fontStyle: "italic" }}>
                    {optional.termsConditions || "Please settle payment within the due date."}
                  </Text>
                  {optional.additionalInfo ? (
                    <Text style={{ marginTop: 2 }}>{optional.additionalInfo}</Text>
                  ) : null}
                </View>
              </View>

              <Text style={styles.thankYouText}>Thank You</Text>
            </View>

            <Text style={styles.watermarkText}>
              Generated via luen.in • {owner.CompanyName || "Circle"} Studio
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}