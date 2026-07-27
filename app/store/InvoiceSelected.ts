import { create } from "zustand";

// 1. Define the state & action interface
interface InvoiceSelectState {
  selectedTemplate: string; // <--- Add this property
  handler: (templateId: string) => void;
}

// 2. Pass the interface to create()
export const useInvoiceSelect = create<InvoiceSelectState>((set) => ({
  selectedTemplate: "classic", // Default initial template
  handler: (templateId) =>
    set(() => ({
      selectedTemplate: templateId,
    })),
}));