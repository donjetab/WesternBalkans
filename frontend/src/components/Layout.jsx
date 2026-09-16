import React from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { navItems } from "../data/siteStructure.js";

export function Layout() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
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

  return (
    <div className="page-shell">
      <header className={`site-header ${scrolled || open ? "scrolled" : ""}`}>
        <div className="container nav">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <img src="/assets/logo.png" alt="Western Balkans Edu4Migration" />
          </NavLink>
          <nav className="desktop-nav">
            {navItems.map((item) => item.items ? <DesktopNavGroup item={item} key={item.label} /> : (
              <NavLink key={item.to} to={item.to}>
                {navLabel(item.label)}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/contact" className="nav-cta">
            {t("contact")}
          </NavLink>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button className="icon-btn menu-btn" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav className={`mobile-nav ${open ? "open" : ""}`}>
          {navItems.map((item) => item.items ? (
            <div className="mobile-nav-group" key={item.label}>
              <button
                className="mobile-nav-group-trigger"
                type="button"
                onClick={() => setOpenGroup((current) => current === item.label ? "" : item.label)}
              >
                {navLabel(item.label)}
                <ChevronDown size={16} />
              </button>
              <div className={`mobile-nav-group-links ${openGroup === item.label ? "open" : ""}`}>
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
      <Footer />
    </div>
  );
}

function DesktopNavGroup({ item }) {
  const { navLabel } = useLanguage();
  const [closedAfterClick, setClosedAfterClick] = useState(false);

  function closeDropdown() {
    setClosedAfterClick(true);
    document.activeElement?.blur?.();
  }

  return (
    <div className={`nav-group ${closedAfterClick ? "is-closed" : ""}`} onMouseLeave={() => setClosedAfterClick(false)}>
      <button className="nav-group-trigger" type="button">
        {navLabel(item.label)}
        <ChevronDown size={15} />
      </button>
      <div className="nav-dropdown">
        <span className="nav-dropdown-kicker">{navLabel(item.label)}</span>
        {item.items.map((child) => (
          <NavLink key={child.to} to={child.to} onClick={closeDropdown}>
            {navLabel(child.label)}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div className="language-switcher" aria-label="Choose language">
      <button className={language === "en" ? "active" : ""} type="button" onClick={() => setLanguage("en")}>EN</button>
      <button className={language === "sq" ? "active" : ""} type="button" onClick={() => setLanguage("sq")}>SQ</button>
    </div>
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
