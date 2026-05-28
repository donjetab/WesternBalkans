import React from "react";
import { useEffect, useState } from "react";
import { BookOpen, Globe2, GraduationCap, Landmark, UsersRound } from "lucide-react";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { homepageFallback, pagesFallback } from "../data/fallbackContent.js";
import { api } from "../services/api.js";

const overviewIcons = [UsersRound, BookOpen, GraduationCap];
const impactIcons = [Landmark, Globe2, UsersRound, BookOpen];
const contentIcons = [GraduationCap, UsersRound, BookOpen, Globe2, Landmark];

export function ContentPage({ slug }) {
  const [page, setPage] = useState(pagesFallback[slug]);
  const isEventsPage = slug === "events";
  const isOverviewPage = slug === "overview";

  useEffect(() => {
    const fallback = pagesFallback[slug];
    setPage(fallback);
    let active = true;

    api.getPageFast(slug, fallback).then((data) => {
      if (active) setPage(data);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (isOverviewPage) {
    return <ProjectOverviewPage page={page} />;
  }

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <SectionReveal className="section">
        <div className={`container ${isEventsPage ? "events-list" : "content-grid"}`}>
          {page.sections?.map((section, index) => {
            const Icon = contentIcons[index % contentIcons.length];

            return isEventsPage ? <EventCard section={section} key={section.title} /> : (
              <article className="content-card" key={section.title}>
                <div className="content-card-icon"><Icon size={28} /></div>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </article>
            );
          })}
        </div>
      </SectionReveal>
    </>
  );
}

function ProjectOverviewPage({ page }) {
  return (
    <>
      <section className="overview-hero">
        <div className="overview-map" aria-hidden="true"></div>
        <div className="overview-orbit overview-orbit-one" aria-hidden="true"></div>
        <div className="overview-orbit overview-orbit-two" aria-hidden="true"></div>
        <div className="container overview-hero-inner">
          <span className="eyebrow">About</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <SectionReveal className="section overview-section">
        <div className="container overview-card-grid">
          {page.sections?.map((section, index) => {
            const Icon = overviewIcons[index] || BookOpen;
            return (
              <article className="overview-card" key={section.title}>
                <div className="overview-card-icon"><Icon size={30} /></div>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </article>
            );
          })}
        </div>

        <div className="container overview-impact">
          <h2>Project Impact</h2>
          <div className="overview-impact-grid">
            {homepageFallback.stats.map((stat, index) => {
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

function EventCard({ section }) {
  const [meta, ...descriptionParts] = section.body.split(". ");
  const description = descriptionParts.join(". ").trim();

  return (
    <article className="event-card">
      <div className="event-meta">{meta}</div>
      <h3>{section.title}</h3>
      <p>{description || section.body}</p>
    </article>
  );
}
