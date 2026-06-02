import React from "react";
import { useEffect, useState } from "react";
import { BookOpen, Download, Globe2, GraduationCap, Landmark, UsersRound } from "lucide-react";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { localized, useLanguage } from "../context/LanguageContext.jsx";
import { homepageFallback, pagesFallback } from "../data/fallbackContent.js";
import { api, resolveMediaUrl } from "../services/api.js";

const overviewIcons = [UsersRound, BookOpen, GraduationCap];
const impactIcons = [Landmark, Globe2, UsersRound, BookOpen];
const contentIcons = [GraduationCap, UsersRound, BookOpen, Globe2, Landmark];

function mergeDownloadDocuments(page, fallback) {
  if (!page || page.slug !== "downloads") return page;

  const fallbackSections = fallback?.sections || [];
  const sections = page.sections?.map((section) => {
    if (section.documentUrl) return section;

    const fallbackSection = fallbackSections.find((item) => item.title === section.title);
    return fallbackSection?.documentUrl
      ? {
          ...section,
          documentTitle: section.documentTitle || fallbackSection.documentTitle,
          documentUrl: fallbackSection.documentUrl
        }
      : section;
  }) || fallbackSections;

  const hasDocuments = sections.some((section) => section.documentUrl);

  return {
    ...page,
    sections: hasDocuments ? sections : fallbackSections
  };
}

export function ContentPage({ slug }) {
  const [page, setPage] = useState(pagesFallback[slug]);
  const { language, t } = useLanguage();
  const isEventsPage = slug === "events";
  const isOverviewPage = slug === "overview";
  const isDownloadsPage = slug === "downloads";

  useEffect(() => {
    const fallback = pagesFallback[slug];
    setPage(fallback);
    let active = true;

    api.getPageFast(slug, fallback).then((data) => {
      if (active) setPage(mergeDownloadDocuments(data, fallback));
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (isOverviewPage) {
    return <ProjectOverviewPage page={page} />;
  }

  const sections = isDownloadsPage
    ? page.sections?.filter((section) => section.documentUrl)
    : page.sections;

  return (
    <>
      <PageHero
        eyebrow={localized(page.eyebrow, page.eyebrowSq, language)}
        title={localized(page.title, page.titleSq, language)}
        intro={localized(page.intro, page.introSq, language)}
      />
      <SectionReveal className="section">
        <div className={`container ${isEventsPage ? "events-list" : "content-grid"}`}>
          {sections?.map((section, index) => {
            const Icon = contentIcons[index % contentIcons.length];
            const hasDocument = Boolean(section.documentUrl);

            return isEventsPage ? <EventCard section={section} key={section.title} language={language} /> : (
              <article className="content-card" key={section.title}>
                <div className="content-card-icon"><Icon size={28} /></div>
                <h3>{localized(section.title, section.titleSq, language)}</h3>
                <p>{localized(section.body, section.bodySq, language)}</p>
                {hasDocument ? (
                  <a className="content-card-action" href={resolveMediaUrl(section.documentUrl)} target="_blank" rel="noreferrer">
                    <Download size={16} />
                    {localized(section.documentTitle, section.documentTitleSq, language) || t("openPdf")}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </SectionReveal>
    </>
  );
}

function ProjectOverviewPage({ page }) {
  const [homepage, setHomepage] = useState(homepageFallback);
  const { language, t } = useLanguage();
  const stats = language === "sq" && homepage.statsSq?.length ? homepage.statsSq : homepage.stats;

  useEffect(() => {
    let active = true;

    api.getHomepage().then((data) => {
      if (active) setHomepage(data);
    }).catch(() => {
      if (active) setHomepage(homepageFallback);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="overview-hero">
        <div className="overview-map" aria-hidden="true"></div>
        <div className="overview-orbit overview-orbit-one" aria-hidden="true"></div>
        <div className="overview-orbit overview-orbit-two" aria-hidden="true"></div>
        <div className="container overview-hero-inner">
          <span className="eyebrow">{localized(page.eyebrow, page.eyebrowSq, language)}</span>
          <h1>{localized(page.title, page.titleSq, language)}</h1>
          <p>{localized(page.intro, page.introSq, language)}</p>
        </div>
      </section>

      <SectionReveal className="section overview-section">
        <div className="container overview-card-grid">
          {page.sections?.map((section, index) => {
            const Icon = overviewIcons[index] || BookOpen;
            return (
              <article className="overview-card" key={section.title}>
                <div className="overview-card-icon"><Icon size={30} /></div>
                <h3>{localized(section.title, section.titleSq, language)}</h3>
                <p>{localized(section.body, section.bodySq, language)}</p>
              </article>
            );
          })}
        </div>

        <div className="container overview-impact">
          <h2>{t("projectImpact")}</h2>
          <div className="overview-impact-grid">
            {(stats || homepageFallback.stats).map((stat, index) => {
              const Icon = impactIcons[index] || Landmark;
              return (
                <article className="overview-impact-item" key={stat.label}>
                  <div className="overview-impact-icon"><Icon size={30} /></div>
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}

function EventCard({ section, language }) {
  const body = localized(section.body, section.bodySq, language);
  const [meta, ...descriptionParts] = body.split(". ");
  const description = descriptionParts.join(". ").trim();

  return (
    <article className="event-card">
      <div className="event-meta">{meta}</div>
      <h3>{localized(section.title, section.titleSq, language)}</h3>
      <p>{description || body}</p>
    </article>
  );
}
