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

// ─── TYPE-SAFE STYLES (MATCHED TO SLATE PDF DESIGN) ──────────────────────────

const pdfStyles = {
  page: {
    width: "210mm",
    height: "297mm",
    paddingTop: 0,
    paddingBottom: 20,
    paddingRight: 0,
    paddingLeft: 0,
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
    bottom: 0,
    width: "10mm",
    backgroundColor: "#134e4a", // teal-900
  },
  contentArea: {
    marginLeft: "10mm",
    paddingHorizontal: 30,
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
    marginBottom: 18,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  brandCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
  },
  brandRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  logoImage: {
    width: 34,
    height: 34,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#042f2e", // teal-950
    textTransform: "uppercase",
  },
  companyCategory: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f766e", // teal-700
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  registeredOfficeLabel: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#334155",
    textTransform: "uppercase",
  },
  companyContactText: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.3,
  },
  gstinText: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#115e59", // teal-800
    textTransform: "uppercase",
    marginTop: 2,
  },

  // Header Right: Invoice Watermark Meta
  invoiceMetaRight: {
    alignItems: "flex-end",
    position: "relative",
  },
  watermarkInv: {
    fontSize: 42,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#f1f5f9",
    letterSpacing: -2,
    opacity: 0.8,
  },
  invoiceNoOverlay: {
    marginTop: -22,
    alignItems: "flex-end",
  },
  invoiceNoText: {
    fontSize: 18,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#0f172a",
  },
  metaDatesBox: {
    marginTop: 8,
    gap: 4,
    alignItems: "flex-end",
  },
  dateItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateLabel: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  issueDatePill: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#134e4a",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#ccfbf1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  dueDatePill: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#9f1239",
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#ffe4e6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  // 2. CLIENT DETAILS SECTION
  clientSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 15,
  },
  clientCol: {
    width: "48%",
  },
  sectionTitleUnderlined: {
    fontSize: 7,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: "#115e59",
    width: 14,
    paddingBottom: 2,
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
    color: "#475569",
    lineHeight: 1.3,
  },
  subjectText: {
    fontSize: 8,
    color: "#334155",
    lineHeight: 1.3,
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
  colDesc: { flex: 3 },
  colHsn: { width: 45, textAlign: "center" },
  colQty: { width: 38, textAlign: "center" },
  colRate: { width: 55, textAlign: "right" },
  colTax: { width: 48, textAlign: "right" },
  colTotal: { width: 65, textAlign: "right" },

  // 4. BOTTOM SECTION: PAYMENT & TOTALS
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

  // Dark Total Summary Box
  totalsCardDark: {
    width: "42%",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: 12,
    borderRadius: 6,
    gap: 4,
  },
  summaryRowDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
  grandTotalRowDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalLabelDark: {
    fontSize: 8,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#2dd4bf", // teal-400
    textTransform: "uppercase",
  },
  grandTotalValueDark: {
    fontSize: 16,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ffffff",
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
} satisfies Parameters<typeof StyleSheet.create>[0];

const styles = StyleSheet.create(pdfStyles);

// ─── DOCUMENT COMPONENT ───────────────────────────────────────────────────────

export default function SlatePdf({ data }: PdfTemplateProps) {
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
        {/* Left Side Teal Vertical Accent Bar */}
        <View style={styles.accentBar} />

        <View style={styles.contentArea}>
          {/* TOP SECTION */}
          <View>
            {/* 1. HEADER */}
            <View style={styles.header}>
              <View style={styles.brandCol}>
                <View style={styles.brandRow}>
                  {owner.companyLogo ? (
                    <View style={styles.logoBox}>
                      <Image src={owner.companyLogo} style={styles.logoImage} />
                    </View>
                  ) : null}
                  <View>
                    <Text style={styles.companyName}>
                      {owner.CompanyName || "YOUR COMPANY NAME"}
                    </Text>
                    <Text style={styles.companyCategory}>
                      Professional Services
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 1 }}>
                  <Text style={styles.registeredOfficeLabel}>
                    Registered Office:
                  </Text>
                  <Text style={styles.companyContactText}>
                    {owner.CompanyAddress || "123 Street, City, Country"}
                  </Text>
                  <Text style={styles.companyContactText}>
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

              {/* Invoice Meta Right */}
              <View style={styles.invoiceMetaRight}>
                <Text style={styles.watermarkInv}>INV</Text>
                <View style={styles.invoiceNoOverlay}>
                  <Text style={styles.invoiceNoText}>
                    #{customer.InvoiceNo || "INV-001"}
                  </Text>
                  <View style={styles.metaDatesBox}>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Issue Date:</Text>
                      <Text style={styles.issueDatePill}>
                        {customer.IssueDate || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateLabel}>Due Date:</Text>
                      <Text style={styles.dueDatePill}>
                        {customer.DueDate || "Upon Receipt"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* 2. CLIENT DETAILS SECTION */}
            <View style={styles.clientSection}>
              <View style={styles.clientCol}>
                <Text style={styles.sectionTitleUnderlined}>To</Text>
                <Text style={styles.customerName}>
                  {customer.CustomerName || "Client Name"}
                </Text>
                <Text style={styles.customerAddress}>
                  {customer.CustomerAddress || "Client Address"}
                </Text>
              </View>

              <View style={styles.clientCol}>
                {customer.Subject ? (
                  <>
                    <Text style={styles.sectionTitleUnderlined}>Re</Text>
                    <Text style={styles.subjectText}>{customer.Subject}</Text>
                  </>
                ) : null}
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
                    <Text
                      style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1e293b" }}
                    >
                      {item.description || "—"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 6,
                        color: "#94a3b8",
                        marginTop: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.unit || "Services"}
                    </Text>
                  </View>

                  {mode === "india" && (
                    <Text style={[styles.colHsn, { color: "#94a3b8" }]}>
                      {item.hsn || "—"}
                    </Text>
                  )}
                  <Text style={styles.colQty}>{item.qty || "0"}</Text>
                  <Text style={styles.colRate}>
                    {sym}
                    {fmt(item.rate)}
                  </Text>

                  {mode === "india" && txnType === "intra" && (
                    <>
                      <Text style={[styles.colTax, { color: "#0f766e" }]}>
                        {sym}
                        {fmt(item.cgst)}
                      </Text>
                      <Text style={[styles.colTax, { color: "#0f766e" }]}>
                        {sym}
                        {fmt(item.sgst)}
                      </Text>
                    </>
                  )}
                  {mode === "india" && txnType === "inter" && (
                    <Text style={[styles.colTax, { color: "#4338ca" }]}>
                      {sym}
                      {fmt(item.igst)}
                    </Text>
                  )}
                  {mode === "international" && (
                    <Text style={styles.colTax}>
                      {parseFloat(taxConfig?.rate || "0") > 0
                        ? `${sym}${fmt(item.taxAmt)}`
                        : "—"}
                    </Text>
                  )}

                  <Text
                    style={[styles.colTotal, { fontFamily: "Roboto", fontWeight: "bold" }]}
                  >
                    {sym}
                    {fmt(item.amt)}
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
                <Text style={styles.sectionTitle}>Payment Profile</Text>
                {owner.paymentMethod === "Bank" ? (
                  <View style={styles.bankCard}>
                    <View style={styles.bankRow}>
                      <Text style={{ color: "#94a3b8" }}>Payee:</Text>
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
                ) : owner.QR ? (
                  <View style={styles.qrCard}>
                    <Image src={owner.QR} style={styles.qrImage} />
                    <View>
                      <Text
                        style={[
                          styles.sectionTitle,
                          { color: "#94a3b8", marginBottom: 2 },
                        ]}
                      >
                        UPI Transfer
                      </Text>
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
                  </View>
                ) : null}
              </View>

              {/* Total Calculation Dark Box */}
              <View style={styles.totalsCardDark}>
                <View style={styles.summaryRowDark}>
                  <Text>Net Amount</Text>
                  <Text style={{ color: "#ffffff" }}>
                    {sym}
                    {fmt(totals.subTotal)}
                  </Text>
                </View>

                {mode === "india" && (
                  <>
                    {txnType === "intra" ? (
                      <>
                        <View
                          style={[styles.summaryRowDark, { color: "#2dd4bf" }]}
                        >
                          <Text>CGST</Text>
                          <Text>
                            {sym}
                            {fmt(totals.totalCgst)}
                          </Text>
                        </View>
                        <View
                          style={[styles.summaryRowDark, { color: "#2dd4bf" }]}
                        >
                          <Text>SGST</Text>
                          <Text>
                            {sym}
                            {fmt(totals.totalSgst)}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View
                        style={[styles.summaryRowDark, { color: "#818cf8" }]}
                      >
                        <Text>IGST</Text>
                        <Text>
                          {sym}
                          {fmt(totals.totalIgst)}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {mode === "international" && (
                  <View style={styles.summaryRowDark}>
                    <Text>
                      {taxConfig?.name || "Tax"} ({taxConfig?.rate || "0"}%)
                    </Text>
                    <Text>
                      {sym}
                      {fmt(totals.totalTax)}
                    </Text>
                  </View>
                )}

                <View style={styles.grandTotalRowDark}>
                  <Text style={styles.grandTotalLabelDark}>Total Due</Text>
                  <Text style={styles.grandTotalValueDark}>
                    {sym}
                    {fmt(totals.Total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Legal / Notes */}
            <View style={styles.legalGrid}>
              <View style={styles.legalCol}>
                <Text style={styles.sectionTitle}>Terms of Service</Text>
                <Text style={{ color: "#94a3b8" }}>
                  {optional.termsConditions ||
                    "Payment is due upon receipt. Please include the invoice number in your transfer notes."}
                </Text>
              </View>

              <View style={[styles.legalCol, { textAlign: "right" }]}>
                <Text style={styles.sectionTitle}>Notice</Text>
                <Text>
                  {optional.additionalInfo ||
                    "Thank you for partnering with us for your creative solutions."}
                </Text>
                <Text style={{ fontSize: 6, color: "#cbd5e1", marginTop: 4 }}>
                  Generated via luen.in • {owner.CompanyName || "Invoice"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}