import React from "react";
import { useEffect, useState } from "react";
import { NewsCard } from "../components/NewsCard.jsx";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { api } from "../services/api.js";

export function News() {
  const [news, setNews] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    let active = true;
    api.getNewsFast(false).then((items) => {
      if (active) setNews(items);
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHero className="news-list-hero" eyebrow={t("newsEyebrow")} title={t("newsTitle")} intro={t("newsIntro")} />
      <SectionReveal className="section news-list-section">
        <div className="container news-grid">
          {news.map((item) => <NewsCard item={item} key={item.id} />)}
        </div>
      </SectionReveal>
    </>
  );
}
