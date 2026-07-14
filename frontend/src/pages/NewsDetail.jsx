import React from "react";
import { ArrowLeft, CalendarDays, Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHero } from "../components/PageHero.jsx";
import { SectionReveal } from "../components/SectionReveal.jsx";
import { localized, useLanguage } from "../context/LanguageContext.jsx";
import { api, resolveMediaUrl } from "../services/api.js";
import { getNewsPath, isNumericNewsParam, slugifyNewsTitle } from "../utils/newsUrls.js";

const emptyNewsDetail = {
  title: "",
  titleSq: "",
  excerpt: "",
  excerptSq: "",
  content: "",
  contentSq: "",
  gallery: []
};

export function NewsDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [item, setItem] = useState(emptyNewsDetail);
  const [selectedPicture, setSelectedPicture] = useState(null);

  useEffect(() => {
    setItem(emptyNewsDetail);
    let active = true;

    if (isNumericNewsParam(id)) {
      api.getNewsItemFast(id).then((data) => {
        if (!active || !data) return;
        setItem(data);
        navigate(getNewsPath(data), { replace: true });
      }).catch(() => {});
    } else {
      api.getNewsFast(false).then((items) => {
        if (!active) return;
        const match = items.find((newsItem) => slugifyNewsTitle(newsItem.title || newsItem.titleSq) === id);
        if (match) setItem(match);
      }).catch(() => {});
    }

    return () => {
      active = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!selectedPicture) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setSelectedPicture(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedPicture]);

  const locale = language === "sq" ? "sq-AL" : undefined;
  const title = localized(item.title, item.titleSq, language);
  const excerpt = localized(item.excerpt, item.excerptSq, language);
  const content = localized(item.content, item.contentSq, language);
  const documentTitle = localized(item.documentTitle, item.documentTitleSq, language);
  const date = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" })
    : t("projectUpdate");
  const heroImage = item.thumbnailUrl || item.imageUrl;
  const gallery = item.gallery?.length ? item.gallery : heroImage ? [heroImage] : [];

  return (
    <>
      <PageHero
        className="news-simple-hero news-detail-hero"
        eyebrow=""
        title={title}
        intro={excerpt}
        topContent={(
          <Link className="news-hero-back" to="/news">
            <ArrowLeft size={17} />
            {t("backToNews")}
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
              <img src={resolveMediaUrl(heroImage)} alt={title} />
            </div>
          ) : null}

          <div className="news-detail-content" dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(content || excerpt || "") }} />

          {item.documentUrl ? (
            <section className="news-document">
              <div className="news-document-header">
                <div className="news-document-title">
                  <FileText size={22} />
                  <div>
                    <span>{t("attachedDocument")}</span>
                    <h2>{documentTitle || t("projectDocument")}</h2>
                  </div>
                </div>
                <a className="btn btn-primary" href={resolveMediaUrl(item.documentUrl)} target="_blank" rel="noreferrer">
                  <Download size={17} />
                  {t("openPdf")}
                </a>
              </div>
              <iframe className="news-document-frame" src={resolveMediaUrl(item.documentUrl)} title={documentTitle || title} />
            </section>
          ) : null}

          {gallery.length > 1 ? (
            <div className="news-gallery">
              {gallery.map((image, index) => (
                <button className="news-gallery-button" type="button" key={image} onClick={() => setSelectedPicture(image)}>
                  <img src={resolveMediaUrl(image)} alt={`${title} picture ${index + 1}`} />
                </button>
              ))}
            </div>
          ) : null}
        </article>
      </SectionReveal>

      {selectedPicture ? (
        <div className="news-picture-lightbox" role="dialog" aria-modal="true" aria-label="News picture preview" onClick={() => setSelectedPicture(null)}>
          <button className="news-picture-lightbox-close" type="button" aria-label="Close picture preview" onClick={() => setSelectedPicture(null)}>
            x
          </button>
          <img src={resolveMediaUrl(selectedPicture)} alt={title} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </>
  );
}

function sanitizeNewsHtml(text = "") {
  if (typeof window === "undefined") return text;

  const template = document.createElement("template");
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  template.innerHTML = hasHtml
    ? text.replace(/\n/g, "<br>")
    : text.split("\n").filter(Boolean).map((line) => `<p>${line}</p>`).join("");
  const allowedTags = new Set(["A", "STRONG", "B", "EM", "I", "BR", "DIV", "P"]);

  template.content.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      const style = element.getAttribute("style") || "";
      const isBold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style);
      const isItalic = /font-style\s*:\s*italic/i.test(style);

      if (isBold || isItalic) {
        const wrapper = document.createElement(isBold ? "strong" : "em");
        wrapper.append(...element.childNodes);

        if (isBold && isItalic) {
          const inner = document.createElement("em");
          inner.append(...wrapper.childNodes);
          wrapper.append(inner);
        }

        element.replaceWith(wrapper);
      } else {
        element.replaceWith(...element.childNodes);
      }
      return;
    }

    const href = element.tagName === "A" ? element.getAttribute("href") || "" : "";

    [...element.attributes].forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });

    if (element.tagName === "A") {
      if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
        element.setAttribute("href", href);
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      } else {
        element.replaceWith(document.createTextNode(element.textContent || ""));
      }
    }
  });

  return template.innerHTML;
}
