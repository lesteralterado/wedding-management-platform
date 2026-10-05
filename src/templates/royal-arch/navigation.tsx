"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntro } from "./intro-gate";
import type { NavLink } from "../registry-types";

export function Navigation({ monogram, links }: { monogram: string; links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { done: introDone } = useIntro();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      for (const { id } of [{ id: "hero" }, ...links]) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100, scale: 5, opacity: 0 }}
      // Stay hidden until the guest has walked through the doors
      animate={introDone ? { y: 0, scale: 1, opacity: 1 } : undefined}
      transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,box-shadow] duration-300 ${
        // Before scrolling, desktop links sit over the floral arch, so they get a soft frosted backing.
        scrolled ? "bg-t-bg/95 py-4 shadow-lg shadow-black/10 backdrop-blur-xl" : "bg-transparent py-6 md:bg-t-bg/60 md:backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#hero" onClick={(e) => handleNavClick(e, "hero")} className="rounded-full bg-t-bg/70 px-3 py-0.5 font-t-script text-2xl tracking-widest text-t-accent-text backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none">
          {monogram}
        </a>

        <div className="hidden gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`text-sm uppercase tracking-[0.15em] transition-colors duration-300 hover:text-t-accent-text ${
                activeSection === link.id ? "text-t-accent-text" : "text-t-ink"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col gap-1.5 rounded-full bg-t-bg/70 p-2.5 backdrop-blur-md md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} className="block h-0.5 w-6 bg-t-ink" />
          <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="block h-0.5 w-6 bg-t-ink" />
          <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} className="block h-0.5 w-6 bg-t-ink" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 -z-10 bg-t-bg/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="font-t-heading text-2xl text-t-ink transition-colors hover:text-t-accent-text"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
