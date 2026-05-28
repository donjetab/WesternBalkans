import React from "react";
import { Mail, MapPin, UserRound } from "lucide-react";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";

const contacts = [
  { role: "Project Coordinator at AAB College", name: "Ardian Sallauka", email: "ardian.sallauka@aab-edu.net" },
  { role: "Project Monitoring Officer", name: "Ereza Mehmeti", email: "ereza.mehmeti@aab-edu.net" },
  { role: "Office for Project Development", name: "General project office", email: "projects@aab-edu.net" },
  { role: "Project email", name: "WB Edu4Migration", email: "wbedu4migrationproject@gmail.com" }
];

export function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact Us" intro="Key contacts and communication channels for the project." />
      <SectionReveal className="section">
        <div className="container contact-layout">
          <div className="contact-intro">
            <MapPin size={28} />
            <h2>Questions, collaboration, and project communication</h2>
            <p>Use the listed contacts for coordination, monitoring, project office communication, or general information.</p>
          </div>
          <div className="contact-grid">
            {contacts.map((contact) => (
              <article className="contact-card" key={contact.email}>
                <UserRound size={22} />
                <span>{contact.role}</span>
                <h3>{contact.name}</h3>
                <a href={`mailto:${contact.email}`}><Mail size={16} /> {contact.email}</a>
              </article>
            ))}
          </div>
        </div>
      </SectionReveal>
    </>
  );
}
