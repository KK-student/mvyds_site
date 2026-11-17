export function parseJSONTextWithBigInt(text) {
  return JSON.parse(text, (key, value, context) => {
    if (typeof value === 'number' && Number.isInteger(value) && !Number.isSafeInteger(value)) {
      return BigInt(context.source);
    }
    return value;
  });
}
