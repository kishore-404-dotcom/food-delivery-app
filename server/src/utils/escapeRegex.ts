export const escapeRegex = (value: string, maxLength = 100): string =>
  value.slice(0, maxLength).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
