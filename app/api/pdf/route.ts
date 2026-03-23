import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

const isLocal = process.env.NODE_ENV === "development";
let browser: Browser | undefined;

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    // Reuse browser across requests
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

    const page = await browser.newPage();
    await page.emulateMediaType("print");

    await page.setContent(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: white; color: black; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>${html}</body>
      </html>`,
      { waitUntil: "networkidle0", timeout: 30000 }
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      omitBackground: false,
      margin: { top: "10mm", bottom: "15mm", left: "5mm", right: "5mm" },
    });

    // Close only this page, keep browser alive for reuse
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