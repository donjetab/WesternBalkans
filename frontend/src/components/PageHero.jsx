import React from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.jsx";

export function PageHero({ eyebrow, title, intro, className = "", topContent = null, metaContent = null }) {
  useDocumentTitle(title);

  return (
    <section className={`page-hero ${className}`.trim()}>
      <div className="container">
        {topContent}
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {metaContent}
        <p>{intro}</p>
      </div>
    </section>
  );
}
