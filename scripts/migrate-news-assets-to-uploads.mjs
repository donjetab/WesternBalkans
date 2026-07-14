import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceNewsDir = path.join(root, "frontend", "public", "assets", "News");
const targetNewsDir = path.join(root, "backend", "Uploads", "News");

const API_BASE = process.env.VITE_API_URL || "http://localhost:5088/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@edu4migration.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD environment variable is required for this script');

async function request(pathname, options = {}) {
  const response = await fetch(`${API_BASE}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${pathname} failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function authedRequest(pathname, token, options = {}) {
  return request(pathname, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

function migrateUrl(url) {
  if (!url?.startsWith("/assets/News/")) {
    return url || "";
  }

  return url.replace("/assets/News/", "/uploads/News/");
}

function migrateNewsItem(item) {
  return {
    title: item.title || "",
    excerpt: item.excerpt || "",
    content: item.content || "",
    imageUrl: migrateUrl(item.imageUrl),
    thumbnailUrl: migrateUrl(item.thumbnailUrl),
    documentTitle: item.documentTitle || "",
    documentUrl: item.documentUrl || "",
    gallery: (item.gallery || []).map(migrateUrl),
    publishedAt: item.publishedAt || new Date().toISOString().slice(0, 10),
    isPublished: item.isPublished ?? true
  };
}

await mkdir(targetNewsDir, { recursive: true });
await cp(sourceNewsDir, targetNewsDir, { recursive: true, force: true });

const login = await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
});

const token = login.token;
const news = await authedRequest("/news?includeDrafts=true", token);

let updated = 0;
for (const item of news) {
  const payload = migrateNewsItem(item);
  const changed = payload.imageUrl !== (item.imageUrl || "")
    || payload.thumbnailUrl !== (item.thumbnailUrl || "")
    || JSON.stringify(payload.gallery) !== JSON.stringify(item.gallery || []);

  if (!changed) continue;

  await authedRequest(`/news/${item.id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  updated += 1;
}

console.log(`Copied news assets to ${targetNewsDir}`);
console.log(`Updated ${updated} news item(s) to use /uploads/News/... URLs.`);
