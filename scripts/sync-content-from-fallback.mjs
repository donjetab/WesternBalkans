import { homepageFallback, newsFallback, pagesFallback } from "../frontend/src/data/fallbackContent.js";

const API_BASE = process.env.VITE_API_URL || "http://localhost:5088/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@edu4migration.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${await response.text()}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function authedRequest(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

function normalizeNewsUrl(url) {
  if (!url?.startsWith("/assets/News/")) {
    return normalizeDocumentUrl(url);
  }

  return url.replace("/assets/News/", "/uploads/News/");
}

function normalizeDocumentUrl(url) {
  if (!url?.startsWith("/assets/Downloadable%20Documents/")) {
    return url || "";
  }

  return url.replace("/assets/Downloadable%20Documents/", "/uploads/Documents/");
}

function normalizePage(page) {
  return {
    ...page,
    sections: (page.sections || []).map((section) => ({
      ...section,
      documentUrl: normalizeDocumentUrl(section.documentUrl)
    }))
  };
}

function normalizeNews(item) {
  return {
    title: item.title || "",
    excerpt: item.excerpt || "",
    content: item.content || "",
    imageUrl: normalizeNewsUrl(item.imageUrl),
    thumbnailUrl: normalizeNewsUrl(item.thumbnailUrl),
    documentTitle: item.documentTitle || "",
    documentUrl: item.documentUrl || "",
    gallery: (item.gallery || []).map(normalizeNewsUrl),
    publishedAt: item.publishedAt || new Date().toISOString().slice(0, 10),
    isPublished: item.isPublished ?? true
  };
}

const login = await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
});

const token = login.token;

await authedRequest("/content/homepage", token, {
  method: "PUT",
  body: JSON.stringify(homepageFallback)
});

for (const [slug, page] of Object.entries(pagesFallback)) {
  await authedRequest(`/content/pages/${slug}`, token, {
    method: "PUT",
    body: JSON.stringify({ slug, ...normalizePage(page) })
  });
}

const existingNews = await authedRequest("/news?includeDrafts=true", token);
const existingByTitle = new Map(existingNews.map((item) => [item.title.trim().toLowerCase(), item]));

let created = 0;
let updated = 0;

for (const fallbackItem of newsFallback) {
  const payload = normalizeNews(fallbackItem);
  const existing = existingByTitle.get(payload.title.trim().toLowerCase());

  if (existing) {
    await authedRequest(`/news/${existing.id}`, token, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    updated += 1;
  } else {
    await authedRequest("/news", token, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    created += 1;
  }
}

console.log(`Synced homepage, ${Object.keys(pagesFallback).length} pages, ${updated} updated news items, and ${created} new news items.`);
