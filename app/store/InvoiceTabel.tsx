import { create } from "zustand";

type ItemsDetail = {
  description: string;
  qty: string;
  rate: string;
  discount: string;
  amt: string;
};

type InputKey = "description" | "qty" | "rate" | "discount";

type StoreComponents = {
  Total : number
  Tax :  number
  subTotal : number
  Items: ItemsDetail[];
  TaxHandler : (Tax : number)=>void
  changeHandler: (key: InputKey, index: number, value: string) => void;
  addRow: () => void;
  delRow: (idx: number) => void;
};

export const ItemsStore = create<StoreComponents>((set,get) => ({
  Total: 0,
  Tax :  0,
  subTotal : 0,
  Items: [{ description: "", qty: "", rate: "", discount: "", amt: "" }],
  TaxHandler : (Tax) => { 
      const subTotal = get().subTotal  // 👈 read current subTotal
  const taxAmount = (subTotal * Tax) / 100
  const Total = subTotal + taxAmount
  set({ Tax, Total })  // 👈 update Tax AND Total together
  },
    
  changeHandler: (key: InputKey, index: number, value: string) => {
    set((state) => {
      const Items = [...state.Items];
      const item = { ...Items[index] };
      
      item[key] = value;

      const rate = Number(item.rate);
      const qty = Number(item.qty);
      const discount = Number(item.discount);

      if (!isNaN(rate) && !isNaN(qty) && !isNaN(discount)) {
        const total = rate * qty;
        const discountAmount = (total * discount) / 100;
        item.amt = (total - discountAmount).toFixed(2);
      } else {
        item.amt = "";
      }

      Items[index] = item;
      const subTotal = Items.reduce((accum , it)=> (accum + Number(it.amt) || 0) , 0)
      const Tax = get().Tax
      const taxamount  = (subTotal*Tax)/100
      const Total = subTotal + taxamount
      return { Items , Total , subTotal };
    });
  },

  addRow: () => {
    set((state) => {
      const Items = [...state.Items];
      Items.push({ description: "", qty: "", rate: "", discount: "", amt: "" });
      // const Total = Items.reduce((accum , it)=> (accum + Number(it.amt) || 0) , 0)
      return { Items};
    });
  },
  delRow: (idx) => {
    set((state) => {
      let Items = [...state.Items];

      Items = Items.filter((_, index) => idx != index);
      const Total = Items.reduce((accum , it)=> (accum + Number(it.amt) || 0) , 0)

      return { Items , Total };
    });
  },
}));
