// @/app/component/InvoicePdfDocument.tsx

import ClassicPdf from "@/app/component/ClassicPdf";
import ModernPdf from "@/app/component/ModernPdf";
import RegularPdf from "@/app/component/RegularPdf";
import TrendyPdf from "@/app/component/TrendyPdf";
import SassyPdf from "@/app/component/SassyPdf";
import SlatePdf from "@/app/component/SlatePdf";

export interface InvoicePdfData {
  owner: ReturnType<typeof import("@/app/store/OwnerDetail").useOwner.getState>["OwnerDetails"];
  customer: ReturnType<typeof import("@/app/store/CustomerDetail").useCustomerStore.getState>["Details"];
  optional: {
    additionalInfo: string;
    termsConditions: string;
  };
  items: ReturnType<typeof import("@/app/store/InvoiceTabel").useItemsStore.getState>["Items"];
  config: {
    mode: ReturnType<typeof import("@/app/store/InvoiceTabel").useItemsStore.getState>["mode"];
    txnType: ReturnType<typeof import("@/app/store/InvoiceTabel").useItemsStore.getState>["txnType"];
    currency: ReturnType<typeof import("@/app/store/InvoiceTabel").useItemsStore.getState>["currency"];
    taxConfig: ReturnType<typeof import("@/app/store/InvoiceTabel").useItemsStore.getState>["taxConfig"];
  };
  totals: {
    subTotal: number;
    totalCgst: number;
    totalSgst: number;
    totalIgst: number;
    totalTax: number;
    Total: number;
  };
}

export interface PdfTemplateProps {
  data: InvoicePdfData;
}

export interface InvoicePdfDocumentProps {
  data: InvoicePdfData;
  templateName: string;
}

const PDF_TEMPLATES: Record<string, React.ComponentType<PdfTemplateProps>> = {
  classic: ClassicPdf,
  modern: ModernPdf,
  regular: RegularPdf,
  trendy: TrendyPdf,
  sassy: SassyPdf,
  slate: SlatePdf, // <-- Matched to 'slate'
};

export default function InvoicePdfDocument({
  data,
  templateName,
}: InvoicePdfDocumentProps) {
  const activeKey = templateName ? templateName.toLowerCase() : "classic";
  const ActivePdfComponent = PDF_TEMPLATES[activeKey] || ClassicPdf;

  return <ActivePdfComponent data={data} />;
}