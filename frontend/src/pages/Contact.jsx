import React from "react";
import { useEffect, useState } from "react";
import { Mail, MapPin, UserRound } from "lucide-react";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { localized, useLanguage } from "../context/LanguageContext.jsx";
import { pagesFallback } from "../data/fallbackContent.js";
import { api } from "../services/api.js";

function getContactDetails(section, language) {
  const body = localized(section.body, section.bodySq, language);
  const email = body.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] || "";
  const role = body.replace(email, "").replace(/\s+/g, " ").trim();

  return {
    email,
    name: localized(section.title, section.titleSq, language),
    role
  };
}

export function Contact() {
  const [page, setPage] = useState(pagesFallback.contact);
  const { language } = useLanguage();

  useEffect(() => {
    const fallback = pagesFallback.contact;
    setPage(fallback);
    let active = true;

    api.getPageFast("contact", fallback).then((data) => {
      if (active) setPage(data);
    });

    return () => {
      active = false;
    };
  }, []);

  const contacts = page.sections?.map((section) => getContactDetails(section, language)) || [];

  return (
    <>
      <PageHero
        eyebrow={localized(page.eyebrow, page.eyebrowSq, language)}
        title={localized(page.title, page.titleSq, language)}
        intro={localized(page.intro, page.introSq, language)}
      />
      <SectionReveal className="section">
        <div className="container contact-layout">
          <div className="contact-intro">
            <MapPin size={28} />
            <h2>{localized(page.title, page.titleSq, language)}</h2>
            <p>{localized(page.intro, page.introSq, language)}</p>
          </div>
          <div className="contact-grid">
            {contacts.map((contact) => (
              <article className="contact-card" key={`${contact.name}-${contact.email}`}>
                <UserRound size={22} />
                <span>{contact.role}</span>
                <h3>{contact.name}</h3>
                {contact.email ? <a href={`mailto:${contact.email}`}><Mail size={16} /> {contact.email}</a> : null}
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
