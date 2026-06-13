const { spawnSync } = require('node:child_process');

const commands = [
  ['workspace', '@razorpay/i18nify-js', 'run', 'validate'],
  ['workspace', '@razorpay/i18nify-react', 'run', 'validate'],
];

for (const args of commands) {
  const result = spawnSync('yarn', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
