import React from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { newsFallback } from "../data/fallbackContent.js";
import { api } from "../services/api.js";

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
      <PageHero eyebrow="News" title={item.title} intro={item.excerpt} />
      <SectionReveal className="section news-detail-section">
        <article className="container news-detail">
          <Link className="back-link" to="/news">
            <ArrowLeft size={17} />
            Back to news
          </Link>

          <div className="news-detail-date">
            <CalendarDays size={18} />
            {date}
          </div>

          {heroImage ? (
            <div className="news-detail-hero-image">
              <img src={heroImage} alt={item.title} />
            </div>
          ) : null}

          <div className="news-detail-content">
            {(item.content || item.excerpt || "").split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {gallery.length > 1 ? (
            <div className="news-gallery">
              {gallery.map((image) => (
                <img src={image} alt="" key={image} />
              ))}
            </div>
          ) : null}
        </article>
      </SectionReveal>
    </>
  );
}
