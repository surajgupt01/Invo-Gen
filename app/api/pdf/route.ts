import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    chromium.setGraphicsMode = false;

    const executablePath =
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath()
        : undefined;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
    });

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              background: white;
              color: black;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;

    await page.setContent(fullHTML, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    await page.evaluateHandle("document.fonts.ready");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "15mm",
        left: "5mm",
        right: "5mm",
      },
    });

    await browser.close();

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate PDF",
        details: String(error),
      }),
      { status: 500 }
    );
  }
}