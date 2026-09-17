import React from "react";
import { ArrowRight, ChevronDown, Menu, UsersRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { navItems } from "../data/siteStructure.js";
import "../styles/public-shell.css";

export function Layout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
  const [desktopGroup, setDesktopGroup] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, navLabel, t } = useLanguage();

  useEffect(() => {
    let frame = 0;

    const updateScrollEffects = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 18);
      document.documentElement.style.setProperty("--parallax-hero", `${Math.min(scrollY * .055, 72)}px`);
      document.documentElement.style.setProperty("--parallax-detail", `${Math.min(scrollY * .09, 110)}px`);
      document.documentElement.style.setProperty("--parallax-up", `${-Math.min(scrollY * .045, 58)}px`);
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--parallax-hero");
      document.documentElement.style.removeProperty("--parallax-detail");
      document.documentElement.style.removeProperty("--parallax-up");
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenGroup("");
    setDesktopGroup("");
  }, [pathname]);

  useEffect(() => {
    const dismiss = (event) => {
      if (!event.target.closest(".desktop-nav")) setDesktopGroup("");
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <div className={`page-shell public-shell ${pathname === "/" ? "reference-home" : ""}`}>
      <header className={`site-header ${scrolled || open ? "scrolled" : ""}`}>
        <div className="container nav">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Western Balkans Edu4Migration" />
          </NavLink>
          <nav className="desktop-nav">
            {navItems.map((item) => item.items ? <DesktopNavGroup item={item} key={item.label} open={desktopGroup === item.label} setOpen={(value) => setDesktopGroup(value ? item.label : "")} /> : (
              <NavLink key={item.to} to={item.to}>
                {navLabel(item.label)}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/contact" className="nav-cta">
            {t("contact")}
          </NavLink>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button className="icon-btn menu-btn" type="button" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav id="mobile-navigation" aria-label="Mobile navigation" className={`mobile-nav ${open ? "open" : ""}`}>
          {navItems.map((item) => item.items ? (
            <div className="mobile-nav-group" key={item.label}>
              <button
                className="mobile-nav-group-trigger"
                aria-expanded={openGroup === item.label}
                aria-controls={`mobile-links-${item.label.toLowerCase()}`}
                type="button"
                onClick={() => setOpenGroup((current) => current === item.label ? "" : item.label)}
              >
                {navLabel(item.label)}
                <ChevronDown size={16} />
              </button>
              <div id={`mobile-links-${item.label.toLowerCase()}`} className={`mobile-nav-group-links ${openGroup === item.label ? "open" : ""}`}>
                {item.items.map((child) => (
                  <NavLink key={child.to} to={child.to} onClick={() => setOpen(false)}>
                    {navLabel(child.label)}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {navLabel(item.label)}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            {t("contactShort")}
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <ProjectCta />
      <Footer />
    </div>
  );
}

function DesktopNavGroup({ item, open, setOpen }) {
  const { navLabel } = useLanguage();
  const { pathname } = useLocation();
  const active = item.items.some((child) => pathname === child.to);
  const id = `nav-links-${item.label.toLowerCase()}`;

  return (
    <div
      className={`nav-group ${open ? "is-open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.currentTarget.querySelector("button").focus();
        }
        if (event.key === "ArrowDown" && event.target.tagName === "BUTTON") {
          event.preventDefault();
          setOpen(true);
          const firstLink = event.currentTarget.querySelector("a");
          window.requestAnimationFrame(() => firstLink?.focus());
        }
      }}
    >
      <button
        className={`nav-group-trigger ${active ? "active" : ""}`}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {navLabel(item.label)}
        <ChevronDown size={15} />
      </button>
      <div id={id} className="nav-dropdown" aria-label={navLabel(item.label)}>
        {item.items.map((child) => (
          <NavLink key={child.to} to={child.to} onClick={() => setOpen(false)}>
            {navLabel(child.label)}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function LanguageSwitcher({ language, setLanguage }) {
  return (
    <button
      className={`language-toggle ${language === "sq" ? "is-sq" : ""}`}
      type="button"
      role="switch"
      aria-checked={language === "sq"}
      aria-label="Albanian language"
      onClick={() => setLanguage(language === "en" ? "sq" : "en")}
    >
      <span className="language-toggle-thumb" aria-hidden="true" />
      <span className="language-toggle-label" aria-hidden="true">EN</span>
      <span className="language-toggle-label" aria-hidden="true">SQ</span>
    </button>
  );
}

function Footer() {
  const { navLabel, t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img className="footer-logo" src="/assets/logo.png" alt="Western Balkans Edu4Migration" />
          <p>{t("footerText")}</p>
        </div>
        <div className="footer-column">
          <h4>{t("footerExplore")}</h4>
          <NavLink to="/overview">{navLabel("Project Overview")}</NavLink>
          <NavLink to="/partners">{navLabel("Project Partners")}</NavLink>
          <NavLink to="/events">{navLabel("Events")}</NavLink>
          <NavLink to="/news">{navLabel("News")}</NavLink>
        </div>
        <div className="footer-column">
          <h4>{navLabel("Resources")}</h4>
          <NavLink to="/courses">{navLabel("Courses")}</NavLink>
          <NavLink to="/documents">{navLabel("Project Documents")}</NavLink>
          <NavLink to="/case-studies">{navLabel("Case Studies and Reports")}</NavLink>
          <NavLink to="/downloads">{navLabel("Downloadable Documents")}</NavLink>
        </div>
        <div className="footer-column">
          <h4>{t("footerContact")}</h4>
          <a href="mailto:wbedu4migrationproject@gmail.com">wbedu4migrationproject@gmail.com</a>
          <NavLink to="/admin/login">Admin panel</NavLink>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Edu4Migration</span>
        <span>Co-funded by the European Union</span>
      </div>
    </footer>
  );
}

function ProjectCta() {
  const { t } = useLanguage();
  return (
      <section className="cta-band">
        <div className="container cta-band-inner">
          <div className="cta-copy">
            <div className="cta-icon"><UsersRound size={30} /></div>
            <div>
              <span className="eyebrow">{t("stayConnected")}</span>
              <h2>{t("stayConnectedText")}</h2>
            </div>
          </div>
          <Link className="btn btn-primary cta-button" to="/contact">{t("contactDetails")} <ArrowRight size={18} /></Link>
        </div>
      </section>
  );
}
