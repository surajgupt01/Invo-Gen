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
      },
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error: unknown) {
    console.error("FULL ERROR:", error);

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          message: error.message,
          stack: error.stack,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
