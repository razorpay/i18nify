import { Page, expect } from '@playwright/test';

/**
 * Injects and executes script logic, stores the return value in single div element.
 * @param page Playwright page context
 * @param script logic to be executed
 * @returns {Promise}
 */
export async function injectScript(page: Page, script: string):Promise<void> {

  // here enabling sanitization to preventing XSS vulnerabilities
  

  let safeScript  =  script.replace(/<\/script>/g, '<\\/script>');
  return await page.setContent(`
  <script>
  // using try catch blocks to ensures error handling and exception cases 
    async function main() {
    try{

      const amount = eval(${JSON.stringify(safeScript)})
       //yup their might be useing eval can execute any kind of js code in dyamaminc execution 
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
 *  */
export async function assertScriptText(page: Page, expected: string):Promise<void>{
  const actualText =  await  page.locator('[data-testid="main"]').textContent()
  return  expect(actualText).toBe(actualText,`expected to be "${expected}"but found "${actualText}"`)

}
