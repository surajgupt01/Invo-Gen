<div align="center">

  <img src="https://raw.githubusercontent.com/surajgupt01/Invo-Gen/main/public/favicon.png" width="72" alt="Luen Logo" />

  # Luen

  **Production-grade invoice & billing platform with automated GST calculations, real-time document rendering, and high-fidelity PDF generation.**

  [![Website](https://img.shields.io/badge/Website-luen.in-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.luen.in/)
  [![GitHub Stars](https://img.shields.io/github/stars/surajgupt01/Invo-Gen?style=for-the-badge&logo=github&color=181717)](https://github.com/surajgupt01/Invo-Gen/stargazers)
  [![License: MIT](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

  <br />

  <p align="center">
    <a href="https://www.luen.in/"><strong>Explore Live Application »</strong></a>
    <br />
    <a href="#-product-demo">Video Demo</a> •
    <a href="#-architecture--tech-stack">System Architecture</a> •
    <a href="#-invoice-generation-flow">Data Flow</a> •
    <a href="#-key-capabilities">Key Capabilities</a> •
    <a href="#-getting-started">Local Setup</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

</div>

---

## ⚡ Overview

**Luen** is an open-source, high-performance invoice generation platform built to eliminate the overhead of bloated accounting software and error-prone spreadsheet templates. 

Engineered for precision and speed, it delivers zero-watermark, vector-sharp PDF documents with native support for statutory Indian tax compliance (**CGST / SGST / IGST**), cross-border **Letter of Undertaking (LUT) export billing**, dynamic **UPI QR codes**, and multi-currency conversions.

### Technical Highlights

- ⚡ **Zero-Latency State Sync:** Reactive Zustand store synchronizes form inputs, calculation formulas, and the live A4 preview without network roundtrips.
- 🇮🇳 **Statutory GST Engine:** Automated place-of-supply tax logic (intra-state vs. inter-state), HSN/SAC lookups, and reverse charge flags adhering strictly to Rule 46 of the CGST Act.
- 🌍 **Cross-Border Billing:** Section 16 IGST Act-compliant export invoicing in USD ($), EUR (€), GBP (£), and INR (₹).
- 🖨️ **Client/Server Vector PDF Engine:** High-performance PDF generation pipeline powered by `@react-pdf/renderer` for instant, pixel-perfect document downloads without heavy headless browser overhead.
- 🔒 **Privacy-Centric Architecture:** Operates with minimal persistent server storage, eliminating unwanted data leakage of sensitive financial records.

---

## 🎥 Product Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=ubclSFQkqO8" target="_blank">
    <img 
      src="https://img.youtube.com/vi/ubclSFQkqO8/maxresdefault.jpg" 
      alt="Luen Product Demo & Architecture Walkthrough" 
      width="800"
      style="border-radius: 8px; border: 1px solid #e4e4e7;"
    />
  </a>
  <p align="center">
    <sub>Click the preview image above to watch the end-to-end walkthrough on YouTube.</sub>
  </p>
</div>

---

## ✨ Key Capabilities

| Capability | Description |
| :--- | :--- |
| **Statutory Tax Engine** | Automatically computes intra-state (`CGST + SGST`) and inter-state (`IGST`) distributions based on vendor and client GSTIN states. |
| **Cross-Border Invoicing** | Handles zero-rated export invoicing under LUT (Letter of Undertaking) declaration pursuant to Section 16 of the IGST Act. |
| **Dynamic UPI QR Codes** | Generates standard UPI payment intents (Google Pay, PhonePe, Paytm, BHIM) embedded directly onto the PDF for frictionless domestic settlement. |
| **Reactive Calculation Matrix** | Client-side calculations for multi-tiered item rates, volume discounts, line-item taxes, and round-offs without page recalculation lag. |
| **Pixel-Perfect Vector Export** | Produces crisp, zero-watermark, standard A4 vector PDFs matching exact print layout specs. |

---

## 🏗️ Architecture & Tech Stack

Luen is architected around isolated layers for state, computation, presentation, and vector document generation to ensure modularity and ease of testing.

### Technology Matrix

| Layer | Technology | Engineering Role |
| :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | Server & Client component orchestration, route layouts |
| **Core** | [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) | Type-safe declarative UI state and structured data contracts |
| **Styling & Primitives** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) | Accessible Radix UI primitives with responsive utility styling |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, non-blocking centralized invoice store |
| **Document Rendering** | [@react-pdf/renderer](https://react-pdf.org/) | Declarative React-based vector PDF generation engine |

---

## 🔄 Invoice Generation Flow

```text
┌──────────────────────┐
│    Invoice Editor    │
│                      │
│ Business / Client    │
│ Items / Taxes        │
│ Payment Details      │
└──────────┬───────────┘
           │ (Reactive Action Dispatch)
           ▼
┌──────────────────────┐
│    Zustand Store     │
│                      │
│ Centralized Invoice  │
│ State Tree           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Calculation Engine  │
│                      │
│ Subtotal & Discounts │
│ CGST / SGST / IGST   │
│ Exchange & Total     │
└──────────┬───────────┘
           │
           ├─────────────────────────┐
           ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│     Live Preview     │  │   React-PDF Engine   │
│                      │  │                      │
│ Real-Time DOM Sheet  │  │ Declarative Layout   │
└──────────────────────┘  └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │    A4 Vector PDF     │
                          │   (Instant Export)   │
                          └──────────────────────┘
