import React from "react";
import { AlertCircle, ArrowLeft, Bold, CalendarDays, CheckCircle2, ChevronDown, Eye, EyeOff, FileText, GripVertical, History, Home, Italic, Link2, Lock, LogOut, Menu, Newspaper, Plus, Save, Star, Trash2, Unlock, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { navItems } from "../data/siteStructure.js";
import { api, clearToken, getStoredAdmin, resolveMediaUrl } from "../services/api.js";

const emptyHome = {
  heroEyebrow: "",
  heroEyebrowSq: "",
  heroTitle: "",
  heroTitleSq: "",
  heroSubtitle: "",
  heroSubtitleSq: "",
  heroBody: "",
  heroBodySq: "",
  heroImageUrl: "",
  stats: [],
  statsSq: [],
  focusAreas: [],
  focusAreasSq: [],
  partners: []
};

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

const emptyAdminUser = {
  email: "",
  password: "",
  role: "Admin"
};

function getAdminDisplayName(admin = {}) {
  return admin.username || admin.email || "Admin";
}

function getAdminInitial(admin = {}) {
  return admin.initials || getAdminDisplayName(admin).trim().charAt(0).toUpperCase() || "A";
}

const pageExtras = [
  { label: "Project Updates", slug: "updates" },
  { label: "Downloads", slug: "downloads" },
  { label: "Case Studies", slug: "case-studies" }
];

const adminCopy = {
  en: {
    contentManagement: "Content management",
    content: "Content",
    project: "Project",
    resources: "Resources",
    system: "System",
    users: "Users",
    adminUsers: "Admin users",
    adminUsersDesc: "Only the main admin can view, create, and manage administrator accounts.",
    recentChanges: "Recent changes",
    recentChangesDesc: "Latest admin activity across homepage, pages, news, and users.",
    noRecentChanges: "No changes recorded yet.",
    searchChanges: "Search changes",
    filterByDate: "Filter by date",
    clearFilters: "Clear filters",
    addAdmin: "Add admin",
    email: "Username",
    password: "Password",
    optionalPassword: "New password (optional)",
    mainAdmin: "Super admin",
    saveUser: "Save user",
    usersLoaded: "Admin users loaded.",
    userCreated: "Admin user created.",
    userUpdated: "Admin user updated.",
    userDeleted: "Admin user deleted.",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    passwordChanged: "Password changed successfully.",
    passwordChangeFailed: "Failed to change password.",
    protectedEditor: "Protected editor",
    signOut: "Sign out",
    editablePages: "Editable pages",
    adminDashboard: "Admin dashboard",
    headingIntro: "Edit the content shown on the public Edu4Migration website.",
    english: "English",
    albanian: "Albanian",
    editingLanguage: "Editing language",
    published: "Published",
    draft: "Draft",
    preview: "Preview",
    heroSection: "Hero Section",
    heroSectionDesc: "Edit the main hero content that appears at the top of the homepage.",
    saveChanges: "Save changes",
    heroEyebrow: "Hero eyebrow",
    heroTitle: "Hero title",
    heroSubtitle: "Hero subtitle",
    heroImage: "Hero image",
    heroBody: "Hero body",
    statistics: "Statistics",
    statisticsDesc: "These key numbers will be displayed on the homepage.",
    focusAreas: "Focus Areas",
    focusAreasDesc: "Define the main focus areas of the project.",
    currentHeroImage: "Current hero image",
    removeHeroImage: "Remove hero image",
    projectPartners: "Project Partners",
    projectPartnersDesc: "Manage partner logos, countries, roles, and the website links opened when visitors click each card.",
    addPartner: "Add partner",
    projectPartner: "Project partner",
    name: "Name",
    country: "Country",
    role: "Role",
    websiteLink: "Website link",
    logoImage: "Logo image",
    logo: "Logo",
    openLink: "Open link",
    savePartner: "Save partner",
    cancel: "Cancel",
    overviewHeader: "Overview Header",
    overviewHeaderDesc: "Edit the public Project Overview hero content.",
    overviewCards: "Overview Cards",
    overviewCardsDesc: "These cards explain the main project challenges and responses on the overview page.",
    addCard: "Add card",
    cardTitle: "Card title",
    cardBody: "Card body",
    deleteCard: "Delete card",
    downloadsHeader: "Downloadable Documents Header",
    downloadsHeaderDesc: "Edit the heading and intro text for the public downloads page.",
    savePageHeader: "Save page header",
    pdfDocuments: "PDF Documents",
    pdfDocumentsDesc: "Add and manage the PDF files shown on the Downloadable Documents page.",
    addDocument: "Add document",
    documentTitle: "Document title",
    buttonLabel: "Button label",
    description: "Description",
    replacePdf: "Replace PDF",
    deletePdf: "Delete PDF",
    noPdf: "No PDF uploaded yet.",
    saveDocument: "Save document",
    eventsHeader: "Events Header",
    eventsHeaderDesc: "Edit the heading and intro text for the public Events page.",
    eventCards: "Event Cards",
    eventCardsDesc: "These cards match the Events page layout. The first sentence becomes the green event meta line on the public page.",
    addEvent: "Add event",
    untitledEvent: "Untitled event",
    eventTitle: "Event title",
    eventText: "Event text",
    pageHeaderDesc: "Edit the heading and intro text shown at the top of the public page.",
    resourceHeaderDesc: "Edit the heading and intro text shown at the top of the public resource page.",
    contentCards: "Content Cards",
    contentCardsDesc: "Edit the cards that appear on this public page.",
    resourceCards: "Resource Cards",
    resourceCardsDesc: "Edit the cards shown on this page and attach PDFs when needed.",
    addResource: "Add resource",
    page: "Page",
    resource: "Resource",
    header: "Header",
    untitledCard: "Untitled card",
    cardBodyPlaceholder: "Add the card body text.",
    untitledResource: "Untitled resource",
    resourceBodyPlaceholder: "Add a short description for this resource.",
    pageContent: "Page content",
    eyebrow: "Eyebrow",
    pageTitle: "Page title",
    intro: "Intro",
    pageSections: "Page sections",
    addSection: "Add section",
    sectionTitle: "Section title",
    sectionBody: "Section body",
    pdfDocument: "PDF document",
    deleteSection: "Delete section",
    savePage: "Save page",
    manageNews: "Manage news",
    manageNewsDesc: "Create and edit news posts, pictures, PDFs, and thumbnails.",
    addNews: "Add news",
    newsItem: "News item",
    closeAddNews: "Close add news",
    closeEditor: "Close editor",
    title: "Title",
    date: "Date",
    excerpt: "Excerpt",
    contentField: "Content",
    newsPictures: "News pictures",
    createNews: "Create news",
    editNews: "Edit news",
    replacePdfDocument: "Replace PDF document",
    addMorePictures: "Add more pictures",
    delete: "Delete",
    pictures: "Pictures",
    setAsThumbnail: "Set as thumbnail",
    deletePicture: "Delete picture",
    selectedPictures: "Selected pictures",
    pageSaved: "Page content saved.",
    sectionDeleted: "Section deleted.",
    homepageSaved: "Homepage content saved.",
    partnerSaved: "Partner saved.",
    partnerAdded: "Partner added.",
    partnerDeleted: "Partner deleted.",
    heroUploaded: "Homepage hero image uploaded.",
    heroRemoved: "Homepage hero image removed.",
    partnerLogoUploaded: "Partner logo uploaded.",
    pdfUploaded: "PDF uploaded and saved.",
    pdfDeleted: "PDF deleted and document saved.",
    newsUpdated: "News item updated.",
    newsCreated: "News item created.",
    newsDeleted: "News item deleted."
  },
  sq: {
    contentManagement: "Menaxhimi i përmbajtjes",
    content: "Përmbajtja",
    project: "Projekti",
    resources: "Burimet",
    system: "System",
    users: "Users",
    adminUsers: "Admin users",
    adminUsersDesc: "Only the main admin can view, create, and manage administrator accounts.",
    recentChanges: "Recent changes",
    recentChangesDesc: "Latest admin activity across homepage, pages, news, and users.",
    noRecentChanges: "No changes recorded yet.",
    searchChanges: "Search changes",
    filterByDate: "Filter by date",
    clearFilters: "Clear filters",
    addAdmin: "Add admin",
    email: "Username",
    password: "Password",
    optionalPassword: "New password (optional)",
    mainAdmin: "Super admin",
    saveUser: "Save user",
    usersLoaded: "Admin users loaded.",
    userCreated: "Admin user created.",
    userUpdated: "Admin user updated.",
    userDeleted: "Admin user deleted.",
    changePassword: "Ndrysho fjalëkalimin",
    currentPassword: "Fjalëkalimi aktual",
    newPassword: "Fjalëkalimi i ri",
    passwordChanged: "Fjalëkalimi u ndryshua me sukses.",
    passwordChangeFailed: "Dështoi ndryshimi i fjalëkalimit.",
    protectedEditor: "Editor i mbrojtur",
    signOut: "Dil",
    editablePages: "Faqet e redaktueshme",
    adminDashboard: "Paneli i administratorit",
    headingIntro: "Ndrysho përmbajtjen që shfaqet në faqen publike Edu4Migration.",
    english: "Anglisht",
    albanian: "Shqip",
    editingLanguage: "Gjuha e redaktimit",
    published: "Publikuar",
    draft: "Draft",
    preview: "Shiko",
    heroSection: "Seksioni kryesor",
    heroSectionDesc: "Ndrysho përmbajtjen kryesore që shfaqet në krye të ballinës.",
    saveChanges: "Ruaj ndryshimet",
    heroEyebrow: "Teksti mbi titull",
    heroTitle: "Titulli kryesor",
    heroSubtitle: "Nëntitulli kryesor",
    heroImage: "Foto kryesore",
    heroBody: "Përshkrimi kryesor",
    statistics: "Statistikat",
    statisticsDesc: "Këto numra kryesorë do të shfaqen në ballinë.",
    focusAreas: "Fushat kryesore",
    focusAreasDesc: "Përcakto fushat kryesore të projektit.",
    currentHeroImage: "Fotoja aktuale kryesore",
    removeHeroImage: "Hiq foton kryesore",
    projectPartners: "Partnerët e Projektit",
    projectPartnersDesc: "Menaxho logot, shtetet, rolet dhe lidhjet e faqeve të partnerëve.",
    addPartner: "Shto partner",
    projectPartner: "Partner projekti",
    name: "Emri",
    country: "Shteti",
    role: "Roli",
    websiteLink: "Lidhja e faqes",
    logoImage: "Logo",
    logo: "Logo",
    openLink: "Hap lidhjen",
    savePartner: "Ruaj partnerin",
    cancel: "Anulo",
    overviewHeader: "Kreu i përmbledhjes",
    overviewHeaderDesc: "Ndrysho përmbajtjen kryesore të faqes Përmbledhje e Projektit.",
    overviewCards: "Kartat e përmbledhjes",
    overviewCardsDesc: "Këto karta shpjegojnë sfidat dhe përgjigjet kryesore të projektit.",
    addCard: "Shto kartë",
    cardTitle: "Titulli i kartës",
    cardBody: "Përmbajtja e kartës",
    deleteCard: "Fshi kartën",
    downloadsHeader: "Kreu i dokumenteve për shkarkim",
    downloadsHeaderDesc: "Ndrysho titullin dhe hyrjen e faqes publike të shkarkimeve.",
    savePageHeader: "Ruaj kreun e faqes",
    pdfDocuments: "Dokumentet PDF",
    pdfDocumentsDesc: "Shto dhe menaxho PDF-të që shfaqen në faqen e dokumenteve për shkarkim.",
    addDocument: "Shto dokument",
    documentTitle: "Titulli i dokumentit",
    buttonLabel: "Etiketa e butonit",
    description: "Përshkrimi",
    replacePdf: "Zëvendëso PDF",
    deletePdf: "Fshi PDF",
    noPdf: "Ende nuk është ngarkuar PDF.",
    saveDocument: "Ruaj dokumentin",
    eventsHeader: "Kreu i ngjarjeve",
    eventsHeaderDesc: "Ndrysho titullin dhe hyrjen e faqes publike të Ngjarjeve.",
    eventCards: "Kartat e ngjarjeve",
    eventCardsDesc: "Këto karta përputhen me faqen e Ngjarjeve. Fjalia e parë bëhet rreshti jeshil i detajeve.",
    addEvent: "Shto ngjarje",
    untitledEvent: "Ngjarje pa titull",
    eventTitle: "Titulli i ngjarjes",
    eventText: "Teksti i ngjarjes",
    pageHeaderDesc: "Ndrysho titullin dhe hyrjen që shfaqen në krye të faqes publike.",
    resourceHeaderDesc: "Ndrysho titullin dhe hyrjen që shfaqen në krye të faqes publike të burimeve.",
    contentCards: "Kartat e përmbajtjes",
    contentCardsDesc: "Ndrysho kartat që shfaqen në këtë faqe publike.",
    resourceCards: "Kartat e burimeve",
    resourceCardsDesc: "Ndrysho kartat e kësaj faqeje dhe bashkangjit PDF kur nevojitet.",
    addResource: "Shto burim",
    page: "Faqe",
    resource: "Burim",
    header: "Kreu",
    untitledCard: "Kartë pa titull",
    cardBodyPlaceholder: "Shto tekstin e kartës.",
    untitledResource: "Burim pa titull",
    resourceBodyPlaceholder: "Shto një përshkrim të shkurtër për këtë burim.",
    pageContent: "Përmbajtja e faqes",
    eyebrow: "Teksti mbi titull",
    pageTitle: "Titulli i faqes",
    intro: "Hyrja",
    pageSections: "Seksionet e faqes",
    addSection: "Shto seksion",
    sectionTitle: "Titulli i seksionit",
    sectionBody: "Përmbajtja e seksionit",
    pdfDocument: "Dokument PDF",
    deleteSection: "Fshi seksionin",
    savePage: "Ruaj faqen",
    manageNews: "Menaxho lajmet",
    manageNewsDesc: "Krijo dhe ndrysho lajme, foto, PDF dhe thumbnail.",
    addNews: "Shto lajm",
    newsItem: "Lajm",
    closeAddNews: "Mbyll shtimin e lajmit",
    closeEditor: "Mbyll editorin",
    title: "Titulli",
    date: "Data",
    excerpt: "Përmbledhja",
    contentField: "Përmbajtja",
    newsPictures: "Fotot e lajmit",
    createNews: "Krijo lajm",
    editNews: "Ndrysho lajmin",
    replacePdfDocument: "Zëvendëso dokumentin PDF",
    addMorePictures: "Shto më shumë foto",
    delete: "Fshi",
    pictures: "Fotot",
    setAsThumbnail: "Vendose si thumbnail",
    deletePicture: "Fshi foton",
    selectedPictures: "Fotot e zgjedhura",
    pageSaved: "Përmbajtja e faqes u ruajt.",
    sectionDeleted: "Seksioni u fshi.",
    homepageSaved: "Përmbajtja e ballinës u ruajt.",
    partnerSaved: "Partneri u ruajt.",
    partnerAdded: "Partneri u shtua.",
    partnerDeleted: "Partneri u fshi.",
    heroUploaded: "Fotoja kryesore u ngarkua.",
    heroRemoved: "Fotoja kryesore u hoq.",
    partnerLogoUploaded: "Logoja e partnerit u ngarkua.",
    pdfUploaded: "PDF u ngarkua dhe u ruajt.",
    pdfDeleted: "PDF u fshi dhe dokumenti u ruajt.",
    newsUpdated: "Lajmi u përditësua.",
    newsCreated: "Lajmi u krijua.",
    newsDeleted: "Lajmi u fshi."
  }
};

function adminT(language, key) {
  return adminCopy[language]?.[key] || adminCopy.en[key] || key;
}

const adminPageLabels = {
  sq: {
    Homepage: "Ballina",
    News: "Lajme",
    "Project Updates": "Përditësimet e Projektit",
    Downloads: "Shkarkime",
    "Case Studies": "Studime Rasti",
    Multimedia: "Multimedia",
    Home: "Ballina",
    About: "Rreth projektit",
    "Project Overview": "Përmbledhje e Projektit",
    "Project Partners": "Partnerët e Projektit",
    "Management Structure": "Struktura e Menaxhimit",
    "Objectives and Target Groups": "Objektivat dhe Grupet e Synuara",
    "Expected Outcomes": "Rezultatet e Pritura",
    Activities: "Aktivitetet",
    "Work Packages": "Paketat e Punës",
    Deliverables: "Produktet",
    Milestones: "Pikat Kryesore",
    Events: "Ngjarjet",
    Courses: "Kurse",
    Resources: "Burimet",
    "Project Documents": "Dokumentet e Projektit",
    "Downloadable Documents": "Dokumente për Shkarkim",
    "Case Studies and Reports": "Studime Rasti dhe Raporte"
  }
};

function adminPageLabel(language, label = "") {
  return adminPageLabels[language]?.[label] || label;
}

function adminFieldLabel(language, field = "") {
  const labels = {
    value: language === "sq" ? "Vlera" : "Value",
    label: language === "sq" ? "Etiketa" : "Label",
    title: language === "sq" ? "Titulli" : "Title",
    body: language === "sq" ? "Përmbajtja" : "Body"
  };
  return labels[field] || field;
}

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
  links.push({ label: "Contact Us", slug: "contact", type: "page" });
  links.push({ label: "Users", slug: "users", type: "users" });
  links.push({ label: "Recent changes", slug: "changes", type: "changes" });

  return links.filter((link, index, list) => list.findIndex((item) => item.slug === link.slug) === index);
}

