/**
 * Context about this approach:
 *
 * Q. Why not use `npm publish --registry https://registry.npmjs.org` instead of creating .npmrc?
 *
 * -> It doesn't support any clean way of providing access token and only works for already logged in users
 *
 * Q. Why not change actual `.npmrc`, drop github package registry and move to NPM only?
 *
 * -> `.npmrc` doesn't support multiple registries on one scope.
 *  So for our internal users who have `@razorpay` scope pointing to github package registry, we have to keep
 *  publishing on github package registry. We can do this when we move all `@razorpay` scope packages (like universe) to NPM.
 *
 *
 */

const fs = require('fs');
const execa = require('execa');

const NPMRC_PATH = './.npmrc';

const npmRcContent = `@razorpay:registry=https://registry.npmjs.org/
//registry.npmjs.org/:always-auth=true
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;

console.log('[i18nify-react]: Publishing on NPM ✨');

fs.writeFileSync(NPMRC_PATH, npmRcContent);

try {
  execa.commandSync('npm publish --access public', {
    cwd: './',
    stdio: 'inherit',
  });
} finally {
  fs.rmSync(NPMRC_PATH);
}
