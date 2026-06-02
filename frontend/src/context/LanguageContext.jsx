import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_KEY = "edu4migration_language";
const defaultLanguage = "en";
const supportedLanguages = ["en", "sq"];

const dictionary = {
  en: {
    contact: "Contact Us",
    contactShort: "Contact",
    readStory: "Read story",
    projectUpdate: "Project update",
    attachedDocument: "Attached document",
    projectDocument: "Project document",
    openPdf: "Open PDF",
    backToNews: "Back to news",
    learnMoreProject: "Learn more about the project",
    meetPartners: "Meet our partners",
    partnersHeading: "Regional and European institutions working together",
    partnersIntro: "Key partners include universities, colleges, and organizations supporting migration-focused social work education and professional development.",
    footerText: "Strengthening higher education and professional capacity for migration-related social care in the Western Balkans.",
    footerExplore: "Explore",
    footerContact: "Contact",
    footerEmail: "Project coordination",
    footerRights: "All rights reserved.",
    projectOverview: "Project Overview",
    latestNews: "Latest News",
    aboutProject: "About the project",
    homeFeatureTitle: "Education, practice, and migration support connected in one platform",
    homeFeatureIntro: "Cleaner hierarchy, calmer spacing, and editable content make the project easier to maintain and easier for visitors to understand.",
    learnMoreAboutProject: "Learn More About the Project",
    latestActivity: "Latest activity",
    newsUpdates: "News and project updates",
    viewAllNews: "View all news",
    consortium: "Consortium",
    projectPartners: "Project partners",
    stayConnected: "Stay connected",
    stayConnectedText: "Follow project progress, training activities, and new learning resources.",
    contactDetails: "Contact Details",
    newsEyebrow: "News and events",
    newsTitle: "News",
    newsIntro: "Recent updates, conferences, trainings, and public project activity.",
    projectImpact: "Project Impact",
    partnersHeroIntro: "The project is a collaboration between academic institutions and organizations from Kosovo, Albania, and the EU."
  },
  sq: {
    contact: "Na kontaktoni",
    contactShort: "Kontakt",
    readStory: "Lexo lajmin",
    projectUpdate: "Përditësim i projektit",
    attachedDocument: "Dokument i bashkangjitur",
    projectDocument: "Dokument i projektit",
    openPdf: "Hap PDF",
    backToNews: "Kthehu te lajmet",
    learnMoreProject: "Mëso më shumë për projektin",
    meetPartners: "Njihuni me partnerët",
    partnersHeading: "Institucionet rajonale dhe evropiane që punojnë së bashku",
    partnersIntro: "Partnerët kryesorë përfshijnë universitete, kolegje dhe organizata që mbështesin edukimin në punë sociale të fokusuar te migrimi dhe zhvillimin profesional.",
    footerText: "Forcimi i arsimit të lartë dhe kapaciteteve profesionale për kujdesin social të lidhur me migrimin në Ballkanin Perëndimor.",
    footerExplore: "Eksploro",
    footerContact: "Kontakt",
    footerEmail: "Koordinimi i projektit",
    footerRights: "Të gjitha të drejtat e rezervuara.",
    projectOverview: "Përmbledhje e Projektit",
    latestNews: "Lajmet e Fundit",
    aboutProject: "Rreth projektit",
    homeFeatureTitle: "Arsimi, praktika dhe mbështetja për migrimin të lidhura në një platformë",
    homeFeatureIntro: "Hierarkia më e qartë, hapësirat më të qeta dhe përmbajtja e redaktueshme e bëjnë projektin më të lehtë për mirëmbajtje dhe më të kuptueshëm për vizitorët.",
    learnMoreAboutProject: "Mëso më shumë për projektin",
    latestActivity: "Aktiviteti më i fundit",
    newsUpdates: "Lajme dhe përditësime të projektit",
    viewAllNews: "Shiko të gjitha lajmet",
    consortium: "Konsorciumi",
    projectPartners: "Partnerët e projektit",
    stayConnected: "Qëndro i lidhur",
    stayConnectedText: "Ndiq progresin e projektit, aktivitetet trajnuese dhe burimet e reja mësimore.",
    contactDetails: "Detajet e kontaktit",
    newsEyebrow: "Lajme dhe ngjarje",
    newsTitle: "Lajme",
    newsIntro: "Përditësimet më të fundit, konferencat, trajnimet dhe aktivitetet publike të projektit.",
    projectImpact: "Ndikimi i Projektit",
    partnersHeroIntro: "Projekti është bashkëpunim ndërmjet institucioneve akademike dhe organizatave nga Kosova, Shqipëria dhe BE-ja."
  }
};

const navTranslations = {
  sq: {
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
    "Case Studies and Reports": "Studime Rasti dhe Raporte",
    Multimedia: "Multimedia",
    News: "Lajme"
  }
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return supportedLanguages.includes(stored) ? stored : defaultLanguage;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => {
      if (supportedLanguages.includes(nextLanguage)) {
        setLanguageState(nextLanguage);
      }
    },
    t: (key) => dictionary[language]?.[key] || dictionary.en[key] || key,
    navLabel: (label) => navTranslations[language]?.[label] || label
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

export function localized(enValue = "", sqValue = "", language = defaultLanguage) {
  return language === "sq" && sqValue?.trim() ? sqValue : enValue;
}
