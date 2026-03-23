import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

const isLocal = process.env.NODE_ENV === "development";
let browser: Browser | undefined;
let tailwindCSS: string | null = null;

// ✅ Read from local file — no network, no 404s
const getTailwindCSS = () => {
  if (tailwindCSS) return tailwindCSS;
  tailwindCSS = fs.readFileSync(
    path.join(process.cwd(), "public/tailwind-pdf.css"),
    "utf-8"
  );
  console.log("Tailwind CSS length:", tailwindCSS.length); // should be large
  return tailwindCSS;
};

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    if (!browser?.connected) {
      browser = await puppeteer.launch(
        isLocal
          ? { channel: "chrome", headless: true }
          : {
              args: chromium.args,
              executablePath: await chromium.executablePath(),
              headless: true,
            }
      );
    }

    const css = getTailwindCSS(); // ✅ sync, no await needed

    const page = await browser.newPage();
    await page.emulateMediaType("print");

    await page.setContent(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>${css}</style>
          <style>
            body { background: white; color: black; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>${html}</body>
      </html>`,
      { waitUntil: "domcontentloaded", timeout: 30000 }
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      omitBackground: false,
      margin: { top: "10mm", bottom: "15mm", left: "5mm", right: "5mm" },
    });

    await page.close();

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", details: String(error) }),
      { status: 500 }
    );
  }
}