import { fallbackData } from "../data/fallbackData.js";

export const isStaticPreview = import.meta.env.VITE_STATIC_PREVIEW === "true";
let useLocalMedia = isStaticPreview;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5088/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
const TOKEN_KEY = "edu4migration_admin_token";
const ADMIN_USER_KEY = "edu4migration_admin_user";
const cache = new Map();

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setSession(session) {
  setToken(session.token);
  const username = session.username || session.email || "";
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({
    id: session.id,
    email: session.email,
    username,
    role: session.role,
    initials: session.initials
  }));
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdmin() {
  try {
    const admin = JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "{}");
    return { ...admin, username: admin.username || admin.email || "", initials: admin.initials || "" };
  } catch {
    return {};
  }
}

export function resolveMediaUrl(url = "") {
  if (!url || url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return useLocalMedia ? `${import.meta.env.BASE_URL}${url.slice(1)}` : `${API_ORIGIN}${url}`;
  }

  return url.startsWith("/assets/") ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const { timeout, cacheKey, ...fetchOptions } = options;
  const controller = timeout ? new AbortController() : null;
  const timer = timeout ? window.setTimeout(() => controller.abort(), timeout) : null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
    signal: controller?.signal || fetchOptions.signal
  });
  if (timer) window.clearTimeout(timer);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// Temporary public-content fallback. Authentication and edits always require the backend.
function getFallback(path) {
  if (path === "/content/homepage") return structuredClone(fallbackData.homepage);
  if (path.startsWith("/content/pages/")) {
    const page = fallbackData.pages[path.slice("/content/pages/".length)];
    if (page) return structuredClone(page);
  }
  if (path === "/news") return structuredClone(fallbackData.news);
  if (/^\/news\/\d+$/.test(path)) {
    const item = fallbackData.news.find((item) => String(item.id) === path.slice(6));
    if (item) return structuredClone(item);
  }
  throw new Error("No public fallback for " + path);
}

async function publicRequest(path) {
  if (isStaticPreview) return getFallback(path);
  try {
    return await request(path, { timeout: 4000 });
  } catch (error) {
    useLocalMedia = true;
    return getFallback(path);
  }
}

async function cachedPublicRequest(path) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  const data = await publicRequest(path);
  cache.set(path, data);
  return data;
}

function clearNewsCache(id) {
  cache.delete("/news");
  cache.delete("/news?includeDrafts=true");
  if (id !== undefined && id !== null) {
    cache.delete(`/news/${id}`);
  }
}

export const api = {
  login: (username, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email: username, password }) }),
  getCurrentUser: () => request("/adminusers/me"),
  getRecentChanges: (take = 20) => request(`/audit/recent?take=${take}`),
  getAuditChanges: ({ page = 1, pageSize = 10, search = "", date = "" } = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    });
    if (search.trim()) params.set("search", search.trim());
    if (date) params.set("date", date);
    return request(`/audit?${params.toString()}`);
  },
  getAdminUsers: () => request("/adminusers"),
  createAdminUser: (payload) => request("/adminusers", { method: "POST", body: JSON.stringify(payload) }),
  updateAdminUser: (id, payload) => request(`/adminusers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteAdminUser: (id) => request(`/adminusers/${id}`, { method: "DELETE" }),
  changePassword: (currentPassword, newPassword) => request("/adminusers/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }),
  getHomepage: () => publicRequest("/content/homepage"),
  getHomepageFast: () => cachedPublicRequest("/content/homepage"),
  updateHomepage: async (payload) => {
    const data = await request("/content/homepage", { method: "PUT", body: JSON.stringify(payload) });
    cache.delete("/content/homepage");
    return data;
  },
  getPage: (slug) => publicRequest(`/content/pages/${slug}`),
  getPageFast: (slug) => cachedPublicRequest(`/content/pages/${slug}`),
  updatePage: async (slug, payload) => {
    const data = await request(`/content/pages/${slug}`, { method: "PUT", body: JSON.stringify(payload) });
    cache.delete(`/content/pages/${slug}`);
    return data;
  },
  getNews: (includeDrafts = false) => includeDrafts ? request("/news?includeDrafts=true") : publicRequest("/news"),
  getNewsFast: (includeDrafts = false) => includeDrafts ? request("/news?includeDrafts=true") : cachedPublicRequest("/news"),
  getNewsItemFast: async (id) => {
    if (!id) return null;
    return cachedPublicRequest(`/news/${id}`);
  },
  createNews: async (payload) => {
    const data = await request("/news", { method: "POST", body: JSON.stringify(payload) });
    clearNewsCache(data?.id);
    return data;
  },
  updateNews: async (id, payload) => {
    const data = await request(`/news/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    clearNewsCache(id);
    return data;
  },
  deleteNews: async (id) => {
    const data = await request(`/news/${id}`, { method: "DELETE" });
    clearNewsCache(id);
    return data;
  },
  getMedia: () => request("/media"),
  uploadMedia: async (file, altText = "", options = {}) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText);
    if (options.folder) formData.append("folder", options.folder);
    if (options.publishedAt) formData.append("publishedAt", options.publishedAt);
    if (options.title) formData.append("title", options.title);
    if (Number.isInteger(options.fileIndex)) formData.append("fileIndex", String(options.fileIndex));
    const response = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  deleteMedia: (id) => request(`/media/${id}`, { method: "DELETE" }),
  deleteMediaByUrl: (url) => request(`/media?url=${encodeURIComponent(url)}`, { method: "DELETE" })
};
