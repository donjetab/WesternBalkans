import React from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

function shortenText(text = "", sentenceLimit = 4) {
  const normalized = text.trim();
  const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  if (sentences.length <= sentenceLimit) {
    return normalized;
  }

  return `${sentences.slice(0, sentenceLimit).join(" ").trim()}...`;
}

export function NewsCard({ item }) {
  const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "Project update";
  const excerpt = shortenText(item.excerpt, 4);
  const image = item.thumbnailUrl || item.imageUrl;

  return (
    <article className="news-card">
      <div className="news-image">
        {image ? <img src={image} alt="" /> : <span>Edu4Migration</span>}
      </div>
      <div className="news-body">
        <span className="news-date">
          <CalendarDays size={16} />
          {date}
        </span>
        <h3>{item.title}</h3>
        <p>{excerpt}</p>
        <Link className="text-link" to={`/news/${item.id}`}>
          Read story <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
