import { ReactNode } from "react"

interface LogoProp{
    tempelate : ReactNode,
    PDF : ReactNode,
    History : ReactNode,
    share : ReactNode
  }
interface Prop {

  logo : keyof LogoProp,
  curr:string,
  title : string,
  desc : string

  
}
export const Descriptions: Prop[] = [
  {
    logo: "tempelate",
    curr: "Rupee",
    title: "Professional Templates",
    desc: "Beautiful, customizable invoice templates that make your business look professional.",
  },
  {
    logo: "PDF",
    curr: "Euro",
    title: "PDF Export",
    desc: "Generate high-quality PDF invoices ready for printing or email delivery.",
  },
  {
    logo: "share",
    curr: "Dollar",
    title: "Easy Sharing",
    desc: "Share invoices via unique links or download them directly to your device.",
  },
  {
    logo: "History",
    curr: "Yen",
    title: "Invoice History",
    desc: "Keep track of all your invoices with our comprehensive history dashboard.",
  },
];
