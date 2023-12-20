import { Page, expect } from '@playwright/test';

export async function injectScript(page: Page, script: string) {
  return await page.setContent(`
  <script>
    async function main() {
      const amount = await ${script};
      document.querySelector('div').textContent = amount;
    }
    main()
  </script>
  <div data-testid="main"></div>
`);
}

export async function assertScriptText(page: Page, expected: string) {
  return await expect(page.getByTestId('main')).toHaveText(expected);
}
