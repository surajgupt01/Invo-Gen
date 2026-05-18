import { chromium } from "playwright";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  let browser;

  try {
    const { html } = await req.json();

    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>

          <style>
            body {
              background: white;
              
              font-family: Arial, sans-serif;
            }
          </style>
        </head>

        <body>
          ${html}
        </body>
      </html>
      `,
      {
        waitUntil: "networkidle",
      }
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new Response( new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF Error:", error);

    return Response.json(
      {
        error: "Failed to generate PDF",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}