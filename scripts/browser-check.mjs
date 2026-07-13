import { chromium } from "playwright";

async function collectPageErrors(url, actions) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[console] ${msg.text()}`);
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(`[pageerror] ${error.message}`);
  });

  await page.goto(url, { waitUntil: "networkidle" });
  if (actions) {
    await actions(page);
    await page.waitForTimeout(2000);
  }

  await browser.close();
  return { url, consoleErrors, pageErrors };
}

async function main() {
  const results = [];

  results.push(
    await collectPageErrors("http://localhost:3000/", async (page) => {
      await page.waitForSelector("text=Host connection:");
      await page.waitForFunction(() => {
        const text = document.body.innerText;
        return text.includes("connected") || text.includes("disconnected");
      });
    })
  );

  results.push(
    await collectPageErrors("http://localhost:3000/game/test-room", async (page) => {
      await page.waitForSelector("text=Connection:");
    })
  );

  results.push(
    await collectPageErrors("http://localhost:3000/", async (page) => {
      await page.waitForSelector("text=Add Players");
      await page.fill('input[placeholder="Name"]', "Alice");
      await page.getByRole("button", { name: "add player" }).click();
      await page.fill('input[placeholder="Name"]', "Bob");
      await page.getByRole("button", { name: "add player" }).click();
      await page.getByRole("button", { name: "start game" }).click();
      await page.waitForSelector("text=Scorecard");
    })
  );

  let hasErrors = false;
  for (const result of results) {
    const all = [...result.consoleErrors, ...result.pageErrors];
    console.log(`\n=== ${result.url} ===`);
    if (all.length === 0) {
      console.log("No errors");
    } else {
      hasErrors = true;
      for (const line of all) {
        console.log(line);
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
