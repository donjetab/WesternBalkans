import React from "react";
import { CalendarDays, CheckCircle2, Eye, FileText, Home, LogOut, Newspaper, Plus, Save, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { homepageFallback, navItems, newsFallback, pagesFallback, projectPartners } from "../data/fallbackContent.js";
import { api, clearToken, resolveMediaUrl, withFallback } from "../services/api.js";

const emptyNews = {
  title: "",
  titleSq: "",
  excerpt: "",
  excerptSq: "",
  content: "",
  contentSq: "",
  imageUrl: "",
  thumbnailUrl: "",
  documentTitle: "",
  documentTitleSq: "",
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

function groupPageLinks(links) {
  const contentSlugs = ["home", "overview", "partners", "news", "events"];
  const projectSlugs = ["work-packages", "deliverables", "milestones", "objectives", "outcomes", "updates"];
  const resourceSlugs = ["documents", "downloads", "case-studies", "multimedia"];

  return [
    { label: "Content", links: links.filter((link) => contentSlugs.includes(link.slug)) },
    { label: "Project", links: links.filter((link) => projectSlugs.includes(link.slug)) },
    { label: "Resources", links: links.filter((link) => resourceSlugs.includes(link.slug)) }
  ].filter((group) => group.links.length);
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

function localizedField(field, language) {
  return language === "sq" ? `${field}Sq` : field;
}

function ensureLocalizedList(primary = [], localized = []) {
  return primary.map((item, index) => ({ ...item, ...(localized[index] || {}) }));
}

function mergePartnerFallbacks(partners = []) {
  const source = partners.length ? partners : projectPartners;

  return source.map((partner) => {
    const fallback = projectPartners.find((item) => item.name === partner.name)
      || projectPartners.find((item) => item.logoUrl === partner.logoUrl)
      || {};

    return {
      ...fallback,
      ...partner,
      role: partner.role || fallback.role || "Partner",
      websiteUrl: partner.websiteUrl || fallback.websiteUrl || ""
    };
  });
}

function normalizePartnerWebsiteUrl(url = "") {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isUploadedMediaUrl(url = "") {
  return url.startsWith("/uploads/");
}

function getUniqueUploadedUrls(urls = []) {
  return [...new Set(urls.filter(isUploadedMediaUrl))];
}

async function deleteUploadedMedia(urls = []) {
  const uploadedUrls = getUniqueUploadedUrls(urls);

  for (const url of uploadedUrls) {
    await api.deleteMediaByUrl(url);
  }
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
  const pageGroups = useMemo(() => groupPageLinks(pageLinks), [pageLinks]);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [home, setHome] = useState(homepageFallback);
  const [editablePage, setEditablePage] = useState(null);
  const [news, setNews] = useState(newsFallback);
  const [draft, setDraft] = useState(emptyNews);
  const [status, setStatus] = useState("");
  const [adminLanguage, setAdminLanguage] = useState("en");
  const navigate = useNavigate();
  const selectedPage = pageLinks.find((page) => page.slug === selectedSlug) || pageLinks[0];

  useEffect(() => {
    withFallback(api.getHomepage, homepageFallback).then((data) => {
      setHome({
        ...data,
        statsSq: ensureLocalizedList(data.stats || homepageFallback.stats, data.statsSq),
        focusAreasSq: ensureLocalizedList(data.focusAreas || homepageFallback.focusAreas, data.focusAreasSq),
        partners: mergePartnerFallbacks(data.partners)
      });
    });
    withFallback(() => api.getNews(true), newsFallback).then(setNews);
  }, []);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

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
      sections: [...(current.sections || []), { title: "New section", titleSq: "", body: "", bodySq: "", documentTitle: "", documentTitleSq: "", documentUrl: "", sortOrder: current.sections?.length || 0 }]
    }));
  }

  async function deletePageSection(index) {
    const section = editablePage.sections[index];
    const nextPage = {
      ...editablePage,
      sections: editablePage.sections.filter((_, sectionIndex) => sectionIndex !== index)
    };
    setEditablePage(nextPage);
    await savePageContent(nextPage, "Section deleted.");
    await deleteUploadedMedia([section?.documentUrl]);
  }

  async function saveHome(event) {
    event?.preventDefault();
    const saved = await saveHomepageContent(home, "Homepage content saved.");
    setHome(saved);
  }

  async function saveHomepageContent(content, message) {
    const saved = await api.updateHomepage(content);
    setStatus(message);
    return saved;
  }

  async function savePartner(index) {
    const partners = (home.partners || []).map((partner, partnerIndex) => (
      partnerIndex === index ? { ...partner, websiteUrl: normalizePartnerWebsiteUrl(partner.websiteUrl) } : partner
    ));
    const nextHome = { ...home, partners };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, "Partner saved.");
    setHome(saved);
  }

  function updateHomePartner(index, field, value) {
    setHome((current) => ({
      ...current,
      partners: mergePartnerFallbacks(current.partners).map((partner, partnerIndex) => (
        partnerIndex === index ? { ...partner, [field]: value } : partner
      ))
    }));
  }

  async function addHomePartner(partner, logoFile) {
    const logoAsset = logoFile
      ? await api.uploadMedia(logoFile, partner.name || "Partner logo", { folder: "Partners" })
      : null;
    const newPartner = {
      ...partner,
      role: partner.role || "Partner",
      websiteUrl: normalizePartnerWebsiteUrl(partner.websiteUrl),
      logoUrl: logoAsset?.url || partner.logoUrl || ""
    };
    const nextHome = {
      ...home,
      partners: [...(home.partners || []), newPartner]
    };

    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, "Partner added.");
    setHome(saved);
  }

  async function deleteHomePartner(index) {
    const partner = home.partners?.[index];
    const nextHome = {
      ...home,
      partners: (home.partners || []).filter((_, partnerIndex) => partnerIndex !== index)
    };
    setHome(nextHome);
    await saveHomepageContent(nextHome, "Partner deleted.");
    await deleteUploadedMedia([partner?.logoUrl]);
  }

  async function uploadHomeHeroImage(file) {
    if (!file) return;
    const previousImageUrl = home.heroImageUrl;
    const asset = await api.uploadMedia(file, "Homepage hero image", { folder: "Homepage" });
    const nextHome = { ...home, heroImageUrl: asset.url };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, "Homepage hero image uploaded.");
    setHome(saved);
    await deleteUploadedMedia([previousImageUrl]);
  }

  async function removeHomeHeroImage() {
    const previousImageUrl = home.heroImageUrl;
    const nextHome = { ...home, heroImageUrl: "" };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, "Homepage hero image removed.");
    setHome(saved);
    await deleteUploadedMedia([previousImageUrl]);
  }

  async function uploadPartnerLogo(index, file) {
    if (!file) return;
    const partner = mergePartnerFallbacks(home.partners)[index];
    const previousLogoUrl = partner?.logoUrl;
    const asset = await api.uploadMedia(file, partner?.name || "Partner logo", { folder: "Partners" });
    const partners = mergePartnerFallbacks(home.partners).map((item, partnerIndex) => (
      partnerIndex === index ? { ...item, logoUrl: asset.url } : item
    ));
    const nextHome = { ...home, partners };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, "Partner logo uploaded.");
    setHome(saved);
    await deleteUploadedMedia([previousLogoUrl]);
  }

  async function savePage(event) {
    event?.preventDefault();
    return savePageContent(editablePage);
  }

  async function savePageContent(pageDraft, message) {
    const payload = {
      ...pageDraft,
      sections: pageDraft.sections.map((section, index) => ({ ...section, sortOrder: index }))
    };
    const saved = await api.updatePage(pageDraft.slug, payload);
    setEditablePage(saved);
    setStatus(message || `${saved.title || "Page"} content saved.`);
    return saved;
  }

  async function updateAndSavePageSection(index, updates, message) {
    const nextPage = {
      ...editablePage,
      sections: editablePage.sections.map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, ...updates } : section
      ))
    };
    setEditablePage(nextPage);
    return savePageContent(nextPage, message);
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
    const item = news.find((entry) => entry.id === id);
    await api.deleteNews(id);
    setNews((items) => items.filter((item) => item.id !== id));
    setStatus("News item deleted.");
    await deleteUploadedMedia([
      item?.imageUrl,
      item?.thumbnailUrl,
      item?.documentUrl,
      ...(item?.gallery || [])
    ]);
  }

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/assets/logo.png" alt="" />
          <div>
            <strong>Edu4Migration CMS</strong>
            <span>Content management</span>
          </div>
        </div>
        <nav className="admin-sidebar-pages" aria-label="Editable pages">
          {pageGroups.map((group) => (
            <div className="admin-sidebar-group" key={group.label}>
              <span>{group.label}</span>
              {group.links.map((page) => (
                <button
                  className={selectedSlug === page.slug ? "active" : ""}
                  key={page.slug}
                  type="button"
                  onClick={() => setSelectedSlug(page.slug)}
                >
                  {page.type === "home" ? <Home size={16} /> : page.type === "news" ? <Newspaper size={16} /> : <FileText size={16} />}
                  {page.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-user-card">
          <div className="admin-user-avatar">A</div>
          <div>
            <strong>Admin</strong>
            <span>Protected editor</span>
          </div>
        </div>
        <button className="admin-signout" type="button" onClick={logout}><LogOut size={16} /> Sign out</button>
      </aside>
      <section className="admin-workspace">
        {status ? (
          <div className="admin-toast" role="status" aria-live="polite">
            <CheckCircle2 size={16} />
            {status}
          </div>
        ) : null}
        <div className="admin-heading">
          <div>
            <h1>{selectedPage?.label || "Admin dashboard"}</h1>
            <p>Edit the content shown on the public Edu4Migration website.</p>
          </div>
          <div className="admin-heading-actions">
            <div className="admin-language-tabs" aria-label="Editing language">
              <button className={adminLanguage === "en" ? "active" : ""} type="button" onClick={() => setAdminLanguage("en")}>English</button>
              <button className={adminLanguage === "sq" ? "active" : ""} type="button" onClick={() => setAdminLanguage("sq")}>Albanian</button>
            </div>
            <span className="status-pill"><CheckCircle2 size={15} /> Published</span>
            {selectedSlug === "home" ? <a className="btn btn-secondary dark" href="/" target="_blank" rel="noreferrer"><Eye size={16} /> Preview</a> : null}
          </div>
        </div>

        <div className="admin-editor-main">
          <div className="admin-editor-column">
            {selectedSlug === "home" ? (
              <HomepageEditor
                home={home}
                onChange={updateHome}
                onHeroImageUpload={uploadHomeHeroImage}
                onHeroImageRemove={removeHomeHeroImage}
                language={adminLanguage}
                onListChange={updateHomeList}
                onSubmit={saveHome}
              />
            ) : null}

            {selectedSlug === "partners" ? (
              <PartnersEditor
                partners={home.partners || []}
                onAddPartner={addHomePartner}
                onDeletePartner={deleteHomePartner}
                onLogoUpload={uploadPartnerLogo}
                onPartnerChange={updateHomePartner}
                onSavePartner={savePartner}
              />
            ) : null}

            {selectedSlug !== "home" && selectedSlug !== "news" && selectedSlug !== "partners" && editablePage ? (
              <ContentEditor
                page={editablePage}
                onFieldChange={updatePageField}
                onSectionChange={updatePageSection}
                onAddSection={addPageSection}
                onDeleteSection={deletePageSection}
                onSaveSection={updateAndSavePageSection}
                language={adminLanguage}
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
                language={adminLanguage}
                onUploadNewsImages={uploadNewsImages}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function HomepageEditor({ home, language, onChange, onHeroImageUpload, onHeroImageRemove, onListChange, onSubmit }) {
  const heroEyebrowField = localizedField("heroEyebrow", language);
  const heroTitleField = localizedField("heroTitle", language);
  const heroSubtitleField = localizedField("heroSubtitle", language);
  const heroBodyField = localizedField("heroBody", language);
  const statsList = language === "sq" ? "statsSq" : "stats";
  const focusList = language === "sq" ? "focusAreasSq" : "focusAreas";

  return (
    <form className="admin-home-editor" onSubmit={onSubmit}>
      <EditorSection
        icon={<FileText size={18} />}
        title="Hero Section"
        description="Edit the main hero content that appears at the top of the homepage."
        action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save changes</button>}
      >
        <div className="form-grid">
          <label>Hero eyebrow<input value={home[heroEyebrowField] || ""} onChange={(event) => onChange(heroEyebrowField, event.target.value)} /></label>
          <label>Hero title<input value={home[heroTitleField] || ""} onChange={(event) => onChange(heroTitleField, event.target.value)} /></label>
          <label>Hero subtitle<input value={home[heroSubtitleField] || ""} onChange={(event) => onChange(heroSubtitleField, event.target.value)} /></label>
          <label>Hero image<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => onHeroImageUpload(event.target.files?.[0] || null)} /></label>
          <label className="full">Hero body<textarea value={home[heroBodyField] || ""} onChange={(event) => onChange(heroBodyField, event.target.value)} /></label>
        </div>
        <HeroImageManager imageUrl={home.heroImageUrl} onRemove={onHeroImageRemove} />
      </EditorSection>

      <EditorSection
        icon={<Star size={18} />}
        title="Statistics"
        description="These key numbers will be displayed on the homepage."
      >
        <EditableHomeList items={home[statsList] || []} fields={["value", "label"]} listName={statsList} onChange={onListChange} variant="stats" />
      </EditorSection>

      <EditorSection
        icon={<FileText size={18} />}
        title="Focus Areas"
        description="Define the main focus areas of the project."
      >
        <EditableHomeList items={home[focusList] || []} fields={["title", "body"]} listName={focusList} onChange={onListChange} variant="focus" />
      </EditorSection>
    </form>
  );
}

function HeroImageManager({ imageUrl, onRemove }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="home-image-manager">
      <h3>Current hero image</h3>
      <figure className="home-image-tile">
        <img src={resolveMediaUrl(imageUrl)} alt="" />
        <figcaption>{imageUrl}</figcaption>
        <button className="icon-btn news-image-delete-button" type="button" aria-label="Remove hero image" onClick={onRemove}>
          <Trash2 size={17} />
        </button>
      </figure>
    </div>
  );
}

function PartnersEditor({ partners, onAddPartner, onDeletePartner, onLogoUpload, onPartnerChange, onSavePartner }) {
  const emptyPartner = { name: "", country: "", role: "Partner", websiteUrl: "", logoUrl: "" };
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draftPartner, setDraftPartner] = useState(emptyPartner);
  const [draftLogoFile, setDraftLogoFile] = useState(null);
  const draftLogoPreview = useMemo(() => (
    draftLogoFile ? URL.createObjectURL(draftLogoFile) : ""
  ), [draftLogoFile]);

  useEffect(() => () => {
    if (draftLogoPreview) URL.revokeObjectURL(draftLogoPreview);
  }, [draftLogoPreview]);

  async function createPartner(event) {
    event.preventDefault();
    await onAddPartner(draftPartner, draftLogoFile);
    setDraftPartner(emptyPartner);
    setDraftLogoFile(null);
    setIsAddOpen(false);
  }

  return (
    <>
      <div className="admin-home-editor">
        <EditorSection
          icon={<Home size={18} />}
          title="Project Partners"
          description="Manage partner logos, countries, roles, and the website links opened when visitors click each card."
          action={(
            <div className="admin-actions">
              <button className="btn btn-secondary dark" type="button" onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add partner</button>
            </div>
          )}
        >
          <div className="admin-partner-grid">
            {partners.map((partner, index) => (
              <article className="admin-partner-editor-card" key={`${index}-${partner.logoUrl || "partner"}`}>
                <div className="admin-partner-logo-preview">
                  {partner.logoUrl ? <img src={resolveMediaUrl(partner.logoUrl)} alt="" /> : <span>Logo</span>}
                </div>
                <div className="admin-partner-fields">
                  <label>Name<input value={partner.name || ""} onChange={(event) => onPartnerChange(index, "name", event.target.value)} /></label>
                  <label>Country<input value={partner.country || ""} onChange={(event) => onPartnerChange(index, "country", event.target.value)} /></label>
                  <label>Role<input value={partner.role || ""} onChange={(event) => onPartnerChange(index, "role", event.target.value)} /></label>
                  <label>Website link<input value={partner.websiteUrl || ""} onBlur={() => onSavePartner(index)} onChange={(event) => onPartnerChange(index, "websiteUrl", event.target.value)} /></label>
                  <label className="full">Logo image<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => onLogoUpload(index, event.target.files?.[0] || null)} /></label>
                </div>
                <div className="admin-partner-actions">
                  {partner.websiteUrl ? <a className="btn btn-secondary dark" href={normalizePartnerWebsiteUrl(partner.websiteUrl)} target="_blank" rel="noreferrer">Open link</a> : null}
                  <button className="btn btn-primary" type="button" onClick={() => onSavePartner(index)}><Save size={16} /> Save partner</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeletePartner(index)}><Trash2 size={16} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </EditorSection>
      </div>

      {isAddOpen ? (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={() => setIsAddOpen(false)}>
          <form className="admin-modal admin-partner-modal" onSubmit={createPartner} onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-modal-heading">
              <div>
                <span className="eyebrow dark">Project partner</span>
                <h2>Add partner</h2>
              </div>
              <button className="icon-btn" type="button" aria-label="Close add partner" onClick={() => setIsAddOpen(false)}><X size={20} /></button>
            </div>

            <div className="admin-partner-modal-layout">
              <div className="admin-partner-logo-preview">
                {draftLogoPreview ? <img src={draftLogoPreview} alt="" /> : <span>Logo</span>}
              </div>
              <div className="admin-partner-fields">
                <label>Name<input value={draftPartner.name} onChange={(event) => setDraftPartner({ ...draftPartner, name: event.target.value })} required /></label>
                <label>Country<input value={draftPartner.country} onChange={(event) => setDraftPartner({ ...draftPartner, country: event.target.value })} /></label>
                <label>Role<input value={draftPartner.role} onChange={(event) => setDraftPartner({ ...draftPartner, role: event.target.value })} /></label>
                <label>Website link<input value={draftPartner.websiteUrl} onChange={(event) => setDraftPartner({ ...draftPartner, websiteUrl: event.target.value })} /></label>
                <label className="full">Logo image<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setDraftLogoFile(event.target.files?.[0] || null)} /></label>
              </div>
            </div>

            <div className="admin-actions">
              <button className="btn btn-primary" type="submit"><Save size={16} /> Add partner</button>
              <button className="btn btn-secondary dark" type="button" onClick={() => setIsAddOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function EditorSection({ icon, title, description, action, children }) {
  return (
    <section className="admin-editor-section">
      <div className="admin-editor-section-heading">
        <div className="admin-editor-section-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {action ? <div className="admin-editor-section-action">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function EditableHomeList({ title, items, fields, listName, onChange, variant = "default" }) {
  return (
    <div className={`nested-editor nested-editor-${variant}`}>
      {title ? <h3>{title}</h3> : null}
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

function splitEventBody(body = "") {
  const [meta, ...descriptionParts] = body.split(". ");
  return {
    meta: meta || "",
    description: descriptionParts.join(". ").trim() || body
  };
}

const projectEditorSlugs = new Set(["objectives", "outcomes", "work-packages", "deliverables", "milestones", "updates"]);
const resourceEditorSlugs = new Set(["documents", "case-studies", "multimedia"]);

function ContentEditor({ page, language, onFieldChange, onSectionChange, onAddSection, onDeleteSection, onSaveSection, onSubmit }) {
  const eyebrowField = localizedField("eyebrow", language);
  const titleField = localizedField("title", language);
  const introField = localizedField("intro", language);
  const sectionTitleField = localizedField("title", language);
  const sectionBodyField = localizedField("body", language);
  const documentTitleField = localizedField("documentTitle", language);

  async function uploadSectionDocument(index, file) {
    if (!file) return;
    const previousDocumentUrl = page.sections?.[index]?.documentUrl;
    const asset = await uploadDocument(file);
    const updates = {
      documentTitle: asset.fileName,
      documentTitleSq: page.sections?.[index]?.documentTitleSq || asset.fileName,
      documentUrl: asset.url
    };
    onSectionChange(index, "documentTitle", updates.documentTitle);
    onSectionChange(index, "documentTitleSq", updates.documentTitleSq);
    onSectionChange(index, "documentUrl", updates.documentUrl);
    await onSaveSection?.(index, updates, "PDF uploaded and saved.");
    await deleteUploadedMedia([previousDocumentUrl]);
  }

  async function deleteSectionDocument(index, section) {
    const updates = {
      documentTitle: "",
      documentTitleSq: "",
      documentUrl: ""
    };
    onSectionChange(index, "documentTitle", updates.documentTitle);
    onSectionChange(index, "documentTitleSq", updates.documentTitleSq);
    onSectionChange(index, "documentUrl", updates.documentUrl);
    await onSaveSection?.(index, updates, "PDF deleted and document saved.");
    await deleteUploadedMedia([section.documentUrl]);
  }

  if (page.slug === "overview") {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<FileText size={18} />}
          title="Overview Header"
          description="Edit the public Project Overview hero content."
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save changes</button>}
        >
          <div className="form-grid">
            <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<Star size={18} />}
          title="Overview Cards"
          description="These cards explain the main project challenges and responses on the overview page."
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add card</button>}
        >
          <div className="admin-overview-card-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-overview-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-overview-card-number">{String(index + 1).padStart(2, "0")}</div>
                <label>Card title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                <label>Card body<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete card</button>
              </article>
            ))}
          </div>
        </EditorSection>
      </form>
    );
  }

  if (page.slug === "downloads") {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<FileText size={18} />}
          title="Downloadable Documents Header"
          description="Edit the heading and intro text for the public downloads page."
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save page header</button>}
        >
          <div className="form-grid">
            <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<FileText size={18} />}
          title="PDF Documents"
          description="Add and manage the PDF files shown on the Downloadable Documents page."
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add document</button>}
        >
          <div className="admin-document-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-document-card" key={`${page.slug}-${index}`}>
                <div className="admin-document-icon"><FileText size={28} /></div>
                <div className="admin-document-fields">
                  <label>Document title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>Button label<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
                  <label className="full">Description<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  <label className="full">Replace PDF<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
                </div>
                {section.documentUrl ? (
                  <div className="news-document-tile">
                    <FileText size={22} />
                    <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || section[sectionTitleField] || "Project document"}</a>
                    <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                      <Trash2 size={16} /> Delete PDF
                    </button>
                  </div>
                ) : (
                  <div className="admin-document-empty">No PDF uploaded yet.</div>
                )}
                <div className="admin-document-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> Save document</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete card</button>
                </div>
              </article>
            ))}
          </div>
        </EditorSection>
      </form>
    );
  }

  if (page.slug === "events") {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<CalendarDays size={18} />}
          title="Events Header"
          description="Edit the heading and intro text for the public Events page."
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save page header</button>}
        >
          <div className="form-grid">
            <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<CalendarDays size={18} />}
          title="Event Cards"
          description="These cards match the Events page layout. The first sentence becomes the green event meta line on the public page."
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add event</button>}
        >
          <div className="admin-events-list">
            {page.sections?.map((section, index) => {
              const preview = splitEventBody(section[sectionBodyField] || "");

              return (
                <article className="admin-event-card-editor" key={`${page.slug}-${index}`}>
                  <div className="admin-event-preview">
                    <div className="event-meta">{preview.meta}</div>
                    <h3>{section[sectionTitleField] || "Untitled event"}</h3>
                    <p>{preview.description}</p>
                  </div>
                  <div className="admin-event-fields">
                    <label>Event title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                    <label>Event text<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  </div>
                  <div className="admin-event-actions">
                    <button className="btn btn-primary" type="submit"><Save size={16} /> Save</button>
                    <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete</button>
                  </div>
                </article>
              );
            })}
          </div>
        </EditorSection>
      </form>
    );
  }

  if (projectEditorSlugs.has(page.slug)) {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<FileText size={18} />}
          title={`${page[titleField] || page.title || "Page"} Header`}
          description="Edit the heading and intro text shown at the top of the public page."
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save page header</button>}
        >
          <div className="form-grid">
            <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<Star size={18} />}
          title="Content Cards"
          description="Edit the cards that appear on this public page."
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add card</button>}
        >
          <div className={`admin-project-card-grid admin-project-card-grid-${page.slug}`}>
            {page.sections?.map((section, index) => (
              <article className="admin-project-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-project-card-preview">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{section[sectionTitleField] || "Untitled card"}</h3>
                  <p>{section[sectionBodyField] || "Add the card body text."}</p>
                </div>
                <div className="admin-project-card-fields">
                  <label>Card title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>Card body<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                </div>
                <div className="admin-project-card-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> Save</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </EditorSection>
      </form>
    );
  }

  if (resourceEditorSlugs.has(page.slug)) {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<FileText size={18} />}
          title={`${page[titleField] || page.title || "Resource"} Header`}
          description="Edit the heading and intro text shown at the top of the public resource page."
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> Save page header</button>}
        >
          <div className="form-grid">
            <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<FileText size={18} />}
          title="Resource Cards"
          description="Edit the cards shown on this page and attach PDFs when needed."
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add resource</button>}
        >
          <div className="admin-resource-card-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-resource-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-resource-card-preview">
                  <div className="admin-resource-card-icon"><FileText size={24} /></div>
                  <div>
                    <h3>{section[sectionTitleField] || "Untitled resource"}</h3>
                    <p>{section[sectionBodyField] || "Add a short description for this resource."}</p>
                  </div>
                </div>
                <div className="admin-resource-card-fields">
                  <label>Card title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>Button label<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
                  <label className="full">Description<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  <label className="full">PDF document<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
                </div>
                {section.documentUrl ? (
                  <div className="news-document-tile">
                    <FileText size={22} />
                    <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || section[sectionTitleField] || "Project document"}</a>
                    <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                      <Trash2 size={16} /> Delete PDF
                    </button>
                  </div>
                ) : (
                  <div className="admin-document-empty">No PDF uploaded yet.</div>
                )}
                <div className="admin-resource-card-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> Save</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </EditorSection>
      </form>
    );
  }

  return (
    <form className="admin-panel" onSubmit={onSubmit}>
      <h2>{page[titleField] || page.title || "Page content"}</h2>
      <div className="form-grid">
        <label>Eyebrow<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
        <label>Page title<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
        <label className="full">Intro<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
      </div>

      <div className="section-editor-heading">
        <h3>Page sections</h3>
        <button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> Add section</button>
      </div>

      <div className="admin-section-list">
        {page.sections?.map((section, index) => (
          <article className="admin-section-item" key={`${page.slug}-${index}`}>
            <label>Section title<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
            <label>Section body<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
            <label>Document title<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
            <label>PDF document<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
            {section.documentUrl ? (
              <div className="news-document-tile">
                <FileText size={22} />
                <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || "Project document"}</a>
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
  language,
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
  const titleField = localizedField("title", language);
  const excerptField = localizedField("excerpt", language);
  const contentField = localizedField("content", language);
  const documentTitleField = localizedField("documentTitle", language);

  function updateEditingItem(field, value) {
    onSetNews((items) => items.map((entry) => entry.id === editingId ? { ...entry, [field]: value } : entry));
  }

  async function createNewsWithImages(event) {
    const documentAsset = await uploadDocument(draftDocumentFile);
    if (documentAsset) {
      onDraftChange({
        ...draft,
        documentTitle: draft.documentTitle || documentAsset.fileName,
        documentTitleSq: draft.documentTitleSq || documentAsset.fileName,
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
    const previousDocumentUrl = editingItem.documentUrl;
    const startIndex = (editingItem.gallery || []).length + (editingItem.imageUrl ? 1 : 0);
    const uploadedImages = await onUploadNewsImages(editingImageFiles, editingItem, startIndex);
    const documentAsset = await uploadDocument(editingDocumentFile);
    const itemWithDocument = documentAsset
      ? { ...editingItem, documentTitle: documentAsset.fileName, documentTitleSq: editingItem.documentTitleSq || documentAsset.fileName, documentUrl: documentAsset.url }
      : editingItem;
    const updatedItem = withUploadedImages(itemWithDocument, uploadedImages);
    onSetNews((items) => items.map((entry) => entry.id === editingItem.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
    if (documentAsset) {
      await deleteUploadedMedia([previousDocumentUrl]);
    }
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
    await onDeleteMediaByUrl(imageUrl);
  }

  async function setNewsThumbnail(item, imageUrl) {
    const updatedItem = {
      ...item,
      thumbnailUrl: imageUrl,
      imageUrl
    };

    onSetNews((items) => items.map((entry) => entry.id === item.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
  }

  async function removeNewsDocument(item) {
    const documentUrl = item.documentUrl;
    const updatedItem = { ...item, documentTitle: "", documentUrl: "" };
    onSetNews((items) => items.map((entry) => entry.id === item.id ? updatedItem : entry));
    await onSaveNews(updatedItem);
    await onDeleteMediaByUrl(documentUrl);
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
                <h3>{item[titleField] || item.title}</h3>
                <p>{item[excerptField] || item.excerpt}</p>
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
              <label>Title<input value={draft[titleField] || ""} onChange={(event) => onDraftChange({ ...draft, [titleField]: event.target.value })} required={language === "en"} /></label>
              <label>Date<input type="date" value={draft.publishedAt} onChange={(event) => onDraftChange({ ...draft, publishedAt: event.target.value })} /></label>
              <label className="full">Excerpt<textarea value={draft[excerptField] || ""} onChange={(event) => onDraftChange({ ...draft, [excerptField]: event.target.value })} required={language === "en"} /></label>
              <label className="full">Content<textarea value={draft[contentField] || ""} onChange={(event) => onDraftChange({ ...draft, [contentField]: event.target.value })} /></label>
              <label>Document title<input value={draft[documentTitleField] || ""} onChange={(event) => onDraftChange({ ...draft, [documentTitleField]: event.target.value })} /></label>
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
                <h2>{editingItem[titleField] || editingItem.title || "Edit news"}</h2>
              </div>
              <button className="icon-btn" type="button" aria-label="Close editor" onClick={() => setEditingId(null)}><X size={20} /></button>
            </div>

            <div className="form-grid">
              <label>Title<input value={editingItem[titleField] || ""} onChange={(event) => updateEditingItem(titleField, event.target.value)} /></label>
              <label>Date<input type="date" value={toDateInputValue(editingItem.publishedAt)} onChange={(event) => updateEditingItem("publishedAt", event.target.value)} /></label>
              <label className="full">Excerpt<textarea value={editingItem[excerptField] || ""} onChange={(event) => updateEditingItem(excerptField, event.target.value)} /></label>
              <label className="full">Content<textarea value={editingItem[contentField] || ""} onChange={(event) => updateEditingItem(contentField, event.target.value)} /></label>
              <label>Document title<input value={editingItem[documentTitleField] || ""} onChange={(event) => updateEditingItem(documentTitleField, event.target.value)} /></label>
              <label>Replace PDF document<input type="file" accept=".pdf" onChange={(event) => setEditingDocumentFile(event.target.files?.[0] || null)} /></label>
              <label className="full">Add more pictures<input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={(event) => setEditingImageFiles(Array.from(event.target.files || []))} /></label>
              <label className="checkbox-field"><input type="checkbox" checked={editingItem.isPublished} onChange={(event) => updateEditingItem("isPublished", event.target.checked)} /> Published</label>
            </div>
            <NewsImageManager item={editingItem} onRemove={removeNewsImage} onSetThumbnail={setNewsThumbnail} />
            <NewsDocumentManager item={editingItem} language={language} onRemove={removeNewsDocument} />
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

function NewsDocumentManager({ item, language, onRemove }) {
  if (!item.documentUrl) {
    return null;
  }

  const titleField = localizedField("documentTitle", language);

  return (
    <div className="news-image-manager">
      <h3>PDF document</h3>
      <div className="news-document-tile">
        <FileText size={22} />
        <a href={resolveMediaUrl(item.documentUrl)} target="_blank" rel="noreferrer">
          {item[titleField] || item.documentTitle || "Project document"}
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
