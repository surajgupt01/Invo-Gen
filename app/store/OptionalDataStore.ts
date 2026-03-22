import { create } from "zustand";

type OptionalData = {
  AdditionalInfo: string;
  TermsConditions: string;
  HandleInfo: (AddInfo: string) => void;
  HandleTerms: (Terms: string) => void;
};

export const useOptionalData = create<OptionalData>((set) => ({
  AdditionalInfo: "",
  TermsConditions: "",
  HandleInfo: (AddInfo: string) => {
    set({
      AdditionalInfo: AddInfo,
    });
  },
  HandleTerms: (Terms: string) => {
    set({ TermsConditions: Terms });
  },
}));
