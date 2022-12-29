export default function dateInPast(date: Date): boolean {
  const current = new Date();
  return date < current;
}
