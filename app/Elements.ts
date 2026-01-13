import { ReactNode } from "react"

interface LogoProp{
    template : ReactNode,
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
    logo: "template",
    curr: "Rupee",
    title: "Professional Templates",
    desc: "Choose from clean, modern invoice templates designed to look professional across industries. Customize layout, colors, and branding so every invoice reflects your business identity and builds client trust.",
  },
  {
    logo: "PDF",
    curr: "Euro",
    title: "PDF Export",
    desc: "Generate high-quality, print-ready PDF invoices instantly. Perfect for email delivery, offline sharing, and official record-keeping.",
  },
  {
    logo: "share",
    curr: "Dollar",
    title: "Easy Sharing",
    desc: "Share invoices effortlessly using secure links, or download them directly to your device. Send invoices to clients in seconds without attachments or formatting issues.",
  },
  {
    logo: "History",
    curr: "Yen",
    title: "Invoice History",
    desc: "Access a complete history of all your invoices in one place. Track issued, paid, and pending invoices, review past records, and manage your billing workflow with clarity as your business grows.",
  },
];
