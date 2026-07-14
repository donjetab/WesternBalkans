import React from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { localized, useLanguage } from "../context/LanguageContext.jsx";
import { resolveMediaUrl } from "../services/api.js";
import { getNewsPath } from "../utils/newsUrls.js";

function shortenText(text = "", sentenceLimit = 4) {
  const normalized = text.trim();
  const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  if (sentences.length <= sentenceLimit) {
    return normalized;
  }

  return `${sentences.slice(0, sentenceLimit).join(" ").trim()}...`;
}

export function NewsCard({ item }) {
  const { language, t } = useLanguage();
  const locale = language === "sq" ? "sq-AL" : undefined;
  const title = localized(item.title, item.titleSq, language);
  const excerpt = shortenText(localized(item.excerpt, item.excerptSq, language), 4);
  const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" }) : t("projectUpdate");
  const image = item.thumbnailUrl || item.imageUrl;

  return (
    <Link className="news-card news-card-link" to={getNewsPath(item)} aria-label={`${t("readStory")}: ${title}`}>
      <div className="news-image">
        {image ? <img src={resolveMediaUrl(image)} alt="" /> : <span>Edu4Migration</span>}
      </div>
      <div className="news-body">
        <span className="news-date">
          <CalendarDays size={16} />
          {date}
        </span>
        <h3>{title}</h3>
        <p>{excerpt}</p>
        <span className="text-link">
          {t("readStory")} <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
