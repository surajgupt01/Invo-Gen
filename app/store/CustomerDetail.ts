import { create } from "zustand";

type CustomerDetails = {
  CustomerName: string;
  CustomerAddress: string;
  DueDate: string;
  IssueDate : string;
  InvoiceNo: string;
  Currency: string;
  Subject : string
};

type CustomerStore = {
  Details: CustomerDetails;
  DetailHandler: (name: keyof CustomerDetails , value: string) => void;
};
export const useCustomerStore = create<CustomerStore>((set) => ({
  Details: {
    CustomerName: "",
    CustomerAddress: "",
    DueDate: "",
    IssueDate : "",
    InvoiceNo: "",
    Currency: "",
    Subject : ""
  },

  DetailHandler: (name: string, value: string) => {
    set((state) => ({
      Details: {
        ...state.Details,
        [name]: value,
      },
    }));
  },
}));
