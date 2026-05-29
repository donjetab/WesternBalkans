import React from "react";
import { CalendarDays, FileText, LogOut, Plus, Save, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homepageFallback, navItems, newsFallback, pagesFallback } from "../data/fallbackContent.js";
import { api, clearToken, resolveMediaUrl, withFallback } from "../services/api.js";

const emptyNews = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  thumbnailUrl: "",
  documentTitle: "",
  documentUrl: "",
  gallery: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: true
};

const pageExtras = [
  { label: "Project Updates", slug: "updates" },
  { label: "Downloads", slug: "downloads" },
  { label: "Case Studies", slug: "case-studies" },
  { label: "Multimedia", slug: "multimedia" }
];

function buildPageLinks() {
  const links = [{ label: "Homepage", slug: "home", type: "home" }];

  navItems.forEach((item) => {
    if (item.to === "/news") {
      links.push({ label: "News", slug: "news", type: "news" });
      return;
    }

    if (item.to && item.to !== "/") {
      links.push({ label: item.label, slug: item.to.replace("/", ""), type: "page" });
    }

    item.items?.forEach((child) => {
      links.push({ label: child.label, slug: child.to.replace("/", ""), type: "page" });
    });
  });

  pageExtras.forEach((extra) => links.push({ ...extra, type: "page" }));

  return links.filter((link, index, list) => list.findIndex((item) => item.slug === link.slug) === index);
}

function createFallbackPage(slug) {
  return {
    slug,
    eyebrow: "",
    title: "",
    intro: "",
    sections: []
  };
}

function toDateInputValue(value) {
  return value ? String(value).slice(0, 10) : "";
}

