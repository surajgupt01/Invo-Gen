import { create } from "zustand";


// type PaymentMethods = 'Bank' | 'UPI'
interface Owner {
  CompanyName: string;
  CompanyAddress: string;
  TaxDetail: string;
  CompanyMail: string;
  OwnerName: string;
  PhNo: string;
  AccountNumber: string;
  BankName: string;
  BankCode: string;
  BankAddress: string;
  paymentMethod : string
  QR : string,
  UPIID : string,
  companyLogo : string
}

type OwnerStore = {
  OwnerDetails: Owner;
  OwnerDetailHandler: (name: keyof Owner, value: string) => void;
};


export const useOwner = create<OwnerStore>((set) => ({
  OwnerDetails: {
    CompanyName: "",
    CompanyAddress: "",
    CompanyMail : "",
    TaxDetail : "",
    OwnerName: "",
    PhNo: "",
    AccountNumber: "",
    BankName: "",
    BankCode: "",
    BankAddress: "",
    paymentMethod : '',
    QR : '',
    UPIID : '',
    companyLogo : ''

  },
  OwnerDetailHandler: (name: keyof Owner, value: string) => {
    set((state) => ({
      OwnerDetails: {
        ...state.OwnerDetails,
        [name]: value,
      },
    }));
  },
}));
