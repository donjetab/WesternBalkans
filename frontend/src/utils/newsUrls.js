export function slugifyNewsTitle(title = "") {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "news";
}

export function getNewsPath(item = {}) {
  return `/news/${slugifyNewsTitle(item.title || item.titleSq || "news")}`;
}

export function isNumericNewsParam(value = "") {
  return /^\d+$/.test(String(value));
}
