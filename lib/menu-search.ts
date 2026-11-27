import type { MenuItem } from "@/data/menu-schema";

export type SearchableItem = MenuItem & { categoryId: string; categoryTitle: string };

/** Lowercase, strip accents and punctuation so "Tso's" matches "tsos" and "sauteed" matches "sautéed". */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Common alternate spellings customers type. */
const SYNONYMS: Record<string, string[]> = {
  szechuan: ["szechwan"],
  sichuan: ["szechwan"],
  szechwan: ["szechuan"],
  tao: ["tso"],
  tsao: ["tso"],
  tsos: ["tso"],
  potsticker: ["potstickers"],
  dumpling: ["dumplings"],
  shumai: ["shu mai"],
  siumai: ["shu mai"],
  "mar far": ["mar far"],
  marfar: ["mar far"],
  lomein: ["lo mein"],
  chowmein: ["chow mein"],
  chowfun: ["chow fun"],
  bbq: ["bbq"],
  barbecue: ["bbq"],
  veggie: ["vegetable"],
  veg: ["vegetable"],
  soda: ["fountain"],
  pop: ["fountain"],
  combo: ["combo", "combination"],
};

function haystack(item: SearchableItem): string {
  return normalize(
    [item.name, item.description ?? "", item.categoryTitle, ...(item.components ?? []), ...(item.variants?.map((v) => v.label) ?? [])].join(" "),
  );
}

/**
 * Search by dish name, description, category or printed item number.
 * Item numbers match exactly ("L3", "l3", "3", "no 3").
 */
export function searchMenu(items: readonly SearchableItem[], query: string): SearchableItem[] {
  const q = normalize(query);
  if (!q) return [...items];

  const numberQuery = q.replace(/^(no|number|#)\s*/, "").replace(/\s+/g, "");
  const numberHits = items.filter((i) => i.number && normalize(i.number).replace(/\s+/g, "") === numberQuery);
  if (/^l?\d{1,2}$|^ds$/.test(numberQuery) && numberHits.length) return numberHits;

  const tokens = q.split(" ").map((t) => [t, ...(SYNONYMS[t] ?? [])]);
  const scored: { item: SearchableItem; score: number }[] = [];
  for (const item of items) {
    const text = haystack(item);
    const name = normalize(item.name);
    let score = 0;
    let all = true;
    for (const alts of tokens) {
      const hit = alts.some((a) => text.includes(a));
      if (!hit) {
        all = false;
        break;
      }
      if (alts.some((a) => name.includes(a))) score += 2;
      else score += 1;
    }
    if (all) {
      if (name.startsWith(q)) score += 3;
      scored.push({ item, score });
    }
  }
  const merged = [...numberHits, ...scored.sort((a, b) => b.score - a.score).map((s) => s.item)];
  return merged.filter((item, idx) => merged.indexOf(item) === idx);
}
