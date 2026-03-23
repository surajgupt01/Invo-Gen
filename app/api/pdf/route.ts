import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;

  try {
    const { html } = await req.json();

    chromium.setGraphicsMode = false;

    const chromeArgs = [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ];

    browser = await puppeteer.launch({
      args: chromeArgs,
      executablePath: await chromium.executablePath(),
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
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // ✅ Use setContent (your case)
    await page.setContent(fullHTML, {
      waitUntil: "load",
    });

    await page.emulateMediaType("print");

    // ✅ IMPORTANT: force render delay
    await new Promise((r) => setTimeout(r, 1500));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("PDF size:", pdf?.length);

    if (!pdf || pdf.length < 1000) {
      throw new Error("PDF generation failed (empty buffer)");
    }

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
  } finally {
    if (browser) await browser.close();
  }
}