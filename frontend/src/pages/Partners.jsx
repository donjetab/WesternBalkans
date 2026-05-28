import React from "react";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { projectPartners } from "../data/fallbackContent.js";

export function Partners() {
  return (
    <>
      <section className="partners-hero">
        <div className="partners-map" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-one" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-two" aria-hidden="true"></div>
        <div className="partners-pin partners-pin-three" aria-hidden="true"></div>
        <div className="container partners-hero-inner">
          <span className="eyebrow">Consortium</span>
          <h1>Project Partners</h1>
          <p>The project is a collaboration between academic institutions and organizations from Kosovo, Albania, and the EU.</p>
          <a className="btn btn-primary" href="#partners-list">
            Learn more about the project <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <SectionReveal className="section partner-directory-section">
        <div className="container" id="partners-list">
          <div className="section-heading">
            <span className="eyebrow dark">Meet our partners</span>
            <h2>Regional and European institutions working together</h2>
            <p>
              Key partners include universities, colleges, and organizations supporting migration-focused
              social work education and professional development.
            </p>
          </div>

          <div className="partner-directory-grid">
            {projectPartners.map((partner) => (
              <a
                className="partner-directory-card"
                href={partner.websiteUrl}
                key={partner.name}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${partner.name} website`}
              >
                <div className="partner-directory-logo">
                  <img src={partner.logoUrl} alt={`${partner.name} logo`} />
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
