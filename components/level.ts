export function getFarmLevel(score: number) {
  if (score >= 200) return 6;
  if (score >= 120) return 5;
  if (score >= 70) return 4;
  if (score >= 40) return 3;
  if (score >= 15) return 2;
  return 1;
}
