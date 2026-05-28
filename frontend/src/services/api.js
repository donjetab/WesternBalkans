const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5088/api";
const TOKEN_KEY = "edu4migration_admin_token";
const PUBLIC_REQUEST_TIMEOUT = 900;
const cache = new Map();

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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

async function cachedPublicRequest(path, fallback) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  try {
    const data = await request(path, { timeout: PUBLIC_REQUEST_TIMEOUT });
    cache.set(path, data);
    return data;
  } catch {
    return fallback;
  }
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getHomepage: () => request("/content/homepage"),
  getHomepageFast: (fallback) => cachedPublicRequest("/content/homepage", fallback),
  updateHomepage: (payload) => request("/content/homepage", { method: "PUT", body: JSON.stringify(payload) }),
  getPage: (slug) => request(`/content/pages/${slug}`),
  getPageFast: (slug, fallback) => cachedPublicRequest(`/content/pages/${slug}`, fallback),
  getNews: (includeDrafts = false) => request(`/news${includeDrafts ? "?includeDrafts=true" : ""}`),
  getNewsFast: (includeDrafts = false, fallback = []) => cachedPublicRequest(`/news${includeDrafts ? "?includeDrafts=true" : ""}`, fallback),
  getNewsItemFast: async (id, fallbackItems = []) => {
    const fallback = fallbackItems.find((item) => String(item.id) === String(id));
    if (!id) return fallback;
    return cachedPublicRequest(`/news/${id}`, fallback);
  },
  createNews: (payload) => request("/news", { method: "POST", body: JSON.stringify(payload) }),
  updateNews: (id, payload) => request(`/news/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteNews: (id) => request(`/news/${id}`, { method: "DELETE" }),
  getMedia: () => request("/media"),
  uploadMedia: async (file, altText = "") => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText);
    const response = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};

export async function withFallback(fetcher, fallback) {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}
