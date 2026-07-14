import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagesFallback } from "../frontend/src/data/fallbackContent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceDocumentsDir = path.join(root, "frontend", "public", "assets", "Downloadable Documents");
const targetDocumentsDir = path.join(root, "backend", "Uploads", "Documents");

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

function migrateDocumentUrl(url) {
  if (!url?.startsWith("/assets/Downloadable%20Documents/")) {
    return url || "";
  }

  return url.replace("/assets/Downloadable%20Documents/", "/uploads/Documents/");
}

function migrateNewsItem(item) {
  return {
    title: item.title || "",
    excerpt: item.excerpt || "",
    content: item.content || "",
    imageUrl: item.imageUrl || "",
    thumbnailUrl: item.thumbnailUrl || "",
    documentTitle: item.documentTitle || "",
    documentUrl: migrateDocumentUrl(item.documentUrl),
    gallery: item.gallery || [],
    publishedAt: item.publishedAt || new Date().toISOString().slice(0, 10),
    isPublished: item.isPublished ?? true
  };
}

function migratePage(slug, page) {
  return {
    slug,
    ...page,
    sections: (page.sections || []).map((section) => ({
      ...section,
      documentUrl: migrateDocumentUrl(section.documentUrl)
    }))
  };
}

await mkdir(targetDocumentsDir, { recursive: true });
await cp(sourceDocumentsDir, targetDocumentsDir, { recursive: true, force: true });

const login = await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
});

const token = login.token;
const news = await authedRequest("/news?includeDrafts=true", token);

let updatedNews = 0;
for (const item of news) {
  const payload = migrateNewsItem(item);
  if (payload.documentUrl === (item.documentUrl || "")) continue;

  await authedRequest(`/news/${item.id}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  updatedNews += 1;
}

let updatedPages = 0;
for (const [slug, page] of Object.entries(pagesFallback)) {
  if (!page.sections?.some((section) => section.documentUrl)) continue;

  await authedRequest(`/content/pages/${slug}`, token, {
    method: "PUT",
    body: JSON.stringify(migratePage(slug, page))
  });
  updatedPages += 1;
}

console.log(`Copied documents to ${targetDocumentsDir}`);
console.log(`Updated ${updatedNews} news item(s) and ${updatedPages} page(s) to use /uploads/Documents/... URLs.`);
