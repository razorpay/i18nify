import { Page, expect } from '@playwright/test';

/**
 * Injects and executes script logic, stores the return value in single div element.
 * @param page Playwright page context
 * @param script logic to be executed
 * @returns {Promise}
 */
export async function injectScript(page: Page, script: string) {
  let safeScript  =  script.replace(/<\/script>/g, '<\\/script>');
  return await page.setContent(`
  <script>
    async function main() {
    try{
      const amount = ${safeScript};
      document.querySelector('div').textContent = amount;
    }
catch(error){
console.log('Script error:', error);
document.querySelector('div').textContent ="error executing script"

}
  }
    main()
  </script>
  <div data-testid="main"></div>
`);
}

/**
 * Asserts expected value from the content received in div element
 * @param page Playwright page context
 * @param expected value to be asserted from received value
 * @returns {Promise}
 */
export async function assertScriptText(page: Page, expected: string) {
  const actualText =  await  page.getByTestId('main').textContent()
  
  return await expect(page.getByTestId('main')).toHaveText(expected);
}
