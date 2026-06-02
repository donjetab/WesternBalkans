import React from "react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { homepageFallback, projectPartners } from "../data/fallbackContent.js";
import { api, resolveMediaUrl, withFallback } from "../services/api.js";

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

export function Partners() {
  const [partners, setPartners] = useState(mergePartnerFallbacks(projectPartners));
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;

    withFallback(api.getHomepage, homepageFallback).then((data) => {
      if (active) setPartners(mergePartnerFallbacks(data.partners));
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="partners-hero">
        <div className="partners-map" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-one" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-two" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-three" aria-hidden="true"></div>
        <div className="container partners-hero-inner">
          <span className="eyebrow">{t("consortium")}</span>
          <h1>{t("projectPartners")}</h1>
          <p>{t("partnersHeroIntro")}</p>
          <a className="btn btn-primary" href="#partners-list">
            {t("learnMoreProject")} <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <SectionReveal className="section partner-directory-section">
        <div className="container" id="partners-list">
          <div className="section-heading">
            <span className="eyebrow dark">{t("meetPartners")}</span>
            <h2>{t("partnersHeading")}</h2>
            <p>{t("partnersIntro")}</p>
          </div>

          <div className="partner-directory-grid">
            {partners.map((partner) => (
              <a
                className="partner-directory-card"
                href={normalizePartnerWebsiteUrl(partner.websiteUrl) || undefined}
                key={partner.name}
                target={normalizePartnerWebsiteUrl(partner.websiteUrl) ? "_blank" : undefined}
                rel="noreferrer"
                onClick={(event) => {
                  if (!normalizePartnerWebsiteUrl(partner.websiteUrl)) event.preventDefault();
                }}
                aria-label={`Open ${partner.name} website`}
              >
                <div className="partner-directory-logo">
                  <img src={resolveMediaUrl(partner.logoUrl)} alt={`${partner.name} logo`} />
                </div>
                <div className="partner-directory-copy">
                  <span>{partner.country}</span>
                  <h3>{partner.name}</h3>
                  <p>{partner.role}</p>
                </div>
                <ArrowRight className="partner-arrow" size={18} />
              </a>
            ))}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
