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

// ─── REGISTER UTF-8 COMPATIBLE FONT FOR CURRENCY SYMBOLS ─────────────────────
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

// ─── STYLES (MATCHED TO HTML PREVIEW DESIGN) ─────────────────────────────────

const styles = StyleSheet.create({
  page: {
    width: "210mm",
    height: "297mm",
    padding: 24,
    fontSize: 9,
    fontFamily: "Roboto",
    color: "#374151",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justify: "space-between",
    height: "100%",
  },

  // 1. HEADER SECTION
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db", // border-gray-300
    paddingBottom: 8,
  },
  companyIdentity: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: "#9ca3af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#9ca3af",
  },
  logoImage: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  companyDetails: {
    display: "flex",
    flexDirection: "column",
    fontSize: 8,
    color: "#6b7280",
    gap: 2,
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#4b5563",
  },
  invoiceTitleHeader: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 11,
    fontFamily: "Roboto",
    color: "#0d9488", // text-teal-600
  },
  invoiceNoText: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#000000",
  },

  // 2. BILL INFO SECTION
  billInfoGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 8,
  },
  billedToBox: {
    width: "48%",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 6,
  },
  billedToTitle: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
    fontSize: 8,
  },
  metaDatesBox: {
    width: "48%",
    alignItems: "flex-end",
    color: "#4b5563",
    gap: 3,
  },
  subjectBox: {
    marginTop: 8,
    padding: 4,
    fontSize: 8,
  },

  // 3. TABLE SECTION
  tableContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#374151",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 8,
  },

  // Dynamic Column Width Allocations
  colItem: { flex: 2 },
  colHsn: { flex: 0.8, textAlign: "center" },
  colUnit: { flex: 0.6, textAlign: "center" },
  colQty: { flex: 0.5, textAlign: "center" },
  colRate: { flex: 1, textAlign: "right" },
  colDisc: { flex: 0.6, textAlign: "center" },
  colTax: { flex: 0.9, textAlign: "right" },
  colAmount: { flex: 1.1, textAlign: "right" },

  // 4. TOTALS SECTION
  totalsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  totalsBox: {
    width: 200,
    gap: 4,
    fontSize: 8,
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#4b5563",
  },
  grandTotalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 6,
    marginTop: 4,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 10,
    color: "#111827",
  },

  // 5. PAYMENT DETAILS SECTION
  paymentSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  bankDetailsList: {
    fontSize: 8,
    color: "#4b5563",
    gap: 2,
  },
  qrContainer: {
    marginTop: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  qrImage: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: "#a3a3a3",
    padding: 2,
  },
  upiText: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#262626",
  },

  // 6. FOOTER SECTION
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    gap: 6,
  },
  footerBlock: {
    fontSize: 8,
    color: "#6b7280",
  },
  footerTitle: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#374151",
  },
});

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function ClassicPdf({ data }: PdfTemplateProps) {
  const { owner, customer, optional, items, config, totals } = data;
  const { mode, txnType, taxConfig, currency } = config;

  // Ensure absolute currency resolution matching useItemsStore specs
  const sym: string = mode === "india" ? "₹" : currency?.symbol || "$";
  const locale: string = mode === "india" ? "en-IN" : currency?.locale || "en-US";
  const fmt = (n: string | number | undefined | null) => fmtNum(n, locale);

  return (
    <Document title={`Invoice-INV-${customer.InvoiceNo || "draft"}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View>
            {/* ── 1. Header ────────────────────────────────────────────── */}
            <View style={styles.header}>
              <View style={styles.companyIdentity}>
                <View style={styles.logoBox}>
                  {owner.companyLogo ? (
                    <Image src={owner.companyLogo} style={styles.logoImage} />
                  ) : (
                    <Text style={styles.logoFallbackText}>
                      {owner.CompanyName?.charAt(0) || "N"}
                    </Text>
                  )}
                </View>

                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>
                    {owner.CompanyName || "COMPANY NAME"}
                  </Text>
                  <Text>Address : {owner.CompanyAddress || "—"}</Text>
                  <Text>Tax : {owner.TaxDetail || "—"}</Text>
                  <Text>email : {owner.CompanyMail || "—"}</Text>
                </View>
              </View>

              <View style={styles.invoiceTitleHeader}>
                <Text style={styles.invoiceTitle}>
                  Invoice{" "}
                  <Text style={styles.invoiceNoText}>
                    INV-{customer.InvoiceNo || "001"}
                  </Text>
                </Text>
              </View>
            </View>

            {/* ── 2. Bill Info ─────────────────────────────────────────── */}
            <View style={styles.billInfoGrid}>
              <View style={styles.billedToBox}>
                <Text style={styles.billedToTitle}>Billed To</Text>
                <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#111827" }}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={{ color: "#4b5563", marginTop: 2 }}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
              </View>

              <View style={styles.metaDatesBox}>
                <Text>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Invoice Date: </Text>
                  {customer.IssueDate || "N/A"}
                </Text>
                <Text>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Due Date: </Text>
                  {customer.DueDate || "N/A"}
                </Text>
                <Text>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Currency: </Text>
                  {mode === "india"
                    ? "INR (₹)"
                    : `${currency?.code || "USD"} (${currency?.symbol || "$"})`}
                </Text>
                {mode === "india" && (
                  <Text>
                    <Text style={{ fontFamily: "Roboto", fontWeight: "bold" }}>Transaction: </Text>
                    {txnType === "intra"
                      ? "Intrastate"
                      : txnType === "inter"
                      ? "Interstate"
                      : "Export / Exempt"}
                  </Text>
                )}
              </View>
            </View>

            {/* Subject */}
            {customer.Subject ? (
              <View style={styles.subjectBox}>
                <Text>
                  <Text style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#111827" }}>
                    Subject -{" "}
                  </Text>
                  {customer.Subject}
                </Text>
              </View>
            ) : null}

            {/* ── 3. Items Table ───────────────────────────────────────── */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.colItem}>Item</Text>

                {mode === "india" && <Text style={styles.colHsn}>HSN/SAC</Text>}

                <Text style={styles.colUnit}>Unit</Text>
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colRate}>Rate</Text>
                <Text style={styles.colDisc}>Disc%</Text>

                {/* Tax Columns */}
                {mode === "india" && txnType === "intra" && (
                  <>
                    <Text style={[styles.colTax, { color: "#0f766e" }]}>CGST</Text>
                    <Text style={[styles.colTax, { color: "#0f766e" }]}>SGST</Text>
                  </>
                )}
                {mode === "india" && txnType === "inter" && (
                  <Text style={[styles.colTax, { color: "#2563eb" }]}>IGST</Text>
                )}
                {mode === "india" && txnType === "export" && (
                  <Text style={[styles.colTax, { color: "#9ca3af" }]}>Tax</Text>
                )}
                {mode === "international" && (
                  <Text style={[styles.colTax, { color: "#d97706" }]}>
                    {taxConfig?.name || "Tax"}{" "}
                    {parseFloat(taxConfig?.rate || "0") > 0 ? `(${taxConfig?.rate}%)` : ""}
                  </Text>
                )}

                <Text style={styles.colAmount}>Amount</Text>
              </View>

              {items.map((item, idx: number) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.colItem}>{item.description || "—"}</Text>

                  {mode === "india" && (
                    <Text style={[styles.colHsn, { color: "#6b7280" }]}>
                      {item.hsn || "—"}
                    </Text>
                  )}

                  <Text style={[styles.colUnit, { color: "#6b7280" }]}>
                    {item.unit || "pcs"}
                  </Text>
                  <Text style={styles.colQty}>{item.qty || "0"}</Text>
                  <Text style={styles.colRate}>
                    {sym}{fmt(item.rate)}
                  </Text>
                  <Text style={[styles.colDisc, { color: "#6b7280" }]}>
                    {item.discount || "0"}%
                  </Text>

                  {/* Tax Values */}
                  {mode === "india" && txnType === "intra" && (
                    <>
                      <Text style={[styles.colTax, { color: "#0d9488" }]}>
                        {sym}{fmt(item.cgst)}
                      </Text>
                      <Text style={[styles.colTax, { color: "#0d9488" }]}>
                        {sym}{fmt(item.sgst)}
                      </Text>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <Text style={[styles.colTax, { color: "#3b82f6" }]}>
                      {sym}{fmt(item.igst)}
                    </Text>
                  )}
                  {mode === "india" && txnType === "export" && (
                    <Text style={[styles.colTax, { color: "#9ca3af" }]}>Exempt</Text>
                  )}
                  {mode === "international" && (
                    <Text style={[styles.colTax, { color: "#d97706" }]}>
                      {parseFloat(taxConfig?.rate || "0") > 0
                        ? `${sym}${fmt(item.taxAmt)}`
                        : "—"}
                    </Text>
                  )}

                  <Text style={[styles.colAmount, { fontFamily: "Roboto", fontWeight: "bold" }]}>
                    {sym}{fmt(item.amt)}
                  </Text>
                </View>
              ))}
            </View>

            {/* ── 4. Totals ────────────────────────────────────────────── */}
            <View style={styles.totalsWrapper}>
              <View style={styles.totalsBox}>
                <View style={styles.totalsRow}>
                  <Text>Subtotal</Text>
                  <Text>{sym}{fmt(totals.subTotal)}</Text>
                </View>

                {mode === "india" && txnType === "intra" && (
                  <>
                    <View style={[styles.totalsRow, { color: "#0d9488" }]}>
                      <Text>CGST</Text>
                      <Text>{sym}{fmt(totals.totalCgst)}</Text>
                    </View>
                    <View style={[styles.totalsRow, { color: "#0d9488" }]}>
                      <Text>SGST</Text>
                      <Text>{sym}{fmt(totals.totalSgst)}</Text>
                    </View>
                  </>
                )}

                {mode === "india" && txnType === "inter" && (
                  <View style={[styles.totalsRow, { color: "#3b82f6" }]}>
                    <Text>IGST</Text>
                    <Text>{sym}{fmt(totals.totalIgst)}</Text>
                  </View>
                )}

                {mode === "india" && txnType === "export" && (
                  <View style={[styles.totalsRow, { color: "#9ca3af" }]}>
                    <Text>Tax</Text>
                    <Text>Exempt / 0%</Text>
                  </View>
                )}

                {mode === "international" && parseFloat(taxConfig?.rate || "0") > 0 && (
                  <View style={[styles.totalsRow, { color: "#d97706" }]}>
                    <Text>
                      {taxConfig?.name || "Tax"} ({taxConfig?.rate}%)
                    </Text>
                    <Text>{sym}{fmt(totals.totalTax)}</Text>
                  </View>
                )}
                {mode === "international" && parseFloat(taxConfig?.rate || "0") === 0 && (
                  <View style={[styles.totalsRow, { color: "#9ca3af" }]}>
                    <Text>{taxConfig?.name || "Tax"}</Text>
                    <Text>Exempt / 0%</Text>
                  </View>
                )}

                <View style={styles.grandTotalRow}>
                  <Text>Total</Text>
                  <Text>{sym}{fmt(totals.Total)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── 5. Payment Details ─────────────────────────────────────── */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionHeading}>PAYMENT DETAILS</Text>
            {owner.paymentMethod === "Bank" ? (
              <View style={styles.bankDetailsList}>
                <Text>
                  <Text style={{ color: "#374151" }}>Owner Name : </Text>
                  {owner.OwnerName || "—"}
                </Text>
                <Text>
                  <Text style={{ color: "#111827" }}>Account Number : </Text>
                  {owner.AccountNumber || "—"}
                </Text>
                <Text>
                  <Text style={{ color: "#111827" }}>Bank Name : </Text>
                  {owner.BankName || "—"}
                </Text>
                <Text>
                  <Text style={{ color: "#111827" }}>Bank Address : </Text>
                  {owner.BankAddress || "—"}
                </Text>
                <Text>
                  <Text style={{ color: "#111827" }}>Bank Code : </Text>
                  {owner.BankCode || "—"}
                </Text>
                <Text>
                  <Text style={{ color: "#111827" }}>Ph : </Text>
                  {owner.PhNo || "—"}
                </Text>
              </View>
            ) : (
              owner.QR && (
                <View style={styles.qrContainer}>
                  <Image src={owner.QR} style={styles.qrImage} />
                  <Text style={styles.upiText}>
                    UPI-ID : {owner.UPIID || "—"}
                  </Text>
                </View>
              )
            )}
          </View>

          {/* ── 6. Footer ──────────────────────────────────────────────── */}
          <View style={styles.footer}>
            <View style={styles.footerBlock}>
              <Text style={styles.footerTitle}>Additional Information</Text>
              <Text style={{ marginTop: 2 }}>{optional.additionalInfo || "—"}</Text>
            </View>
            <View style={[styles.footerBlock, { marginTop: 4 }]}>
              <Text style={styles.footerTitle}>Terms & Conditions</Text>
              <Text style={{ marginTop: 2 }}>{optional.termsConditions || "—"}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}