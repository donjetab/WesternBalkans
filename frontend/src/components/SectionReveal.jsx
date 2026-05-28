import React from "react";
import { useEffect, useRef, useState } from "react";

export function SectionReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.14 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </section>
  );
}
