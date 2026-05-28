import React from "react";
import { ImageUp, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homepageFallback, newsFallback } from "../data/fallbackContent.js";
import { api, clearToken, withFallback } from "../services/api.js";

const emptyNews = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: true
};

export function AdminDashboard() {
  const [home, setHome] = useState(homepageFallback);
  const [news, setNews] = useState(newsFallback);
  const [draft, setDraft] = useState(emptyNews);
  const [media, setMedia] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaAlt, setMediaAlt] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    withFallback(api.getHomepage, homepageFallback).then(setHome);
    withFallback(() => api.getNews(true), newsFallback).then(setNews);
    withFallback(api.getMedia, []).then(setMedia);
  }, []);

  function updateHome(field, value) {
    setHome((current) => ({ ...current, [field]: value }));
  }

  async function saveHome(event) {
    event.preventDefault();
    await api.updateHomepage(home);
    setStatus("Homepage content saved.");
  }

  async function saveNews(item) {
    const saved = await api.updateNews(item.id, item);
    setNews((items) => items.map((newsItem) => (newsItem.id === saved.id ? saved : newsItem)));
    setStatus("News item updated.");
  }

  async function createNews(event) {
    event.preventDefault();
    const created = await api.createNews(draft);
    setNews((items) => [created, ...items]);
    setDraft(emptyNews);
    setStatus("News item created.");
  }

  async function deleteNews(id) {
    await api.deleteNews(id);
    setNews((items) => items.filter((item) => item.id !== id));
    setStatus("News item deleted.");
  }

  async function uploadMedia(event) {
    event.preventDefault();
    if (!mediaFile) return;
    const uploaded = await api.uploadMedia(mediaFile, mediaAlt);
    setMedia((items) => [uploaded, ...items]);
    setMediaFile(null);
    setMediaAlt("");
    setStatus("Media uploaded. Use the URL in homepage or news image fields.");
  }

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <img src="/assets/logo.png" alt="" />
        <strong>Edu4Migration CMS</strong>
        <button className="btn btn-secondary dark" type="button" onClick={logout}><LogOut size={16} /> Sign out</button>
      </aside>
      <section className="admin-workspace">
        <div className="admin-heading">
          <div>
            <span className="eyebrow dark">Protected area</span>
            <h1>Admin dashboard</h1>
          </div>
          {status ? <div className="status-pill">{status}</div> : null}
        </div>

        <form className="admin-panel" onSubmit={saveHome}>
          <h2>Homepage content</h2>
          <div className="form-grid">
            <label>Hero eyebrow<input value={home.heroEyebrow || ""} onChange={(event) => updateHome("heroEyebrow", event.target.value)} /></label>
            <label>Hero title<input value={home.heroTitle || ""} onChange={(event) => updateHome("heroTitle", event.target.value)} /></label>
            <label>Hero subtitle<input value={home.heroSubtitle || ""} onChange={(event) => updateHome("heroSubtitle", event.target.value)} /></label>
            <label>Hero image URL<input value={home.heroImageUrl || ""} onChange={(event) => updateHome("heroImageUrl", event.target.value)} /></label>
            <label className="full">Hero body<textarea value={home.heroBody || ""} onChange={(event) => updateHome("heroBody", event.target.value)} /></label>
          </div>
          <button className="btn btn-primary" type="submit"><Save size={16} /> Save homepage</button>
        </form>

        <form className="admin-panel" onSubmit={createNews}>
          <h2>Add news</h2>
          <div className="form-grid">
            <label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label>
            <label>Date<input type="date" value={draft.publishedAt} onChange={(event) => setDraft({ ...draft, publishedAt: event.target.value })} /></label>
            <label className="full">Excerpt<textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} required /></label>
            <label className="full">Image URL<input value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} /></label>
          </div>
          <button className="btn btn-primary" type="submit"><Plus size={16} /> Add news</button>
        </form>

        <form className="admin-panel" onSubmit={uploadMedia}>
          <h2>Media library</h2>
          <div className="form-grid">
            <label>Upload image or PDF<input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(event) => setMediaFile(event.target.files?.[0] || null)} /></label>
            <label>Alt text<input value={mediaAlt} onChange={(event) => setMediaAlt(event.target.value)} /></label>
          </div>
          <button className="btn btn-primary" type="submit"><ImageUp size={16} /> Upload media</button>
          <div className="media-list">
            {media.map((asset) => (
              <article className="media-item" key={asset.id}>
                <span>{asset.fileName}</span>
                <code>{asset.url}</code>
              </article>
            ))}
          </div>
        </form>

        <div className="admin-panel">
          <h2>Manage news</h2>
          <div className="admin-news-list">
            {news.map((item) => (
              <article className="admin-news-item" key={item.id}>
                <input value={item.title} onChange={(event) => setNews((items) => items.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry))} />
                <textarea value={item.excerpt || ""} onChange={(event) => setNews((items) => items.map((entry) => entry.id === item.id ? { ...entry, excerpt: event.target.value } : entry))} />
                <div className="admin-actions">
                  <button className="btn btn-secondary dark" type="button" onClick={() => saveNews(item)}><Save size={16} /> Save</button>
                  <button className="btn btn-danger" type="button" onClick={() => deleteNews(item.id)}><Trash2 size={16} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
