import { create } from "zustand";

export type CustomerDetails = {
  CustomerName: string;
  CustomerEmail: string;
  CustomerAddress: string;
  DueDate: string;
  IssueDate: string;
  InvoiceNo: string;
  Currency: string;
  Subject: string;
};

type CustomerStore = {
  Details: CustomerDetails;
  DetailHandler: (name: keyof CustomerDetails, value: string) => void;
  ResetCustomerDetails: () => void;
};

const initialDetails: CustomerDetails = {
  CustomerName: "",
  CustomerEmail: "",
  CustomerAddress: "",
  DueDate: "",
  IssueDate: "",
  InvoiceNo: "",
  Currency: "INR",
  Subject: "",
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  Details: initialDetails,

  DetailHandler: (name, value) => {
    set((state) => ({
      Details: {
        ...state.Details,
        [name]: value,
      },
    }));
  },

  ResetCustomerDetails: () => {
    set({ Details: initialDetails });
  },
}));