function linesToList(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function prepareNewsPayload(item) {
  return {
    ...item,
    publishedAt: toDateInputValue(item.publishedAt) || new Date().toISOString().slice(0, 10),
    gallery: item.gallery || []
  };
}

async function uploadNewsImages(files, item, startIndex = 0) {
  const imageFiles = Array.from(files || []);
  const uploaded = [];

  for (let index = 0; index < imageFiles.length; index += 1) {
    const asset = await api.uploadMedia(imageFiles[index], item.title, {
      folder: "News",
      publishedAt: item.publishedAt,
      title: item.title,
      fileIndex: startIndex + index
    });
    uploaded.push(asset);
  }

  return uploaded;
}

async function uploadDocument(file) {
  if (!file) return null;
  return api.uploadMedia(file, file.name, { folder: "Documents" });
}

function withUploadedImages(item, assets) {
  if (!assets.length) return item;

  const urls = assets.map((asset) => asset.url);
  const firstImage = item.imageUrl || urls[0];
  const firstThumbnail = item.thumbnailUrl || urls[0];

  return {
    ...item,
    imageUrl: firstImage,
    thumbnailUrl: firstThumbnail,
    gallery: [...(item.gallery || []), ...urls]
  };
}

export function AdminDashboard() {
  const pageLinks = useMemo(buildPageLinks, []);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [home, setHome] = useState(homepageFallback);
  const [editablePage, setEditablePage] = useState(null);
  const [news, setNews] = useState(newsFallback);
  const [draft, setDraft] = useState(emptyNews);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    withFallback(api.getHomepage, homepageFallback).then(setHome);
    withFallback(() => api.getNews(true), newsFallback).then(setNews);
  }, []);

  useEffect(() => {
    if (selectedSlug === "home" || selectedSlug === "news") return;

    const fallback = pagesFallback[selectedSlug] || createFallbackPage(selectedSlug);
    setEditablePage({ slug: selectedSlug, ...fallback });
    withFallback(() => api.getPage(selectedSlug), fallback).then((page) => {
      setEditablePage({ slug: selectedSlug, ...page });
    });
  }, [selectedSlug]);

  function updateHome(field, value) {
    setHome((current) => ({ ...current, [field]: value }));
  }

  function updateHomeList(listName, index, field, value) {
    setHome((current) => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  }

  function updatePageField(field, value) {
    setEditablePage((current) => ({ ...current, [field]: value }));
  }

  function updatePageSection(index, field, value) {
    setEditablePage((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, [field]: value } : section
      ))
    }));
  }

  function addPageSection() {
    setEditablePage((current) => ({
      ...current,
      sections: [...(current.sections || []), { title: "New section", body: "", sortOrder: current.sections?.length || 0 }]
    }));
  }

  function deletePageSection(index) {
    setEditablePage((current) => ({
      ...current,
      sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index)
    }));
  }

  async function saveHome(event) {
    event.preventDefault();
    const saved = await api.updateHomepage(home);
    setHome(saved);
    setStatus("Homepage content saved.");
  }

  async function savePage(event) {
    event.preventDefault();
    const payload = {
      ...editablePage,
      sections: editablePage.sections.map((section, index) => ({ ...section, sortOrder: index }))
    };
    const saved = await api.updatePage(editablePage.slug, payload);
    setEditablePage(saved);
    setStatus(`${saved.title || "Page"} content saved.`);
  }

  async function saveNews(item) {
    const saved = await api.updateNews(item.id, prepareNewsPayload(item));
    setNews((items) => items.map((newsItem) => (newsItem.id === saved.id ? saved : newsItem)));
    setStatus("News item updated.");
  }

  async function createNews(event, imageFiles = [], documentAsset = null) {
    event.preventDefault();
    const uploadedImages = await uploadNewsImages(imageFiles, draft);
    const draftWithDocument = documentAsset
      ? { ...draft, documentTitle: draft.documentTitle || documentAsset.fileName, documentUrl: documentAsset.url }
      : draft;
    const payload = withUploadedImages(draftWithDocument, uploadedImages);
    const created = await api.createNews(prepareNewsPayload(payload));
    setNews((items) => [created, ...items]);
    setDraft(emptyNews);
    setStatus("News item created.");
  }

  async function deleteNews(id) {
    await api.deleteNews(id);
    setNews((items) => items.filter((item) => item.id !== id));
    setStatus("News item deleted.");
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
        <nav className="admin-sidebar-pages" aria-label="Editable pages">
          <span>Pages</span>
          {pageLinks.map((page) => (
            <button
              className={selectedSlug === page.slug ? "active" : ""}
              key={page.slug}
              type="button"
              onClick={() => setSelectedSlug(page.slug)}
            >
              <FileText size={16} />
              {page.label}
            </button>
          ))}
        </nav>
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

        <div className="admin-editor-main">
          {selectedSlug === "home" ? (
            <HomepageEditor home={home} onChange={updateHome} onListChange={updateHomeList} onSubmit={saveHome} />
          ) : null}

          {selectedSlug !== "home" && selectedSlug !== "news" && editablePage ? (
            <ContentEditor
              page={editablePage}
              onFieldChange={updatePageField}
              onSectionChange={updatePageSection}
              onAddSection={addPageSection}
              onDeleteSection={deletePageSection}
              onSubmit={savePage}
            />
          ) : null}

          {selectedSlug === "news" ? (
            <NewsEditor
              draft={draft}
              news={news}
              onCreateNews={createNews}
                onDeleteNews={deleteNews}
                onDeleteMediaByUrl={api.deleteMediaByUrl}
                onDraftChange={setDraft}
                onSaveNews={saveNews}
                onSetNews={setNews}
                onUploadNewsImages={uploadNewsImages}
              />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function HomepageEditor({ home, onChange, onListChange, onSubmit }) {
  return (
    <form className="admin-panel" onSubmit={onSubmit}>
      <h2>Homepage content</h2>
      <div className="form-grid">
        <label>Hero eyebrow<input value={home.heroEyebrow || ""} onChange={(event) => onChange("heroEyebrow", event.target.value)} /></label>
        <label>Hero title<input value={home.heroTitle || ""} onChange={(event) => onChange("heroTitle", event.target.value)} /></label>
        <label>Hero subtitle<input value={home.heroSubtitle || ""} onChange={(event) => onChange("heroSubtitle", event.target.value)} /></label>
        <label>Hero image URL<input value={home.heroImageUrl || ""} onChange={(event) => onChange("heroImageUrl", event.target.value)} /></label>
        <label className="full">Hero body<textarea value={home.heroBody || ""} onChange={(event) => onChange("heroBody", event.target.value)} /></label>
      </div>

      <EditableHomeList title="Homepage stats" items={home.stats || []} fields={["value", "label"]} listName="stats" onChange={onListChange} />
      <EditableHomeList title="Focus areas" items={home.focusAreas || []} fields={["title", "body"]} listName="focusAreas" onChange={onListChange} />

      <button className="btn btn-primary" type="submit"><Save size={16} /> Save homepage</button>
    </form>
  );
}

function EditableHomeList({ title, items, fields, listName, onChange }) {
  return (
    <div className="nested-editor">
      <h3>{title}</h3>
      {items.map((item, index) => (
        <div className="nested-editor-row" key={`${listName}-${index}`}>
          {fields.map((field) => (
            <label key={field}>
              {field}
              {field === "body" ? (
                <textarea value={item[field] || ""} onChange={(event) => onChange(listName, index, field, event.target.value)} />
              ) : (
                <input value={item[field] || ""} onChange={(event) => onChange(listName, index, field, event.target.value)} />
              )}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function ContentEditor({ page, onFieldChange, onSectionChange, onAddSection, onDeleteSection, onSubmit }) {
  async function uploadSectionDocument(index, file) {
    if (!file) return;
    const asset = await uploadDocument(file);
    onSectionChange(index, "documentTitle", asset.fileName);
    onSectionChange(index, "documentUrl", asset.url);
  }

  async function deleteSectionDocument(index, section) {
    onSectionChange(index, "documentTitle", "");
    onSectionChange(index, "documentUrl", "");
    if (section.documentUrl?.startsWith("/uploads/")) {
      await api.deleteMediaByUrl(section.documentUrl);
    }
  }

  return (
    <form className="admin-panel" onSubmit={onSubmit}>
      <h2>{page.title || "Page content"}</h2>
      <div className="form-grid">
        <label>Eyebrow<input value={page.eyebrow || ""} onChange={(event) => onFieldChange("eyebrow", event.target.value)} /></label>
        <label>Page title<input value={page.title || ""} onChange={(event) => onFieldChange("title", event.target.value)} /></label>
        <label className="full">Intro<textarea value={page.intro || ""} onChange={(event) => onFieldChange("intro", event.target.value)} /></label>
      </div>

      <div className="section-editor-heading">
        <h3>Page sections</h3>
        <button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add section</button>
      </div>

      <div className="admin-section-list">
        {page.sections?.map((section, index) => (
          <article className="admin-section-item" key={`${page.slug}-${index}`}>
            <label>Section title<input value={section.title || ""} onChange={(event) => onSectionChange(index, "title", event.target.value)} /></label>
            <label>Section body<textarea value={section.body || ""} onChange={(event) => onSectionChange(index, "body", event.target.value)} /></label>
            <label>Document title<input value={section.documentTitle || ""} onChange={(event) => onSectionChange(index, "documentTitle", event.target.value)} /></label>
            <label>PDF document<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
            {section.documentUrl ? (
              <div className="news-document-tile">
                <FileText size={22} />
                <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section.documentTitle || "Project document"}</a>
                <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                  <Trash2 size={16} /> Delete PDF
                </button>
              </div>
            ) : null}
            <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete section</button>
          </article>
        ))}
      </div>

      <button className="btn btn-primary" type="submit"><Save size={16} /> Save page</button>
    </form>
  );
}

function NewsEditor({
  draft,
  news,
  onCreateNews,
  onDeleteNews,
  onDeleteMediaByUrl,
  onDraftChange,
  onSaveNews,
  onSetNews,
  onUploadNewsImages
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftImageFiles, setDraftImageFiles] = useState([]);
  const [editingImageFiles, setEditingImageFiles] = useState([]);
  const [draftDocumentFile, setDraftDocumentFile] = useState(null);
  const [editingDocumentFile, setEditingDocumentFile] = useState(null);
  const editingItem = news.find((item) => item.id === editingId);

  function updateEditingItem(field, value) {
    onSetNews((items) => items.map((entry) => entry.id === editingId ? { ...entry, [field]: value } : entry));
  }

  async function createNewsWithImages(event) {
    const documentAsset = await uploadDocument(draftDocumentFile);
    if (documentAsset) {
      onDraftChange({
        ...draft,
        documentTitle: draft.documentTitle || documentAsset.fileName,
        documentUrl: documentAsset.url
      });
      await onCreateNews(event, draftImageFiles, documentAsset);
    } else {
      await onCreateNews(event, draftImageFiles);
    }
    setDraftImageFiles([]);
    setDraftDocumentFile(null);
    setIsAddOpen(false);
  }

  async function saveEditingItem(event) {
    event.preventDefault();
    if (!editingItem) return;
    const startIndex = (editingItem.gallery || []).length + (editingItem.imageUrl ? 1 : 0);
    const uploadedImages = await onUploadNewsImages(editingImageFiles, editingItem, startIndex);
    const documentAsset = await uploadDocument(editingDocumentFile);
    const itemWithDocument = documentAsset
      ? { ...editingItem, documentTitle: editingItem.documentTitle || documentAsset.fileName, documentUrl: documentAsset.url }
      : editingItem;
    const updatedItem = withUploadedImages(itemWithDocument, uploadedImages);
    onSetNews((items) => items.map((entry) => entry.id === editingItem.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
    setEditingImageFiles([]);
    setEditingDocumentFile(null);
    setEditingId(null);
  }

  async function deleteEditingItem() {
    if (!editingItem) return;
    await onDeleteNews(editingItem.id);
    setEditingId(null);
  }

  async function removeNewsImage(item, imageUrl) {
    const remainingImages = getNewsImages(item).filter((url) => url !== imageUrl);
    const replacementImage = remainingImages[0] || "";
    const updatedItem = {
      ...item,
      imageUrl: item.imageUrl === imageUrl ? replacementImage : item.imageUrl,
      thumbnailUrl: item.thumbnailUrl === imageUrl ? replacementImage : item.thumbnailUrl,
      gallery: (item.gallery || []).filter((url) => url !== imageUrl)
    };

    onSetNews((items) => items.map((entry) => entry.id === item.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
    if (imageUrl.startsWith("/uploads/")) {
      await onDeleteMediaByUrl(imageUrl);
    }
  }

  async function setNewsThumbnail(item, imageUrl) {
    const updatedItem = {
      ...item,
      thumbnailUrl: imageUrl,
      imageUrl: item.imageUrl || imageUrl
    };

    onSetNews((items) => items.map((entry) => entry.id === item.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
  }

  async function removeNewsDocument(item) {
    const documentUrl = item.documentUrl;
    const updatedItem = { ...item, documentTitle: "", documentUrl: "" };
    onSetNews((items) => items.map((entry) => entry.id === item.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
    if (documentUrl?.startsWith("/uploads/")) {
      await onDeleteMediaByUrl(documentUrl);
    }
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Manage news</h2>
            <p>Create and edit news posts, pictures, PDFs, and thumbnails.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} /> Add news
          </button>
        </div>
        <div className="admin-news-card-grid">
          {news.map((item) => (
            <button className="admin-news-card" key={item.id} type="button" onClick={() => setEditingId(item.id)}>
              <div className="admin-news-card-image">
                {item.thumbnailUrl || item.imageUrl ? <img src={resolveMediaUrl(item.thumbnailUrl || item.imageUrl)} alt="" /> : <span>Edu4Migration</span>}
              </div>
              <div className="admin-news-card-body">
                <span className="admin-news-card-date"><CalendarDays size={15} /> {toDateInputValue(item.publishedAt) || "Draft"}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <strong>{item.isPublished ? "Published" : "Draft"}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isAddOpen ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={() => setIsAddOpen(false)}>
          <form className="admin-modal admin-news-edit-modal" onSubmit={createNewsWithImages} onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-modal-heading">
              <div>
                <span className="eyebrow dark">News item</span>
                <h2>Add news</h2>
              </div>
              <button className="icon-btn" type="button" aria-label="Close add news" onClick={() => setIsAddOpen(false)}><X size={20} /></button>
            </div>

            <div className="form-grid">
              <label>Title<input value={draft.title} onChange={(event) => onDraftChange({ ...draft, title: event.target.value })} required /></label>
              <label>Date<input type="date" value={draft.publishedAt} onChange={(event) => onDraftChange({ ...draft, publishedAt: event.target.value })} /></label>
              <label className="full">Excerpt<textarea value={draft.excerpt} onChange={(event) => onDraftChange({ ...draft, excerpt: event.target.value })} required /></label>
              <label className="full">Content<textarea value={draft.content} onChange={(event) => onDraftChange({ ...draft, content: event.target.value })} /></label>
              <label>Document title<input value={draft.documentTitle} onChange={(event) => onDraftChange({ ...draft, documentTitle: event.target.value })} /></label>
              <label>PDF document<input type="file" accept=".pdf" onChange={(event) => setDraftDocumentFile(event.target.files?.[0] || null)} /></label>
              <label className="full">News pictures<input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={(event) => setDraftImageFiles(Array.from(event.target.files || []))} /></label>
              <label className="checkbox-field"><input type="checkbox" checked={draft.isPublished} onChange={(event) => onDraftChange({ ...draft, isPublished: event.target.checked })} /> Published</label>
            </div>
            <ImagePreviewGrid files={draftImageFiles} />

            <div className="admin-actions">
              <button className="btn btn-primary" type="submit"><Save size={16} /> Create news</button>
              <button className="btn btn-secondary dark" type="button" onClick={() => setIsAddOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}

      {editingItem ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={() => setEditingId(null)}>
          <form className="admin-modal admin-news-edit-modal" onSubmit={saveEditingItem} onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-modal-heading">
              <div>
                <span className="eyebrow dark">News item</span>
                <h2>{editingItem.title || "Edit news"}</h2>
              </div>
              <button className="icon-btn" type="button" aria-label="Close editor" onClick={() => setEditingId(null)}><X size={20} /></button>
            </div>

            <div className="form-grid">
              <label>Title<input value={editingItem.title} onChange={(event) => updateEditingItem("title", event.target.value)} /></label>
              <label>Date<input type="date" value={toDateInputValue(editingItem.publishedAt)} onChange={(event) => updateEditingItem("publishedAt", event.target.value)} /></label>
              <label className="full">Excerpt<textarea value={editingItem.excerpt || ""} onChange={(event) => updateEditingItem("excerpt", event.target.value)} /></label>
              <label className="full">Content<textarea value={editingItem.content || ""} onChange={(event) => updateEditingItem("content", event.target.value)} /></label>
              <label>Document title<input value={editingItem.documentTitle || ""} onChange={(event) => updateEditingItem("documentTitle", event.target.value)} /></label>
              <label>Replace PDF document<input type="file" accept=".pdf" onChange={(event) => setEditingDocumentFile(event.target.files?.[0] || null)} /></label>
              <label className="full">Add more pictures<input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={(event) => setEditingImageFiles(Array.from(event.target.files || []))} /></label>
              <label className="checkbox-field"><input type="checkbox" checked={editingItem.isPublished} onChange={(event) => updateEditingItem("isPublished", event.target.checked)} /> Published</label>
            </div>
            <NewsImageManager item={editingItem} onRemove={removeNewsImage} onSetThumbnail={setNewsThumbnail} />
            <NewsDocumentManager item={editingItem} onRemove={removeNewsDocument} />
            <ImagePreviewGrid files={editingImageFiles} />

            <div className="admin-actions">
              <button className="btn btn-primary" type="submit"><Save size={16} /> Save changes</button>
              <button className="btn btn-danger" type="button" onClick={deleteEditingItem}><Trash2 size={16} /> Delete</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function getNewsImages(item) {
  return [item.thumbnailUrl, item.imageUrl, ...(item.gallery || [])].filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);
}

function NewsImageManager({ item, onRemove, onSetThumbnail }) {
  const images = getNewsImages(item);

  if (!images.length) {
    return null;
  }

  return (
    <div className="news-image-manager">
      <h3>Pictures</h3>
      <div className="news-image-grid">
        {images.map((imageUrl) => (
          <figure className={`news-image-tile ${item.thumbnailUrl === imageUrl ? "is-thumbnail" : ""}`} key={imageUrl}>
            <img src={resolveMediaUrl(imageUrl)} alt="" />
            <button
              className={`icon-btn news-image-thumbnail-button ${item.thumbnailUrl === imageUrl ? "is-active" : ""}`}
              type="button"
              aria-label="Set as thumbnail"
              aria-pressed={item.thumbnailUrl === imageUrl}
              onClick={() => onSetThumbnail(item, imageUrl)}
            >
              <Star size={17} />
            </button>
            <button className="icon-btn news-image-delete-button" type="button" aria-label="Delete picture" onClick={() => onRemove(item, imageUrl)}>
              <Trash2 size={17} />
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}

function NewsDocumentManager({ item, onRemove }) {
  if (!item.documentUrl) {
    return null;
  }

  return (
    <div className="news-image-manager">
      <h3>PDF document</h3>
      <div className="news-document-tile">
        <FileText size={22} />
        <a href={resolveMediaUrl(item.documentUrl)} target="_blank" rel="noreferrer">
          {item.documentTitle || "Project document"}
        </a>
        <button className="btn btn-danger" type="button" onClick={() => onRemove(item)}>
          <Trash2 size={16} /> Delete PDF
        </button>
      </div>
    </div>
  );
}

function ImagePreviewGrid({ files }) {
  const previews = useMemo(() => files.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file)
  })), [files]);

  useEffect(() => () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  if (!previews.length) {
    return null;
  }

  return (
    <div className="news-image-manager">
      <h3>Selected pictures</h3>
      <div className="news-image-grid">
        {previews.map((preview) => (
          <figure className="news-image-tile" key={preview.url}>
            <img src={preview.url} alt="" />
            <figcaption>{preview.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
