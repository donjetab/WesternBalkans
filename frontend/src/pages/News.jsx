import React from "react";
import { useEffect, useState } from "react";
import { NewsCard } from "../components/NewsCard.jsx";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { newsFallback } from "../data/fallbackContent.js";
import { api } from "../services/api.js";

export function News() {
  const [news, setNews] = useState(newsFallback);

  useEffect(() => {
    let active = true;
    api.getNewsFast(false, newsFallback).then((items) => {
      if (active) setNews(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHero eyebrow="News and events" title="News" intro="Recent updates, conferences, trainings, and public project activity." />
      <SectionReveal className="section news-list-section">
        <div className="container news-grid">
          {news.map((item) => <NewsCard item={item} key={item.id} />)}
        </div>
      </SectionReveal>
    </>
  );
}
