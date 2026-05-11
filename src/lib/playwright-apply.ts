import chromium from "@sparticuz/chromium";
import { chromium as playwrightCore } from "playwright-core";

export interface ApplyPayload {
  name: string;
  email: string;
  phone?: string;
  resumeLink?: string;
  coverLetter?: string;
  applyUrl: string;
}

export interface ApplyResult {
  success: boolean;
  message: string;
  log: string[];
}

/**
 * Attempt to auto-fill an internship application form using Playwright.
 * Uses @sparticuz/chromium so it works on Vercel serverless functions.
 */
export async function autoApply(payload: ApplyPayload): Promise<ApplyResult> {
  const log: string[] = [];

  let browser;
  try {
    log.push(`[playwright] Launching browser for: ${payload.applyUrl}`);

    const executablePath =
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath()
        : undefined; // Let playwright-core find local chromium in dev

    browser = await playwrightCore.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    log.push(`[playwright] Navigating to ${payload.applyUrl}`);
    await page.goto(payload.applyUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    log.push(`[playwright] Page loaded: ${await page.title()}`);

    // ── Name field ──────────────────────────────────────────────────────────
    const nameSelectors = [
      'input[name*="name" i]',
      'input[placeholder*="name" i]',
      'input[id*="name" i]',
      'input[aria-label*="name" i]',
    ];
    for (const sel of nameSelectors) {
      try {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
          await el.fill(payload.name, { timeout: 3000 });
          log.push(`[playwright] Filled name via "${sel}"`);
          break;
        }
      } catch {
        // try next selector
      }
    }

    // ── Email field ─────────────────────────────────────────────────────────
    const emailSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[placeholder*="email" i]',
      'input[id*="email" i]',
    ];
    for (const sel of emailSelectors) {
      try {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
          await el.fill(payload.email, { timeout: 3000 });
          log.push(`[playwright] Filled email via "${sel}"`);
          break;
        }
      } catch {
        // try next selector
      }
    }

    // ── Phone field ─────────────────────────────────────────────────────────
    if (payload.phone) {
      const phoneSelectors = [
        'input[type="tel"]',
        'input[name*="phone" i]',
        'input[placeholder*="phone" i]',
        'input[id*="phone" i]',
      ];
      for (const sel of phoneSelectors) {
        try {
          const el = page.locator(sel).first();
          if ((await el.count()) > 0) {
            await el.fill(payload.phone, { timeout: 3000 });
            log.push(`[playwright] Filled phone via "${sel}"`);
            break;
          }
        } catch {
          // try next selector
        }
      }
    }

    // ── Cover Letter / Message ───────────────────────────────────────────────
    if (payload.coverLetter) {
      const coverSelectors = [
        'textarea[name*="cover" i]',
        'textarea[placeholder*="cover" i]',
        'textarea[id*="cover" i]',
        'textarea[name*="message" i]',
        "textarea",
      ];
      for (const sel of coverSelectors) {
        try {
          const el = page.locator(sel).first();
          if ((await el.count()) > 0) {
            await el.fill(payload.coverLetter, { timeout: 3000 });
            log.push(`[playwright] Filled cover letter via "${sel}"`);
            break;
          }
        } catch {
          // try next selector
        }
      }
    }

    // ── Resume URL (text field fallback) ────────────────────────────────────
    if (payload.resumeLink) {
      const resumeUrlSelectors = [
        'input[name*="resume" i]',
        'input[placeholder*="resume" i]',
        'input[id*="resume" i]',
        'input[name*="portfolio" i]',
        'input[placeholder*="linkedin" i]',
      ];
      for (const sel of resumeUrlSelectors) {
        try {
          const el = page.locator(sel).first();
          if ((await el.count()) > 0) {
            await el.fill(payload.resumeLink, { timeout: 3000 });
            log.push(`[playwright] Filled resume URL via "${sel}"`);
            break;
          }
        } catch {
          // try next selector
        }
      }
    }

    log.push("[playwright] Form filling complete — NOT submitting (safe mode).");
    log.push("[playwright] To enable auto-submit, uncomment the submit block.");

    // ── OPTIONAL: Auto-submit (disabled by default for safety) ──────────────
    // const submitSelectors = [
    //   'button[type="submit"]',
    //   'input[type="submit"]',
    //   'button:has-text("Apply")',
    //   'button:has-text("Submit")',
    // ];
    // for (const sel of submitSelectors) {
    //   const el = page.locator(sel).first();
    //   if ((await el.count()) > 0) {
    //     await el.click();
    //     log.push(`[playwright] Clicked submit via "${sel}"`);
    //     break;
    //   }
    // }

    await browser.close();

    return {
      success: true,
      message: "Form filled successfully. Review the form and submit manually if auto-submit is disabled.",
      log,
    };
  } catch (error) {
    log.push(`[playwright] ERROR: ${(error as Error).message}`);
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore close errors
      }
    }
    return {
      success: false,
      message: "Automation encountered an error. Please apply manually.",
      log,
    };
  }
}
