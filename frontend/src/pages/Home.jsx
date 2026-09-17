import React from "react";
import { ArrowRight, BookOpen, GraduationCap, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { NewsCard } from "../components/NewsCard.jsx";
import { localized, useLanguage } from "../context/LanguageContext.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { api, resolveMediaUrl } from "../services/api.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.jsx";

import "../styles/home.css";

const focusIcons = [BookOpen, GraduationCap, Handshake];

const emptyHome = {
  heroEyebrow: "",
  heroTitle: "",
  heroSubtitle: "",
  heroBody: "",
  heroImageUrl: "",
  stats: [],
  statsSq: [],
  focusAreas: [],
  focusAreasSq: [],
  partners: []
};

function normalizePartnerWebsiteUrl(url = "") {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function Home() {
  const [home, setHome] = useState(emptyHome);
  const [news, setNews] = useState([]);
  const { language, t } = useLanguage();
  const stats = language === "sq" && home.statsSq?.length ? home.statsSq : home.stats;
  const focusAreas = language === "sq" && home.focusAreasSq?.length ? home.focusAreasSq : home.focusAreas;
  const pageTitle = localized(home.heroTitle, home.heroTitleSq, language) || "Home";

  useDocumentTitle(pageTitle);

  useEffect(() => {
    let active = true;

    api.getHomepage().then((data) => {
      if (active) setHome(data);
    }).catch(() => {});
    api.getNewsFast(false).then((items) => {
      if (active) setNews(items.slice(0, 3));
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url("${resolveMediaUrl(home.heroImageUrl)}")` }}>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{localized(home.heroEyebrow, home.heroEyebrowSq, language)}</span>
            <h1 className="hero-title-line">{localized(home.heroTitle, home.heroTitleSq, language)}</h1>
            <h2 className="hero-subtitle-line">{localized(home.heroSubtitle, home.heroSubtitleSq, language)}</h2>
            <p>{localized(home.heroBody, home.heroBodySq, language)}</p>
            <div className="hero-actions">
              <Link to="/overview" className="btn btn-primary">
                {t("projectOverview")} <ArrowRight size={18} />
              </Link>
              <Link to="/news" className="btn btn-secondary">
                {t("latestNews")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-band">
        <div className="container stats-grid">
          {stats?.map((stat) => (
            <article className="stat-item" key={stat.label}>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SectionReveal className="section feature-section">
        <div className="container feature-section-inner">
          <div className="feature-intro">
          <div className="section-heading">
            <span className="eyebrow dark">{t("aboutProject")}</span>
            <h2>{t("homeFeatureTitle")}</h2>
            <p>{t("homeFeatureIntro")}</p>

          </div>
            <Link to="/overview" className="btn btn-secondary dark about-link">
              {t("learnMoreAboutProject")} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="feature-grid">
            {focusAreas?.map((area, index) => {
              const Icon = focusIcons[index] || BookOpen;
              return (
                <article className="feature-card" key={area.title}>
                  <div className="feature-card-top">
                    <div className="icon-box"><Icon size={24} /></div>
                  </div>
                  <h3>{area.title}</h3>
                  <p>{area.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section alt news-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow dark">{t("latestActivity")}</span>
              <h2>{t("newsUpdates")}</h2>
            </div>

          </div>
          <div className="news-grid">
            {news.map((item) => <NewsCard item={item} key={item.id} />)}
          </div>
            <Link className="btn btn-secondary dark news-all-link" to="/news">{t("viewAllNews")}</Link>
        </div>
      </SectionReveal>

      <SectionReveal className="section partners-section">
        <div className="container">
          <div className="section-heading compact">
            <span className="eyebrow dark">{t("consortium")}</span>
            <h2>{t("projectPartners")}</h2>
          </div>
          <div className="partners-row">
            {(home.partners || []).map((partner) => (
              <a
                className="partner-logo"
                href={normalizePartnerWebsiteUrl(partner.websiteUrl) || undefined}
                key={partner.name}
                target={normalizePartnerWebsiteUrl(partner.websiteUrl) ? "_blank" : undefined}
                rel="noreferrer"
                onClick={(event) => {
                  if (!normalizePartnerWebsiteUrl(partner.websiteUrl)) event.preventDefault();
                }}
                aria-label={`Open ${partner.name} website`}
              >
                {partner.logoUrl ? <img src={resolveMediaUrl(partner.logoUrl)} alt={partner.name} /> : null}
                <strong>{partner.name}</strong>
                <span>{partner.country}</span>
              </a>
            ))}
          </div>
        </div>
      </SectionReveal>


    </>
  );
}
