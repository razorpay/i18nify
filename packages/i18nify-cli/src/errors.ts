export function handleError(err: unknown): never {
  const debug = process.env.I18NIFY_CLI_DEBUG === '1';

  if (err instanceof Error) {
    if (debug) {
      console.error(err);
    } else {
      const msg = err.message.replace(/^\[i18nify Error\]:\s*/, '');
      console.error(`Error: ${msg}`);
    }
  } else {
    console.error(`Error: ${String(err)}`);
  }

  process.exit(1);
}
