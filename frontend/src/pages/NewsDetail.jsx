import React from "react";
import { ArrowLeft, CalendarDays, Download, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { newsFallback } from "../data/fallbackContent.js";
import { api, resolveMediaUrl } from "../services/api.js";

export function NewsDetail() {
  const { id } = useParams();
  const fallbackItem = useMemo(() => newsFallback.find((item) => String(item.id) === String(id)) || newsFallback[0], [id]);
  const [item, setItem] = useState(fallbackItem);

  useEffect(() => {
    setItem(fallbackItem);
    let active = true;

    api.getNewsItemFast(id, newsFallback).then((data) => {
      if (active && data) setItem(data);
    });

    return () => {
      active = false;
    };
  }, [fallbackItem, id]);

  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
    : "Project update";
  const heroImage = item.imageUrl || item.thumbnailUrl;
  const gallery = item.gallery?.length ? item.gallery : heroImage ? [heroImage] : [];

  return (
    <>
      <PageHero
        className="news-simple-hero news-detail-hero"
        eyebrow=""
        title={item.title}
        intro={item.excerpt}
        topContent={(
          <Link className="news-hero-back" to="/news">
            <ArrowLeft size={17} />
            Back to news
          </Link>
        )}
        metaContent={(
          <div className="news-hero-date">
            <CalendarDays size={18} />
            {date}
          </div>
        )}
      />
      <SectionReveal className="section news-detail-section">
        <article className="container news-detail">
          {heroImage ? (
            <div className="news-detail-hero-image">
              <img src={resolveMediaUrl(heroImage)} alt={item.title} />
            </div>
          ) : null}

          <div className="news-detail-content">
            {(item.content || item.excerpt || "").split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{renderLinkedText(paragraph)}</p>
            ))}
          </div>

          {item.documentUrl ? (
            <section className="news-document">
              <div className="news-document-header">
                <div className="news-document-title">
                  <FileText size={22} />
                  <div>
                    <span>Attached document</span>
                    <h2>{item.documentTitle || "Project document"}</h2>
                  </div>
                </div>
                <a className="btn btn-primary" href={resolveMediaUrl(item.documentUrl)} target="_blank" rel="noreferrer">
                  <Download size={17} />
                  Open PDF
                </a>
              </div>
              <iframe className="news-document-frame" src={resolveMediaUrl(item.documentUrl)} title={item.documentTitle || item.title} />
            </section>
          ) : null}

          {gallery.length > 1 ? (
            <div className="news-gallery">
              {gallery.map((image) => (
                <img src={resolveMediaUrl(image)} alt="" key={image} />
              ))}
            </div>
          ) : null}
        </article>
      </SectionReveal>
    </>
  );
}

function renderLinkedText(text) {
  const anchorPattern = /<a\s+href="([^"]+)"(?:\s+target="([^"]+)")?(?:\s+rel="([^"]+)")?>(.*?)<\/a>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = anchorPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, href, target = "_blank", rel = "noopener noreferrer", label] = match;
    parts.push(
      <a href={href} target={target} rel={rel} key={`${href}-${match.index}`}>
        {label}
      </a>
    );
    lastIndex = anchorPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}
