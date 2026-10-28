export function renderOutput(value: unknown, json?: boolean): void {
  if (json || typeof value === 'object') {
    process.stdout.write(JSON.stringify(value, null, 2) + '\n');
  } else {
    process.stdout.write(String(value) + '\n');
  }
}
