import React from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { navItems } from "../data/fallbackContent.js";

export function Layout() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/contact" className="nav-cta">
            Contact Us
          </NavLink>
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
                {item.label}
                <ChevronDown size={16} />
              </button>
              <div className={`mobile-nav-group-links ${openGroup === item.label ? "open" : ""}`}>
                {item.items.map((child) => (
                  <NavLink key={child.to} to={child.to} onClick={() => setOpen(false)}>
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
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
  return (
    <div className="nav-group">
      <button className="nav-group-trigger" type="button">
        {item.label}
        <ChevronDown size={15} />
      </button>
      <div className="nav-dropdown">
        {item.items.map((child) => (
          <NavLink key={child.to} to={child.to}>
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src="/assets/logo.png" alt="Western Balkans Edu4Migration" />
          <p>Capacity building in higher education for stronger migration-focused social work practice.</p>
        </div>
        <div>
          <h4>Main Pages</h4>
          <NavLink to="/overview">Project Overview</NavLink>
          <NavLink to="/partners">Project Partners</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/news">News</NavLink>
        </div>
        <div>
          <h4>Resources</h4>
          <NavLink to="/courses">Learning Materials</NavLink>
          <NavLink to="/documents">Publications</NavLink>
          <NavLink to="/case-studies">Reports</NavLink>
          <NavLink to="/downloads">Media & Downloads</NavLink>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="mailto:wbedu4migrationproject@gmail.com">wbedu4migrationproject@gmail.com</a>
          <NavLink to="/admin/login">Admin panel</NavLink>
        </div>
      </div>
    </footer>
  );
}
