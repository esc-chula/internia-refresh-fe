export function intaniaBatch(email: string): string | null {
  const match = email.match(/^(\d{2})\d+@/);
  if (!match) return null;
  const yearCode = Number.parseInt(match[1], 10);
  return `Intania ${yearCode + 41}`;
}