function groupPageLinks(links, includeUsers = false) {
  const contentSlugs = ["home", "overview", "partners", "news", "events", "contact"];
  const projectSlugs = ["management", "work-packages", "deliverables", "milestones", "objectives", "outcomes", "updates", "courses"];
  const resourceSlugs = ["documents", "downloads", "case-studies"];

  return [
    { label: "Content", links: links.filter((link) => contentSlugs.includes(link.slug)) },
    { label: "Project", links: links.filter((link) => projectSlugs.includes(link.slug)) },
    { label: "Resources", links: links.filter((link) => resourceSlugs.includes(link.slug)) },
    { label: "System", links: includeUsers ? links.filter((link) => ["users", "changes"].includes(link.slug)) : [] }
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

function reorderList(items = [], fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
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

function sortAdminUsers(a, b) {
  if (a.role !== b.role) {
    return a.role === "MainAdmin" ? -1 : 1;
  }
  return a.email.localeCompare(b.email);
}

const passwordRequirementsText = "At least 8 characters with uppercase, lowercase, number, and special character.";

function validatePassword(password = "") {
  const value = password.trim();
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must include a lowercase letter.";
  if (!/\d/.test(value)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password must include a special character.";
  return "";
}

function formatChangeTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatChangeLabel(change) {
  const entity = {
    Homepage: "Homepage",
    ContentPage: "Page",
    News: "News",
    AdminUser: "Admin user"
  }[change.entityType] || change.entityType;

  return `${entity} ${String(change.action || "").toLowerCase()}`;
}

export function AdminDashboard() {
  const pageLinks = useMemo(buildPageLinks, []);
  const [currentAdmin, setCurrentAdmin] = useState(getStoredAdmin);
  const isMainAdmin = currentAdmin.role === "MainAdmin";
  const pageGroups = useMemo(() => groupPageLinks(pageLinks, isMainAdmin), [isMainAdmin, pageLinks]);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [home, setHome] = useState(emptyHome);
  const [editablePage, setEditablePage] = useState(null);
  const [news, setNews] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [userDraft, setUserDraft] = useState(emptyAdminUser);
  const [draft, setDraft] = useState(emptyNews);
  const [status, setStatus] = useState("");
  const [adminLanguage, setAdminLanguage] = useState("en");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const selectedPage = pageLinks.find((page) => page.slug === selectedSlug) || pageLinks[0];
  const t = (key) => adminT(adminLanguage, key);
  const headingTitle = selectedSlug === "settings" ? t("changePassword") : selectedPage?.label || adminT("en", "adminDashboard");
  const headingIntro = selectedSlug === "settings" ? "Update the password for your admin account." : adminT("en", "headingIntro");
  const showPublishedStatus = !["users", "settings", "changes"].includes(selectedSlug);

  useEffect(() => {
    api.getCurrentUser()
      .then((admin) => {
        setCurrentAdmin({ ...admin, username: admin.email });
      })
      .catch(() => {
        clearToken();
        navigate("/admin/login", { replace: true });
      });

    api.getHomepage().then((data) => {
      setHome({
        ...emptyHome,
        ...data,
        statsSq: ensureLocalizedList(data.stats || [], data.statsSq),
        focusAreasSq: ensureLocalizedList(data.focusAreas || [], data.focusAreasSq),
        partners: data.partners || []
      });
    }).catch(() => {});
    api.getNews(true).then(setNews).catch(() => {});
  }, [navigate]);

  useEffect(() => {
    if (!status) return undefined;
    const timer = window.setTimeout(() => setStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (selectedSlug === "home" || selectedSlug === "news" || selectedSlug === "users" || selectedSlug === "changes") return;

    setEditablePage(createFallbackPage(selectedSlug));
    api.getPage(selectedSlug).then((page) => {
      setEditablePage({ ...createFallbackPage(selectedSlug), ...page });
    }).catch(() => {});
  }, [selectedSlug]);

  useEffect(() => {
    if (selectedSlug !== "users" || !isMainAdmin) return;

    api.getAdminUsers().then(setAdminUsers).catch(() => {
      setStatus("You do not have access to manage users.");
      setSelectedSlug("home");
    });
  }, [isMainAdmin, selectedSlug]);

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
    await savePageContent(nextPage, t("sectionDeleted"));
    await deleteUploadedMedia([section?.documentUrl]);
  }

  async function saveHome(event) {
    event?.preventDefault();
    const saved = await saveHomepageContent(home, t("homepageSaved"));
    setHome(saved);
  }

  async function saveHomepageContent(content, message) {
    try {
      const saved = await api.updateHomepage(content);
      setStatus(message);
      return saved;
    } catch (error) {
      setStatus(`Error saving: ${error.message}`);
      console.error("Save error:", error);
      throw error;
    }
  }

  async function savePartner(index) {
    const partners = (home.partners || []).map((partner, partnerIndex) => (
      partnerIndex === index ? { ...partner, websiteUrl: normalizePartnerWebsiteUrl(partner.websiteUrl) } : partner
    ));
    const nextHome = { ...home, partners };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, t("partnerSaved"));
    setHome(saved);
  }

  function updateHomePartner(index, field, value) {
    setHome((current) => ({
      ...current,
      partners: (current.partners || []).map((partner, partnerIndex) => (
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
    const saved = await saveHomepageContent(nextHome, t("partnerAdded"));
    setHome(saved);
  }

  async function deleteHomePartner(index) {
    const partner = home.partners?.[index];
    const nextHome = {
      ...home,
      partners: (home.partners || []).filter((_, partnerIndex) => partnerIndex !== index)
    };
    setHome(nextHome);
    await saveHomepageContent(nextHome, t("partnerDeleted"));
    await deleteUploadedMedia([partner?.logoUrl]);
  }

  async function uploadHomeHeroImage(file) {
    if (!file) return;
    const previousImageUrl = home.heroImageUrl;
    const asset = await api.uploadMedia(file, "Homepage hero image", { folder: "Homepage" });
    const nextHome = { ...home, heroImageUrl: asset.url };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, t("heroUploaded"));
    setHome(saved);
    await deleteUploadedMedia([previousImageUrl]);
  }

  async function removeHomeHeroImage() {
    const previousImageUrl = home.heroImageUrl;
    const nextHome = { ...home, heroImageUrl: "" };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, t("heroRemoved"));
    setHome(saved);
    await deleteUploadedMedia([previousImageUrl]);
  }

  async function uploadPartnerLogo(index, file) {
    if (!file) return;
    const partner = (home.partners || [])[index];
    const previousLogoUrl = partner?.logoUrl;
    const asset = await api.uploadMedia(file, partner?.name || "Partner logo", { folder: "Partners" });
    const partners = (home.partners || []).map((item, partnerIndex) => (
      partnerIndex === index ? { ...item, logoUrl: asset.url } : item
    ));
    const nextHome = { ...home, partners };
    setHome(nextHome);
    const saved = await saveHomepageContent(nextHome, t("partnerLogoUploaded"));
    setHome(saved);
    await deleteUploadedMedia([previousLogoUrl]);
  }

  async function savePage(event) {
    event?.preventDefault();
    return savePageContent(editablePage);
  }

  async function savePageContent(pageDraft, message) {
    try {
      const payload = {
        ...pageDraft,
        sections: pageDraft.sections.map((section, index) => ({ ...section, sortOrder: index }))
      };
      const saved = await api.updatePage(pageDraft.slug, payload);
      setEditablePage(saved);
      setStatus(message || t("pageSaved"));
      return saved;
    } catch (error) {
      setStatus(`Error saving: ${error.message}`);
      console.error("Save page error:", error);
      throw error;
    }
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
    try {
      const saved = await api.updateNews(item.id, prepareNewsPayload(item));
      setNews((items) => items.map((newsItem) => (newsItem.id === saved.id ? saved : newsItem)));
      setStatus(t("newsUpdated"));
    } catch (error) {
      setStatus(`Error saving news: ${error.message}`);
      console.error("Save news error:", error);
    }
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
    setStatus(t("newsCreated"));
  }

  async function deleteNews(id) {
    const item = news.find((entry) => entry.id === id);
    await api.deleteNews(id);
    setNews((items) => items.filter((item) => item.id !== id));
    setStatus(t("newsDeleted"));
    await deleteUploadedMedia([
      item?.imageUrl,
      item?.thumbnailUrl,
      item?.documentUrl,
      ...(item?.gallery || [])
    ]);
  }

  async function createAdminUser(event) {
    event.preventDefault();
    const passwordError = validatePassword(userDraft.password);
    if (passwordError) {
      setStatus(passwordError);
      return;
    }

    const created = await api.createAdminUser(userDraft);
    setAdminUsers((users) => [...users, created].sort(sortAdminUsers));
    setUserDraft(emptyAdminUser);
    setStatus(t("userCreated"));
  }

  async function updateAdminUser(user) {
    if (user.password) {
      const passwordError = validatePassword(user.password);
      if (passwordError) {
        setStatus(passwordError);
        return;
      }
    }

    const saved = await api.updateAdminUser(user.id, {
      email: user.email,
      role: user.role,
      password: user.password || ""
    });
    setAdminUsers((users) => users.map((item) => (item.id === saved.id ? saved : item)).sort(sortAdminUsers));
    setStatus(t("userUpdated"));
  }

  async function deleteAdminUser(id) {
    await api.deleteAdminUser(id);
    setAdminUsers((users) => users.filter((user) => user.id !== id));
    setStatus(t("userDeleted"));
  }

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  function openPasswordSettings() {
    setSelectedSlug("settings");
    setIsAccountMenuOpen(false);
    setIsSidebarOpen(false);
  }

  return (
    <main className="admin-shell">
      <header className="admin-mobile-header">
        <button
          className="admin-mobile-menu-button"
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={isSidebarOpen}
        >
          <Menu size={22} />
        </button>
        <div className="admin-mobile-brand">
          <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" />
          <strong>Edu4Migration CMS</strong>
        </div>
        <div className="admin-mobile-profile">
          <button
            className={`admin-mobile-avatar ${isAccountMenuOpen ? "open" : ""}`}
            type="button"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
          >
            {getAdminInitial(currentAdmin)}
          </button>
          {isAccountMenuOpen ? (
            <div className="admin-mobile-account-menu" role="menu">
              <div className="admin-mobile-account-copy">
                <strong>{getAdminDisplayName(currentAdmin)}</strong>
                <span>{currentAdmin.role === "MainAdmin" ? "Super admin" : "Admin"}</span>
              </div>
              <button className="admin-menu-item" type="button" onClick={openPasswordSettings} role="menuitem">
                <Lock size={16} /> {t("changePassword")}
              </button>
              <button className="admin-menu-item danger" type="button" onClick={logout} role="menuitem">
                <LogOut size={16} /> {t("signOut")}
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <button
        className={`admin-sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        type="button"
        aria-label="Close admin menu"
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" />
          <div>
            <strong>Edu4Migration CMS</strong>
            {/* <span>{t("contentManagement")}</span> */}
          </div>
        </div>
        <button
          className="admin-sidebar-close"
          type="button"
          aria-label="Close admin menu"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} />
        </button>
        <nav className="admin-sidebar-pages" aria-label={t("editablePages")}>
          {pageGroups.map((group) => (
            <div className="admin-sidebar-group" key={group.label}>
              <span>{adminT("en", group.label.toLowerCase())}</span>
              {group.links.map((page) => (
                <button
                  className={selectedSlug === page.slug ? "active" : ""}
                  key={page.slug}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(page.slug);
                    setIsSidebarOpen(false);
                  }}
                >
                  {page.type === "home" ? <Home size={16} /> : page.type === "news" ? <Newspaper size={16} /> : page.type === "users" ? <UserRound size={16} /> : page.type === "changes" ? <History size={16} /> : <FileText size={16} />}
                  {page.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-user-menu">
          <button
            className={`admin-user-card ${isAccountMenuOpen ? "open" : ""}`}
            type="button"
            onClick={() => setIsAccountMenuOpen((open) => !open)}
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="menu"
          >
            <span className="admin-user-avatar">{getAdminInitial(currentAdmin)}</span>
            <span className="admin-user-card-copy">
              <strong>{getAdminDisplayName(currentAdmin)}</strong>
              <span className={currentAdmin.role === "MainAdmin" ? "super-admin" : ""}>{currentAdmin.role === "MainAdmin" ? "Super admin" : "Admin"}</span>
            </span>
            <ChevronDown className="admin-user-chevron" size={17} />
          </button>
          {isAccountMenuOpen ? (
            <div className="admin-user-dropdown" role="menu">
              <button
                className="admin-menu-item"
                type="button"
                onClick={openPasswordSettings}
                role="menuitem"
              >
                <Lock size={16} /> {t("changePassword")}
              </button>
              <button className="admin-menu-item danger" type="button" onClick={logout} role="menuitem">
                <LogOut size={16} /> {t("signOut")}
              </button>
            </div>
          ) : null}
        </div>
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
            <h1>{headingTitle}</h1>
            <p>{headingIntro}</p>
          </div>
          <div className="admin-heading-actions">
            <div className="admin-language-tabs" aria-label={t("editingLanguage")}>
              <button className={adminLanguage === "en" ? "active" : ""} type="button" onClick={() => setAdminLanguage("en")}>{t("english")}</button>
              <button className={adminLanguage === "sq" ? "active" : ""} type="button" onClick={() => setAdminLanguage("sq")}>{t("albanian")}</button>
            </div>
            {showPublishedStatus ? <span className="status-pill"><CheckCircle2 size={15} /> {t("published")}</span> : null}
            {selectedSlug === "home" ? <a className="btn btn-secondary dark" href="/" target="_blank" rel="noreferrer"><Eye size={16} /> {t("preview")}</a> : null}
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
                language={adminLanguage}
              />
            ) : null}

            {selectedSlug !== "home" && selectedSlug !== "news" && selectedSlug !== "partners" && selectedSlug !== "users" && selectedSlug !== "changes" && selectedSlug !== "settings" && editablePage ? (
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

            {selectedSlug === "users" && isMainAdmin ? (
              <AdminUsersEditor
                currentAdmin={currentAdmin}
                draft={userDraft}
                onCreate={createAdminUser}
                onDelete={deleteAdminUser}
                onDraftChange={setUserDraft}
                onSetUsers={setAdminUsers}
                onUpdate={updateAdminUser}
                users={adminUsers}
              />
            ) : null}

            {selectedSlug === "settings" ? (
              <PasswordChangeEditor
                currentAdmin={currentAdmin}
                language={adminLanguage}
              />
            ) : null}

            {selectedSlug === "changes" && isMainAdmin ? (
              <RecentChangesPage language={adminLanguage} />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminUsersEditor({ currentAdmin, draft, onCreate, onDelete, onDraftChange, onSetUsers, onUpdate, users }) {
  function updateUser(id, field, value) {
    onSetUsers((items) => items.map((user) => (
      user.id === id ? { ...user, [field]: value } : user
    )));
  }

  return (
    <div className="admin-home-editor">
      <EditorSection
        icon={<UserRound size={18} />}
        title="Admin users"
        description="Only the main admin can create users, change roles, reset passwords, and delete other admins."
      >
        <form className="admin-user-create" onSubmit={onCreate}>
          <label>Username<input type="text" value={draft.email} onChange={(event) => onDraftChange({ ...draft, email: event.target.value })} required /></label>
          <PasswordField
            label="Password"
            value={draft.password}
            onChange={(value) => onDraftChange({ ...draft, password: value })}
            required
          />
          <label>Role
            <select value={draft.role} onChange={(event) => onDraftChange({ ...draft, role: event.target.value })}>
              <option value="Admin">Admin</option>
              <option value="MainAdmin">Super admin</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit"><Plus size={16} /> Add admin</button>
          <p className="admin-password-rules">{passwordRequirementsText}</p>
        </form>

        <div className="admin-user-management-list">
          {users.map((user) => {
            const isSelf = user.email === currentAdmin.email;
            return (
              <article className="admin-user-management-card" key={user.id}>
                <div className="admin-user-management-avatar"><UserRound size={20} /></div>
                <div className="admin-user-management-fields">
                  <label>Username<input type="text" value={user.email} onChange={(event) => updateUser(user.id, "email", event.target.value)} /></label>
                  <label>Role
                    <select value={user.role} onChange={(event) => updateUser(user.id, "role", event.target.value)} disabled={isSelf}>
                      <option value="Admin">Admin</option>
                      <option value="MainAdmin">Super admin</option>
                    </select>
                  </label>
                  <PasswordField
                    className="full"
                    label="New password (optional)"
                    value={user.password || ""}
                    onChange={(value) => updateUser(user.id, "password", value)}
                  />
                  <p className="admin-password-rules full">{passwordRequirementsText}</p>
                </div>
                <div className="admin-user-management-actions">
                  <span className={`status-pill ${user.role === "MainAdmin" ? "main-admin" : ""}`}>{user.role === "MainAdmin" ? "Super admin" : "Admin"}</span>
                  <button className="btn btn-primary" type="button" onClick={() => onUpdate(user)}><Save size={16} /> Save user</button>
                  <button className="btn btn-danger" type="button" disabled={isSelf} onClick={() => onDelete(user.id)}><Trash2 size={16} /> Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </EditorSection>
    </div>
  );
}

function PasswordField({ className = "", disabled = false, label, onChange, required = false, value }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className={className}>
      {label}
      <span className="password-input-wrapper">
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          disabled={disabled}
        />
        <button
          className="password-visibility-toggle"
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}

function HomepageEditor({ home, language, onChange, onHeroImageUpload, onHeroImageRemove, onListChange, onSubmit }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
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
        title={h("heroSection")}
        description={h("heroSectionDesc")}
        action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveChanges")}</button>}
      >
        <div className="form-grid">
          <label>{t("heroEyebrow")}<input value={home[heroEyebrowField] || ""} onChange={(event) => onChange(heroEyebrowField, event.target.value)} /></label>
          <label>{t("heroTitle")}<input value={home[heroTitleField] || ""} onChange={(event) => onChange(heroTitleField, event.target.value)} /></label>
          <label>{t("heroSubtitle")}<input value={home[heroSubtitleField] || ""} onChange={(event) => onChange(heroSubtitleField, event.target.value)} /></label>
          <label>{t("heroImage")}<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => onHeroImageUpload(event.target.files?.[0] || null)} /></label>
          <label className="full">{t("heroBody")}<textarea value={home[heroBodyField] || ""} onChange={(event) => onChange(heroBodyField, event.target.value)} /></label>
        </div>
        <HeroImageManager imageUrl={home.heroImageUrl} language={language} onRemove={onHeroImageRemove} />
      </EditorSection>

      <EditorSection
        icon={<Star size={18} />}
        title={h("statistics")}
        description={h("statisticsDesc")}
      >
        <EditableHomeList items={home[statsList] || []} fields={["value", "label"]} listName={statsList} language={language} onChange={onListChange} variant="stats" />
      </EditorSection>

      <EditorSection
        icon={<FileText size={18} />}
        title={h("focusAreas")}
        description={h("focusAreasDesc")}
      >
        <EditableHomeList items={home[focusList] || []} fields={["title", "body"]} listName={focusList} language={language} onChange={onListChange} variant="focus" />
      </EditorSection>
    </form>
  );
}

function HeroImageManager({ imageUrl, language, onRemove }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="home-image-manager">
      <h3>{h("currentHeroImage")}</h3>
      <figure className="home-image-tile">
        <img src={resolveMediaUrl(imageUrl)} alt="" />
        <figcaption>{imageUrl}</figcaption>
        <button className="icon-btn news-image-delete-button" type="button" aria-label={t("removeHeroImage")} onClick={onRemove}>
          <Trash2 size={17} />
        </button>
      </figure>
    </div>
  );
}

function PartnersEditor({ partners, language, onAddPartner, onDeletePartner, onLogoUpload, onPartnerChange, onSavePartner }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
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
          title={h("projectPartners")}
          description={h("projectPartnersDesc")}
          action={(
            <div className="admin-actions">
              <button className="btn btn-secondary dark" type="button" onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t("addPartner")}</button>
            </div>
          )}
        >
          <div className="admin-partner-grid">
            {partners.map((partner, index) => (
              <article className="admin-partner-editor-card" key={`${index}-${partner.logoUrl || "partner"}`}>
                <div className="admin-partner-logo-preview">
                  {partner.logoUrl ? <img src={resolveMediaUrl(partner.logoUrl)} alt="" /> : <span>{t("logo")}</span>}
                </div>
                <div className="admin-partner-fields">
                  <label>{t("name")}<input value={partner.name || ""} onChange={(event) => onPartnerChange(index, "name", event.target.value)} /></label>
                  <label>{t("country")}<input value={partner.country || ""} onChange={(event) => onPartnerChange(index, "country", event.target.value)} /></label>
                  <label>{t("role")}<input value={partner.role || ""} onChange={(event) => onPartnerChange(index, "role", event.target.value)} /></label>
                  <label>{t("websiteLink")}<input value={partner.websiteUrl || ""} onBlur={() => onSavePartner(index)} onChange={(event) => onPartnerChange(index, "websiteUrl", event.target.value)} /></label>
                  <label className="full">{t("logoImage")}<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => onLogoUpload(index, event.target.files?.[0] || null)} /></label>
                </div>
                <div className="admin-partner-actions">
                  {partner.websiteUrl ? <a className="btn btn-secondary dark" href={normalizePartnerWebsiteUrl(partner.websiteUrl)} target="_blank" rel="noreferrer">{t("openLink")}</a> : null}
                  <button className="btn btn-primary" type="button" onClick={() => onSavePartner(index)}><Save size={16} /> {t("savePartner")}</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeletePartner(index)}><Trash2 size={16} /> {t("delete")}</button>
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
                <span className="eyebrow dark">{h("projectPartner")}</span>
                <h2>{h("addPartner")}</h2>
              </div>
              <button className="icon-btn" type="button" aria-label={t("cancel")} onClick={() => setIsAddOpen(false)}><X size={20} /></button>
            </div>

            <div className="admin-partner-modal-layout">
              <div className="admin-partner-logo-preview">
                {draftLogoPreview ? <img src={draftLogoPreview} alt="" /> : <span>{t("logo")}</span>}
              </div>
              <div className="admin-partner-fields">
                <label>{t("name")}<input value={draftPartner.name} onChange={(event) => setDraftPartner({ ...draftPartner, name: event.target.value })} required /></label>
                <label>{t("country")}<input value={draftPartner.country} onChange={(event) => setDraftPartner({ ...draftPartner, country: event.target.value })} /></label>
                <label>{t("role")}<input value={draftPartner.role} onChange={(event) => setDraftPartner({ ...draftPartner, role: event.target.value })} /></label>
                <label>{t("websiteLink")}<input value={draftPartner.websiteUrl} onChange={(event) => setDraftPartner({ ...draftPartner, websiteUrl: event.target.value })} /></label>
                <label className="full">{t("logoImage")}<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setDraftLogoFile(event.target.files?.[0] || null)} /></label>
              </div>
            </div>

            <div className="admin-actions">
              <button className="btn btn-primary" type="submit"><Save size={16} /> {t("addPartner")}</button>
              <button className="btn btn-secondary dark" type="button" onClick={() => setIsAddOpen(false)}>{t("cancel")}</button>
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

function EditableHomeList({ title, items, fields, listName, language, onChange, variant = "default" }) {
  return (
    <div className={`nested-editor nested-editor-${variant}`}>
      {title ? <h3>{title}</h3> : null}
      {items.map((item, index) => (
        <div className="nested-editor-row" key={`${listName}-${index}`}>
          {fields.map((field) => (
            <label key={field}>
              {adminFieldLabel(language, field)}
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

const projectEditorSlugs = new Set(["management", "objectives", "outcomes", "work-packages", "deliverables", "milestones", "updates", "courses", "contact"]);
const resourceEditorSlugs = new Set(["documents", "case-studies"]);

function ContentEditor({ page, language, onFieldChange, onSectionChange, onAddSection, onDeleteSection, onSaveSection, onSubmit }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
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
    await onSaveSection?.(index, updates, t("pdfUploaded"));
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
    await onSaveSection?.(index, updates, t("pdfDeleted"));
    await deleteUploadedMedia([section.documentUrl]);
  }

  if (page.slug === "overview") {
    return (
      <form className="admin-home-editor" onSubmit={onSubmit}>
        <EditorSection
          icon={<FileText size={18} />}
          title={h("overviewHeader")}
          description={h("overviewHeaderDesc")}
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveChanges")}</button>}
        >
          <div className="form-grid">
            <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<Star size={18} />}
          title={h("overviewCards")}
          description={h("overviewCardsDesc")}
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addCard")}</button>}
        >
          <div className="admin-overview-card-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-overview-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-overview-card-number">{String(index + 1).padStart(2, "0")}</div>
                <label>{t("cardTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                <label>{t("cardBody")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("deleteCard")}</button>
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
          title={h("downloadsHeader")}
          description={h("downloadsHeaderDesc")}
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("savePageHeader")}</button>}
        >
          <div className="form-grid">
            <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<FileText size={18} />}
          title={h("pdfDocuments")}
          description={h("pdfDocumentsDesc")}
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addDocument")}</button>}
        >
          <div className="admin-document-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-document-card" key={`${page.slug}-${index}`}>
                <div className="admin-document-icon"><FileText size={28} /></div>
                <div className="admin-document-fields">
                  <label>{t("documentTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>{t("buttonLabel")}<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
                  <label className="full">{t("description")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  <label className="full">{t("replacePdf")}<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
                </div>
                {section.documentUrl ? (
                  <div className="news-document-tile">
                    <FileText size={22} />
                    <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || section[sectionTitleField] || t("pdfDocument")}</a>
                    <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                      <Trash2 size={16} /> {t("deletePdf")}
                    </button>
                  </div>
                ) : (
                  <div className="admin-document-empty">{t("noPdf")}</div>
                )}
                <div className="admin-document-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveDocument")}</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("deleteCard")}</button>
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
          title={h("eventsHeader")}
          description={h("eventsHeaderDesc")}
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("savePageHeader")}</button>}
        >
          <div className="form-grid">
            <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<CalendarDays size={18} />}
          title={h("eventCards")}
          description={h("eventCardsDesc")}
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addEvent")}</button>}
        >
          <div className="admin-events-list">
            {page.sections?.map((section, index) => {
              const preview = splitEventBody(section[sectionBodyField] || "");

              return (
                <article className="admin-event-card-editor" key={`${page.slug}-${index}`}>
                  <div className="admin-event-preview">
                    <div className="event-meta">{preview.meta}</div>
                    <h3>{section[sectionTitleField] || t("untitledEvent")}</h3>
                    <p>{preview.description}</p>
                  </div>
                  <div className="admin-event-fields">
                    <label>{t("eventTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                    <label>{t("eventText")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  </div>
                  <div className="admin-event-actions">
                    <button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveChanges")}</button>
                    <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("delete")}</button>
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
          title={`${page.title || h("page")} ${h("header")}`}
          description={h("pageHeaderDesc")}
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("savePageHeader")}</button>}
        >
          <div className="form-grid">
            <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<Star size={18} />}
          title={h("contentCards")}
          description={h("contentCardsDesc")}
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addCard")}</button>}
        >
          <div className={`admin-project-card-grid admin-project-card-grid-${page.slug}`}>
            {page.sections?.map((section, index) => (
              <article className="admin-project-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-project-card-preview">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{section[sectionTitleField] || t("untitledCard")}</h3>
                  <p>{section[sectionBodyField] || t("cardBodyPlaceholder")}</p>
                </div>
                <div className="admin-project-card-fields">
                  <label>{t("cardTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>{t("cardBody")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                </div>
                <div className="admin-project-card-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveChanges")}</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("delete")}</button>
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
          title={`${page.title || h("resource")} ${h("header")}`}
          description={h("resourceHeaderDesc")}
          action={<button className="btn btn-primary" type="submit"><Save size={16} /> {t("savePageHeader")}</button>}
        >
          <div className="form-grid">
            <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
            <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
            <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
          </div>
        </EditorSection>

        <EditorSection
          icon={<FileText size={18} />}
          title={h("resourceCards")}
          description={h("resourceCardsDesc")}
          action={<button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addResource")}</button>}
        >
          <div className="admin-resource-card-grid">
            {page.sections?.map((section, index) => (
              <article className="admin-resource-card-editor" key={`${page.slug}-${index}`}>
                <div className="admin-resource-card-preview">
                  <div className="admin-resource-card-icon"><FileText size={24} /></div>
                  <div>
                    <h3>{section[sectionTitleField] || t("untitledResource")}</h3>
                    <p>{section[sectionBodyField] || t("resourceBodyPlaceholder")}</p>
                  </div>
                </div>
                <div className="admin-resource-card-fields">
                  <label>{t("cardTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
                  <label>{t("buttonLabel")}<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
                  <label className="full">{t("description")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
                  <label className="full">{t("pdfDocument")}<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
                </div>
                {section.documentUrl ? (
                  <div className="news-document-tile">
                    <FileText size={22} />
                    <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || section[sectionTitleField] || t("pdfDocument")}</a>
                    <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                      <Trash2 size={16} /> {t("deletePdf")}
                    </button>
                  </div>
                ) : (
                  <div className="admin-document-empty">{t("noPdf")}</div>
                )}
                <div className="admin-resource-card-actions">
                  <button className="btn btn-primary" type="submit"><Save size={16} /> {t("saveChanges")}</button>
                  <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("delete")}</button>
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
      <h2>{page.title || h("pageContent")}</h2>
      <div className="form-grid">
        <label>{t("eyebrow")}<input value={page[eyebrowField] || ""} onChange={(event) => onFieldChange(eyebrowField, event.target.value)} /></label>
        <label>{t("pageTitle")}<input value={page[titleField] || ""} onChange={(event) => onFieldChange(titleField, event.target.value)} /></label>
        <label className="full">{t("intro")}<textarea value={page[introField] || ""} onChange={(event) => onFieldChange(introField, event.target.value)} /></label>
      </div>

      <div className="section-editor-heading">
        <h3>{h("pageSections")}</h3>
        <button className="btn btn-secondary dark" type="button" onClick={onAddSection}><Plus size={16} /> {t("addSection")}</button>
      </div>

      <div className="admin-section-list">
        {page.sections?.map((section, index) => (
          <article className="admin-section-item" key={`${page.slug}-${index}`}>
            <label>{t("sectionTitle")}<input value={section[sectionTitleField] || ""} onChange={(event) => onSectionChange(index, sectionTitleField, event.target.value)} /></label>
            <label>{t("sectionBody")}<textarea value={section[sectionBodyField] || ""} onChange={(event) => onSectionChange(index, sectionBodyField, event.target.value)} /></label>
            <label>{t("documentTitle")}<input value={section[documentTitleField] || ""} onChange={(event) => onSectionChange(index, documentTitleField, event.target.value)} /></label>
            <label>{t("pdfDocument")}<input type="file" accept=".pdf" onChange={(event) => uploadSectionDocument(index, event.target.files?.[0] || null)} /></label>
            {section.documentUrl ? (
              <div className="news-document-tile">
                <FileText size={22} />
                <a href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">{section[documentTitleField] || t("pdfDocument")}</a>
                <button className="btn btn-danger" type="button" onClick={() => deleteSectionDocument(index, section)}>
                  <Trash2 size={16} /> {t("deletePdf")}
                </button>
              </div>
            ) : null}
            <button className="btn btn-danger" type="button" onClick={() => onDeleteSection(index)}><Trash2 size={16} /> {t("deleteSection")}</button>
          </article>
        ))}
      </div>

      <button className="btn btn-primary" type="submit"><Save size={16} /> {t("savePage")}</button>
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
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
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

  async function reorderNewsImages(item, fromIndex, toIndex) {
    const orderedImages = reorderList(getNewsImages(item), fromIndex, toIndex);
    const updatedItem = {
      ...item,
      imageUrl: orderedImages[0] || "",
      thumbnailUrl: item.thumbnailUrl && orderedImages.includes(item.thumbnailUrl) ? item.thumbnailUrl : orderedImages[0] || "",
      gallery: orderedImages
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

  if (isAddOpen) {
    return (
      <NewsItemEditor
        actionLabel={t("createNews")}
        documentFile={draftDocumentFile}
        imageFiles={draftImageFiles}
        item={draft}
        language={language}
        modeTitle={h("addNews")}
        onBack={() => {
          setDraftImageFiles([]);
          setDraftDocumentFile(null);
          setIsAddOpen(false);
        }}
        onChange={onDraftChange}
        onDocumentFileChange={setDraftDocumentFile}
        onImageFilesChange={setDraftImageFiles}
        onImageFilesReorder={(fromIndex, toIndex) => setDraftImageFiles((files) => reorderList(files, fromIndex, toIndex))}
        onSubmit={createNewsWithImages}
        submitIcon={<Save size={16} />}
      />
    );
  }

  if (editingItem) {
    return (
      <NewsItemEditor
        actionLabel={t("saveChanges")}
        documentFile={editingDocumentFile}
        imageFiles={editingImageFiles}
        item={editingItem}
        language={language}
        modeTitle={editingItem.title || h("editNews")}
        onBack={() => {
          setEditingImageFiles([]);
          setEditingDocumentFile(null);
          setEditingId(null);
        }}
        onChange={(nextItem) => onSetNews((items) => items.map((entry) => entry.id === editingItem.id ? nextItem : entry))}
        onDelete={deleteEditingItem}
        onDocumentFileChange={setEditingDocumentFile}
        onDocumentRemove={removeNewsDocument}
        onImageFilesChange={setEditingImageFiles}
        onImageFilesReorder={(fromIndex, toIndex) => setEditingImageFiles((files) => reorderList(files, fromIndex, toIndex))}
        onImageRemove={removeNewsImage}
        onImageReorder={reorderNewsImages}
        onSetThumbnail={setNewsThumbnail}
        onSubmit={saveEditingItem}
        submitIcon={<Save size={16} />}
      />
    );
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{h("manageNews")}</h2>
            <p>{h("manageNewsDesc")}</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} /> {t("addNews")}
          </button>
        </div>
        <div className="admin-news-card-grid">
          {news.map((item) => (
            <button className="admin-news-card" key={item.id} type="button" onClick={() => setEditingId(item.id)}>
              <div className="admin-news-card-image">
                {item.thumbnailUrl || item.imageUrl ? <img src={resolveMediaUrl(item.thumbnailUrl || item.imageUrl)} alt="" /> : <span>Edu4Migration</span>}
              </div>
              <div className="admin-news-card-body">
                <span className="admin-news-card-date"><CalendarDays size={15} /> {toDateInputValue(item.publishedAt) || t("draft")}</span>
                <h3>{item[titleField] || item.title}</h3>
                <p>{item[excerptField] || item.excerpt}</p>
                <strong>{item.isPublished ? t("published") : t("draft")}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function NewsItemEditor({
  actionLabel,
  documentFile,
  imageFiles,
  item,
  language,
  modeTitle,
  onBack,
  onChange,
  onDelete,
  onDocumentFileChange,
  onDocumentRemove,
  onImageFilesChange,
  onImageFilesReorder,
  onImageRemove,
  onImageReorder,
  onSetThumbnail,
  onSubmit,
  submitIcon
}) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
  const titleField = localizedField("title", language);
  const excerptField = localizedField("excerpt", language);
  const contentField = localizedField("content", language);
  const documentTitleField = localizedField("documentTitle", language);

  function updateField(field, value) {
    onChange({ ...item, [field]: value });
  }

  return (
    <form className="admin-news-page-editor" onSubmit={onSubmit}>
      <div className="admin-news-page-header">
        <button className="btn btn-secondary dark" type="button" onClick={onBack}>
          <ArrowLeft size={16} /> {t("cancel")}
        </button>
        <div>
          <span className="eyebrow dark">{h("newsItem")}</span>
          <h2>{modeTitle}</h2>
        </div>
        <div className="admin-news-page-actions">
          {onDelete ? <button className="btn btn-danger" type="button" onClick={onDelete}><Trash2 size={16} /> {t("delete")}</button> : null}
          <button className="btn btn-primary" type="submit">{submitIcon} {actionLabel}</button>
        </div>
      </div>

      <div className="admin-news-page-grid">
        <EditorSection icon={<Newspaper size={18} />} title={h("contentField")} description="Write the news story without typing HTML. Select text to add bold, italic, or links.">
          <div className="form-grid">
            <label>{t("title")}<input value={item[titleField] || ""} onChange={(event) => updateField(titleField, event.target.value)} required={language === "en"} /></label>
            <label>{t("date")}<input type="date" value={toDateInputValue(item.publishedAt)} onChange={(event) => updateField("publishedAt", event.target.value)} /></label>
            <label className="full">{t("excerpt")}<textarea value={item[excerptField] || ""} onChange={(event) => updateField(excerptField, event.target.value)} required={language === "en"} /></label>
            <RichTextEditor
              label={t("contentField")}
              value={item[contentField] || ""}
              onChange={(value) => updateField(contentField, value)}
            />
            <label className="checkbox-field"><input type="checkbox" checked={item.isPublished} onChange={(event) => updateField("isPublished", event.target.checked)} /> {t("published")}</label>
          </div>
        </EditorSection>

        <aside className="admin-news-side-panel">
          <EditorSection icon={<FileText size={18} />} title={h("pdfDocument")} description="Attach a PDF document to this news post.">
            <div className="form-grid single">
              <label>{t("documentTitle")}<input value={item[documentTitleField] || ""} onChange={(event) => updateField(documentTitleField, event.target.value)} /></label>
              <label>{item.documentUrl ? t("replacePdfDocument") : t("pdfDocument")}<input type="file" accept=".pdf" onChange={(event) => onDocumentFileChange(event.target.files?.[0] || null)} /></label>
            </div>
            {documentFile ? <div className="admin-document-empty">{documentFile.name}</div> : null}
            {item.documentUrl && onDocumentRemove ? <NewsDocumentManager item={item} language={language} onRemove={onDocumentRemove} /> : null}
          </EditorSection>

          <EditorSection icon={<Star size={18} />} title={h("pictures")} description="Upload pictures, choose the thumbnail, and drag existing pictures to reorder the gallery.">
            <label className="full">{item.id ? t("addMorePictures") : t("newsPictures")}<input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={(event) => onImageFilesChange([...imageFiles, ...Array.from(event.target.files || [])])} /></label>
            {item.id ? (
              <NewsImageManager
                item={item}
                language={language}
                onRemove={onImageRemove}
                onReorder={onImageReorder}
                onSetThumbnail={onSetThumbnail}
              />
            ) : null}
            <ImagePreviewGrid files={imageFiles} language={language} onReorder={onImageFilesReorder} onRemove={(index) => onImageFilesChange(imageFiles.filter((_, i) => i !== index))} />
          </EditorSection>
        </aside>
      </div>
    </form>
  );
}

function RichTextEditor({ label, onChange, value }) {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const linkSelectionRef = useRef(null);
  const selectedLinkRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, link: false });
  const [linkDraft, setLinkDraft] = useState({ open: false, selectedText: "", url: "", linkElement: null });

  useEffect(() => {
    const editor = editorRef.current;
    if (document.activeElement === editor || linkDraft.open) return;
    if (editor && editor.innerHTML !== (value || "")) {
      editor.innerHTML = value || "";
    }
  }, [linkDraft.open, value]);

  useEffect(() => {
    function handleSelectionChange() {
      rememberSelection();
      updateActiveFormats();
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  function syncEditor() {
    onChange((editorRef.current?.innerHTML || "").replace(/\u200B/g, ""));
  }

  function isRangeInEditor(range) {
    const editor = editorRef.current;
    return Boolean(editor && range && editor.contains(range.commonAncestorContainer));
  }

  function getEditorRange() {
    const selection = window.getSelection();
    const currentRange = selection?.rangeCount ? selection.getRangeAt(0) : null;

    if (isRangeInEditor(currentRange)) {
      return currentRange.cloneRange();
    }

    if (isRangeInEditor(savedRangeRef.current)) {
      return savedRangeRef.current.cloneRange();
    }

    return null;
  }

  function getTextOffset(node, offset) {
    const editor = editorRef.current;
    if (!editor) return 0;

    const range = document.createRange();
    range.setStart(editor, 0);
    range.setEnd(node, offset);
    return range.toString().length;
  }

  function getSelectionSnapshot(range) {
    if (!range || !isRangeInEditor(range)) return null;

    return {
      start: getTextOffset(range.startContainer, range.startOffset),
      end: getTextOffset(range.endContainer, range.endOffset),
      text: range.toString()
    };
  }

  function getRangeFromSnapshot(snapshot) {
    const editor = editorRef.current;
    if (!editor || !snapshot || snapshot.end <= snapshot.start) return null;

    const range = document.createRange();
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let startSet = false;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nextOffset = currentOffset + node.nodeValue.length;

      if (!startSet && snapshot.start >= currentOffset && snapshot.start <= nextOffset) {
        range.setStart(node, snapshot.start - currentOffset);
        startSet = true;
      }

      if (startSet && snapshot.end >= currentOffset && snapshot.end <= nextOffset) {
        range.setEnd(node, snapshot.end - currentOffset);
        return range;
      }

      currentOffset = nextOffset;
    }

    return null;
  }

  function closestLink(node) {
    const editor = editorRef.current;
    let current = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode;

    while (current && current !== editor) {
      if (current.nodeType === Node.ELEMENT_NODE && current.tagName === "A") {
        return current;
      }
      current = current.parentNode;
    }

    return null;
  }

  function getSelectedLink(range = getEditorRange()) {
    const editor = editorRef.current;
    const selection = window.getSelection();
    const directLink = closestLink(selection?.anchorNode) || closestLink(selection?.focusNode);
    if (directLink) return directLink;

    if (!editor || !range) return null;

    const links = [...editor.querySelectorAll("a")];
    return links.find((link) => {
      try {
        return range.intersectsNode(link);
      } catch {
        return false;
      }
    }) || null;
  }

  function cleanEditorArtifacts() {
    const editor = editorRef.current;
    if (!editor) return;

    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    const emptyNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      node.nodeValue = node.nodeValue.replace(/\u200B/g, "");
      if (!node.nodeValue) emptyNodes.push(node);
    }

    emptyNodes.forEach((node) => node.parentNode?.removeChild(node));
  }

  function rememberSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    savedRangeRef.current = range.cloneRange();
    selectedLinkRef.current = getSelectedLink(range);
  }

  function updateActiveFormats() {
    const range = getEditorRange();
    if (!range) {
      setActiveFormats({ bold: false, italic: false, link: false });
      return;
    }

    setActiveFormats({
      bold: Boolean(closestFormat(range.startContainer, "strong") || closestFormat(range.startContainer, "b") || closestStyledFormat(range.startContainer, "bold")),
      italic: Boolean(closestFormat(range.startContainer, "em") || closestFormat(range.startContainer, "i") || closestStyledFormat(range.startContainer, "italic")),
      link: Boolean(getSelectedLink(range))
    });
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }

  function applyLinkAttributes(link, url) {
    if (!link || !url) return;
    link.href = /^https?:\/\//i.test(url) || url.startsWith("mailto:") ? url : `https://${url}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  function closestFormat(node, tagName) {
    const editor = editorRef.current;
    let current = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode;

    while (current && current !== editor) {
      if (current.nodeType === Node.ELEMENT_NODE && current.tagName?.toLowerCase() === tagName) {
        return current;
      }
      current = current.parentNode;
    }

    return null;
  }

  function closestStyledFormat(node, format) {
    const editor = editorRef.current;
    let current = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentNode;

    while (current && current !== editor) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const style = current.getAttribute("style") || "";
        if (format === "bold" && /font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) return current;
        if (format === "italic" && /font-style\s*:\s*italic/i.test(style)) return current;
      }
      current = current.parentNode;
    }

    return null;
  }

  function normalizeEditorFormatting() {
    const editor = editorRef.current;
    if (!editor) return;

    [...editor.querySelectorAll("span")].forEach((span) => {
      const style = span.getAttribute("style") || "";
      const isBold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style);
      const isItalic = /font-style\s*:\s*italic/i.test(style);
      if (!isBold && !isItalic) return;

      const wrapper = document.createElement(isBold ? "strong" : "em");
      wrapper.append(...span.childNodes);

      if (isBold && isItalic) {
        const inner = document.createElement("em");
        inner.append(...wrapper.childNodes);
        wrapper.append(inner);
      }

      span.replaceWith(wrapper);
    });
  }

  function unwrapElement(element) {
    const parent = element?.parentNode;
    if (!parent) return null;

    const lastChild = element.lastChild;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
    return lastChild;
  }

  function placeNormalCaretAfter(node) {
    const editor = editorRef.current;
    if (!editor) return;

    const spacer = document.createTextNode("\u200B");
    node.parentNode?.insertBefore(spacer, node.nextSibling);

    const range = document.createRange();
    range.setStart(spacer, 1);
    range.collapse(true);
    savedRangeRef.current = range.cloneRange();

    const selection = window.getSelection();
    editor.focus({ preventScroll: true });
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function applyInlineFormat(tagName) {
    const editor = editorRef.current;
    const range = getEditorRange();
    if (!editor || !range || range.collapsed) {
      editor?.focus({ preventScroll: true });
      return;
    }

    const command = tagName === "strong" ? "bold" : "italic";
    restoreSelection();
    document.execCommand(command, false, null);
    normalizeEditorFormatting();

    const selection = window.getSelection();
    if (selection?.rangeCount) {
      selection.collapseToEnd();
      const caretRange = selection.rangeCount ? selection.getRangeAt(0) : null;
      const activeNode = caretRange?.startContainer;
      const formatElement = closestFormat(activeNode, tagName)
        || (tagName === "strong" ? closestFormat(activeNode, "b") || closestStyledFormat(activeNode, "bold") : closestFormat(activeNode, "i") || closestStyledFormat(activeNode, "italic"));

      if (formatElement) {
        placeNormalCaretAfter(formatElement);
      } else if (caretRange) {
        savedRangeRef.current = caretRange.cloneRange();
      }
    }

    editor.focus({ preventScroll: true });
    updateActiveFormats();
    syncEditor();
  }

  function openLinkPanel() {
    rememberSelection();
    const range = getEditorRange();
    const selectedLink = getSelectedLink(range);
    const selectedText = range?.toString() || selectedLink?.textContent || "";

    if (!selectedLink && !selectedText.trim()) {
      editorRef.current?.focus({ preventScroll: true });
      return;
    }

    linkSelectionRef.current = getSelectionSnapshot(range);
    selectedLinkRef.current = selectedLink;
    setLinkDraft({
      open: true,
      selectedText: selectedText || linkSelectionRef.current?.text || "",
      url: selectedLink?.getAttribute("href") || "",
      linkElement: selectedLink
    });
  }

  function applyLink() {
    const trimmedUrl = linkDraft.url.trim();
    const editor = editorRef.current;
    if (!editor) return;

    const selectedLink = linkDraft.linkElement || selectedLinkRef.current;
    if (selectedLink) {
      if (!trimmedUrl) {
        const caretTarget = unwrapElement(selectedLink);
        if (caretTarget) placeNormalCaretAfter(caretTarget);
      } else {
        applyLinkAttributes(selectedLink, trimmedUrl);
        placeNormalCaretAfter(selectedLink);
      }
      linkSelectionRef.current = null;
      selectedLinkRef.current = null;
      setLinkDraft({ open: false, selectedText: "", url: "", linkElement: null });
      updateActiveFormats();
      syncEditor();
      return;
    }

    const range = getRangeFromSnapshot(linkSelectionRef.current) || getEditorRange();
    if (!trimmedUrl || !range || range.collapsed) {
      editorRef.current?.focus({ preventScroll: true });
      return;
    }

    editor.focus({ preventScroll: true });
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    const link = document.createElement("a");
    applyLinkAttributes(link, trimmedUrl);
    link.appendChild(range.extractContents());
    range.insertNode(link);
    placeNormalCaretAfter(link);
    linkSelectionRef.current = null;
    selectedLinkRef.current = null;
    setLinkDraft({ open: false, selectedText: "", url: "", linkElement: null });
    updateActiveFormats();
    syncEditor();
  }

  function removeCurrentLink() {
    const link = linkDraft.linkElement || selectedLinkRef.current;
    if (!link) return;

    const caretTarget = unwrapElement(link);
    if (caretTarget) placeNormalCaretAfter(caretTarget);
    linkSelectionRef.current = null;
    selectedLinkRef.current = null;
    setLinkDraft({ open: false, selectedText: "", url: "", linkElement: null });
    updateActiveFormats();
    syncEditor();
  }

  return (
    <div className="full rich-text-field">
      <span>{label}</span>
      <div className="rich-text-toolbar" aria-label="Formatting tools">
        <button className={activeFormats.bold ? "active" : ""} type="button" onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={() => applyInlineFormat("strong")}><Bold size={16} /> Bold</button>
        <button className={activeFormats.italic ? "active" : ""} type="button" onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={() => applyInlineFormat("em")}><Italic size={16} /> Italic</button>
        <button className={activeFormats.link ? "active" : ""} type="button" onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={openLinkPanel}><Link2 size={16} /> Link</button>
      </div>
      {linkDraft.open ? (
        <div className="rich-text-link-panel">
          <div className="rich-text-link-selection">
            <span>Selected text</span>
            <strong>{linkDraft.selectedText}</strong>
          </div>
          <label>URL<input value={linkDraft.url} onChange={(event) => setLinkDraft((draft) => ({ ...draft, url: event.target.value }))} placeholder="https://example.com" /></label>
          <div className="rich-text-link-actions">
            <button className="btn btn-primary" type="button" onMouseDown={(event) => event.preventDefault()} onClick={applyLink}><Link2 size={16} /> {linkDraft.linkElement ? "Update" : "Add"} Link</button>
            {linkDraft.linkElement ? (
              <button className="btn btn-danger" type="button" onMouseDown={(event) => event.preventDefault()} onClick={removeCurrentLink}>Remove</button>
            ) : null}
            <button className="btn btn-secondary dark" type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => {
              linkSelectionRef.current = null;
              setLinkDraft({ open: false, selectedText: "", url: "", linkElement: null });
              editorRef.current?.focus({ preventScroll: true });
            }}>Cancel</button>
          </div>
        </div>
      ) : null}
      <div
        className="rich-text-editor"
        contentEditable
        onBlur={() => {
          cleanEditorArtifacts();
          syncEditor();
        }}
        onInput={syncEditor}
        onMouseUp={() => {
          rememberSelection();
          updateActiveFormats();
        }}
        onKeyUp={() => {
          rememberSelection();
          updateActiveFormats();
        }}
        onPaste={(event) => {
          event.preventDefault();
          const text = event.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
          syncEditor();
        }}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />
    </div>
  );
}

function getNewsImages(item) {
  return [...(item.gallery || []), item.thumbnailUrl, item.imageUrl].filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);
}

function NewsImageManager({ item, language, onRemove, onReorder, onSetThumbnail }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
  const images = getNewsImages(item);
  const [dragIndex, setDragIndex] = useState(null);

  if (!images.length) {
    return null;
  }

  return (
    <div className="news-image-manager">
      <h3>{h("pictures")}</h3>
      <div className="news-image-grid">
        {images.map((imageUrl, index) => (
          <figure
            className={`news-image-tile ${item.thumbnailUrl === imageUrl ? "is-thumbnail" : ""}`}
            draggable
            key={imageUrl}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) onReorder?.(item, dragIndex, index);
              setDragIndex(null);
            }}
          >
            <img src={resolveMediaUrl(imageUrl)} alt="" />
            <span className="news-image-drag-handle"><GripVertical size={16} /> {index + 1}</span>
            <button
              className={`icon-btn news-image-thumbnail-button ${item.thumbnailUrl === imageUrl ? "is-active" : ""}`}
              type="button"
              aria-label={t("setAsThumbnail")}
              aria-pressed={item.thumbnailUrl === imageUrl}
              onClick={() => onSetThumbnail(item, imageUrl)}
            >
              <Star size={17} />
            </button>
            <button className="icon-btn news-image-delete-button" type="button" aria-label={t("deletePicture")} onClick={() => onRemove(item, imageUrl)}>
              <Trash2 size={17} />
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}

function NewsDocumentManager({ item, language, onRemove }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);

  if (!item.documentUrl) {
    return null;
  }

  const titleField = localizedField("documentTitle", language);

  return (
    <div className="news-image-manager">
      <h3>{h("pdfDocument")}</h3>
      <div className="news-document-tile">
        <FileText size={22} />
        <a href={resolveMediaUrl(item.documentUrl)} target="_blank" rel="noreferrer">
          {item[titleField] || item.documentTitle || t("pdfDocument")}
        </a>
        <button className="btn btn-danger" type="button" onClick={() => onRemove(item)}>
          <Trash2 size={16} /> {t("deletePdf")}
        </button>
      </div>
    </div>
  );
}

function ImagePreviewGrid({ files, language, onReorder, onRemove }) {
  const t = (key) => adminT(language, key);
  const h = (key) => adminT("en", key);
  const [dragIndex, setDragIndex] = useState(null);
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
      <h3>{h("selectedPictures")}</h3>
      <div className="news-image-grid">
        {previews.map((preview, index) => (
          <figure
            className="news-image-tile"
            draggable={Boolean(onReorder)}
            key={preview.url}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) onReorder?.(dragIndex, index);
              setDragIndex(null);
            }}
          >
            <img src={preview.url} alt="" />
            {onReorder ? <span className="news-image-drag-handle"><GripVertical size={16} /> {index + 1}</span> : null}
            <figcaption>{preview.name}</figcaption>
            {onRemove ? (
              <button 
                className="icon-btn news-image-delete-button" 
                type="button" 
                aria-label="Remove picture"
                onClick={() => onRemove(index)}
              >
                <Trash2 size={17} />
              </button>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );
}

function RecentChangesPage({ language }) {
  const t = (key) => adminT(language, key);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    items: [],
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    api.getAuditChanges({ page, pageSize, search, date })
      .then((data) => {
        if (active) setResult(data);
      })
      .catch(() => {
        if (active) {
          setResult({ items: [], page: 1, pageSize, total: 0, totalPages: 1 });
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [date, page, search]);

  function clearFilters() {
    setSearch("");
    setDate("");
    setPage(1);
  }

  const pages = Array.from({ length: result.totalPages }, (_, index) => index + 1);

  return (
    <EditorSection
      icon={<History size={18} />}
      title={t("recentChanges")}
      description={t("recentChangesDesc")}
    >
      <div className="admin-audit-controls">
        <label>
          {t("searchChanges")}
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Admin, news title, action..."
          />
        </label>
        <label>
          {t("filterByDate")}
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <button className="btn btn-secondary dark" type="button" onClick={clearFilters}>
          <X size={16} /> {t("clearFilters")}
        </button>
      </div>

      <div className="admin-audit-summary">
        <span>{result.total} changes</span>
        {isLoading ? <span>Loading...</span> : null}
      </div>

      {result.items.length ? (
        <div className="admin-audit-list">
          {result.items.map((change) => (
            <article className="admin-audit-item" key={change.id}>
              <span className="admin-audit-icon"><History size={16} /></span>
              <div>
                <strong>{formatChangeLabel(change)}</strong>
                <span>{change.entityName}</span>
              </div>
              <div className="admin-audit-meta">
                <span>{change.adminEmail}</span>
                <time dateTime={change.createdAt}>{formatChangeTime(change.createdAt)}</time>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="admin-empty-state">{t("noRecentChanges")}</p>
      )}

      {result.totalPages > 1 ? (
        <nav className="admin-audit-pagination" aria-label="Recent changes pages">
          <button type="button" disabled={result.page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            Previous
          </button>
          {pages.map((pageNumber) => (
            <button
              className={pageNumber === result.page ? "active" : ""}
              type="button"
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" disabled={result.page >= result.totalPages} onClick={() => setPage((current) => Math.min(current + 1, result.totalPages))}>
            Next
          </button>
        </nav>
      ) : null}
    </EditorSection>
  );
}

function PasswordChangeEditor({ currentAdmin, language }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [changeStatus, setChangeStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = (key) => adminT(language, key);

  async function handlePasswordChange(event) {
    event.preventDefault();
    
    // Validation
    if (!oldPassword.trim()) {
      setChangeStatus("Current password is required");
      return;
    }
    
    if (!newPassword.trim()) {
      setChangeStatus("New password is required");
      return;
    }
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setChangeStatus(passwordError);
      return;
    }
    
    if (newPassword !== newPasswordConfirm) {
      setChangeStatus("New passwords do not match");
      return;
    }
    
    if (oldPassword === newPassword) {
      setChangeStatus("New password must be different from current password");
      return;
    }

    setIsLoading(true);
    try {
      await api.changePassword(oldPassword, newPassword);
      setChangeStatus(t("passwordChanged"));
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      
      // Clear status after 5 seconds
      setTimeout(() => setChangeStatus(""), 5000);
    } catch (error) {
      setChangeStatus(error.message || t("passwordChangeFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-home-editor">
      <EditorSection
        icon={<Lock size={18} />}
        title={t("changePassword")}
        description="Change your admin password. This password protects your account from unauthorized access."
      >
        <form className="admin-password-change-form" onSubmit={handlePasswordChange}>
          {changeStatus ? (
            <div className={`password-change-message ${changeStatus === t("passwordChanged") ? "success" : "error"}`}>
              {changeStatus === t("passwordChanged") ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {changeStatus}
            </div>
          ) : null}
          
          <div className="form-grid">
            <PasswordField
              label={t("currentPassword")}
              value={oldPassword}
              onChange={setOldPassword}
              required
              disabled={isLoading}
            />
            <PasswordField
              label={t("newPassword")}
              value={newPassword}
              onChange={setNewPassword}
              required
              disabled={isLoading}
            />
            <PasswordField
              label="Confirm new password"
              value={newPasswordConfirm}
              onChange={setNewPasswordConfirm}
              required
              disabled={isLoading}
            />
          </div>
          <p className="admin-password-rules">{passwordRequirementsText}</p>
          
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : <Unlock size={16} />} {t("changePassword")}
          </button>
        </form>
      </EditorSection>
    </div>
  );
}
