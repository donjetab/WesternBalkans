import React from "react";
import { ArrowRight, BookOpen, Globe2, GraduationCap, Handshake, Landmark, LibraryBig, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { NewsCard } from "../components/NewsCard.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { homepageFallback, newsFallback, projectPartners } from "../data/fallbackContent.js";
import { api } from "../services/api.js";

const focusIcons = [BookOpen, GraduationCap, Handshake];
const statIcons = [Landmark, Globe2, UsersRound, LibraryBig];

export function Home() {
  const [home, setHome] = useState(homepageFallback);
  const [news, setNews] = useState(newsFallback);

  useEffect(() => {
    let active = true;

    api.getHomepageFast(homepageFallback).then((data) => {
      if (active) setHome(data);
    });
    api.getNewsFast(false, newsFallback).then((items) => {
      if (active) setNews(items.slice(0, 3));
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(105deg, rgba(12,31,52,.96), rgba(6, 23, 43, 0.76) 42%, rgba(12,31,52,.18)), url("${home.heroImageUrl || "/assets/Ardiani.jpg"}")` }}>
        <div className="hero-detail hero-rings" aria-hidden="true"></div>
        <div className="hero-detail hero-dots" aria-hidden="true"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{home.heroEyebrow}</span>
            <h1 className="hero-title-line">{home.heroTitle}</h1>
            <h2 className="hero-subtitle-line">{home.heroSubtitle}</h2>
            <p>{home.heroBody}</p>
            <div className="hero-actions">
              <Link to="/overview" className="btn btn-primary">
                Project Overview <ArrowRight size={18} />
              </Link>
              <Link to="/news" className="btn btn-secondary">
                Latest News
              </Link>
            </div>
          </div>
          {/* <div className="hero-panel">
            <Sparkles size={22} />
            <strong>Project platform</strong>
            <span>Curriculum reform, micro-credentials, and regional collaboration for inclusive migration support.</span>
          </div> */}
        </div>
      </section>

      <section className="stats-band">
        <div className="container stats-grid">
          {home.stats?.map((stat, index) => {
            const Icon = statIcons[index] || Landmark;
            return (
            <article className="stat-item" key={stat.label}>
              <div className="stat-icon"><Icon size={24} /></div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <SectionReveal className="section feature-section">
        <div className="container feature-section-inner">
          <div className="section-heading">
            <span className="eyebrow dark">About the project</span>
            <h2>Education, practice, and migration support connected in one platform</h2>
            <p>Cleaner hierarchy, calmer spacing, and editable content make the project easier to maintain and easier for visitors to understand.</p>
            <Link to="/overview" className="btn btn-secondary dark about-link">
              Learn More About the Project <ArrowRight size={17} />
            </Link>
          </div>
          <div className="feature-grid">
            {home.focusAreas?.map((area, index) => {
              const Icon = focusIcons[index] || BookOpen;
              return (
                <article className="feature-card" key={area.title}>
                  <div className="icon-box"><Icon size={24} /></div>
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
              <span className="eyebrow dark">Latest activity</span>
              <h2>News and project updates</h2>
            </div>
            <Link className="btn btn-secondary dark" to="/news">View all news</Link>
          </div>
          <div className="news-grid">
            {news.map((item) => <NewsCard item={item} key={item.id} />)}
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="section partners-section">
        <div className="container">
          <div className="section-heading compact">
            <span className="eyebrow dark">Consortium</span>
            <h2>Project partners</h2>
          </div>
          <div className="partners-row">
            {projectPartners.map((partner) => (
              <a
                className="partner-logo"
                href={partner.websiteUrl}
                key={partner.name}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${partner.name} website`}
              >
                {partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} /> : null}
                <strong>{partner.name}</strong>
                <span>{partner.country}</span>
              </a>
            ))}
          </div>
        </div>
      </SectionReveal>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <div className="cta-icon"><UsersRound size={32} /></div>
          <div>
            <span className="eyebrow">Stay connected</span>
            <h2>Follow project progress, training activities, and new learning resources.</h2>
          </div>
          <Link className="btn btn-primary" to="/contact">Contact Details</Link>
        </div>
      </section>
    </>
  );
}
