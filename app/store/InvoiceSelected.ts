import {create} from "zustand"

  interface Options {
    name : string
    handler : (name : string)=>void
  }
export const useInvoiceSelect = create<Options>((set)=>({
    name : "",
    handler : (name : string)=>{
        set({
            name : name
        })
    }
    
}))