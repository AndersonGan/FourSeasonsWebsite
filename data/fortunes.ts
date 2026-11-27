/** Original fortunes for the digital fortune cookie. Keep them kind and short. */
export const fortunes: readonly string[] = [
  "Happiness is best served warm.",
  "There is always room for fried rice.",
  "A shared table doubles the flavor.",
  "Good food travels well. So will you.",
  "Your next crispy bite is closer than you think.",
  "The best plans include extra crab puffs.",
  "Someone is about to be very glad you brought dinner.",
  "Patience is a virtue. So is calling ahead.",
  "Every season has its comfort. Today's is yours to choose.",
  "Leftovers are tomorrow's good luck.",
  "Order for two. Share with four. Fortune favors the generous.",
  "A warm bag on a cold night is a small, true joy.",
  "You will find exactly the right amount of sauce.",
  "Spring rolls now, big decisions later.",
];

/** Lucky numbers are decorative only. */
export function luckyNumbers(seed: number): number[] {
  const out: number[] = [];
  let x = seed || 7;
  while (out.length < 4) {
    x = (x * 9301 + 49297) % 233280;
    const n = 1 + (x % 49);
    if (!out.includes(n)) out.push(n);
  }
  return out.sort((a, b) => a - b);
}
