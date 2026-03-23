import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;

  try {
    const { html } = await req.json();

    // ✅ Important for Vercel stability
    chromium.setGraphicsMode = false;

    // ✅ Always use sparticuz chromium on Vercel
    const executablePath = await chromium.executablePath();

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // ✅ Set viewport manually
    await page.setViewport({
      width: 1280,
      height: 800,
    });

    // ✅ Wrap incoming HTML safely
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: white;
              color: black;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // ❗ Use "load" instead of networkidle (more reliable on Vercel)
    await page.setContent(fullHTML, {
      waitUntil: "load",
    });

    // ✅ Ensure proper rendering
    await page.emulateMediaType("screen");

    // ✅ Wait for fonts + layout
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 1000));

    // ✅ Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "10mm",
        bottom: "15mm",
        left: "5mm",
        right: "5mm",
      },
    });

    // 🔍 Debug (keep during testing)
    console.log("PDF size:", pdf?.length);

    if (!pdf || pdf.length < 1000) {
      throw new Error("Generated PDF is empty or corrupted");
    }

    // ✅ Return proper binary response
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
    if (browser) {
      await browser.close();
    }
  }
}