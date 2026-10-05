"use client";

import { motion } from "framer-motion";
import { formatLongDate, initials } from "../format";
import type { TemplateLayoutProps } from "../registry-types";
import { Floral } from "./floral";
import { IntroProvider } from "./intro-gate";
import { Navigation } from "./navigation";

export function RoyalArchLayout({ site, nav, children }: TemplateLayoutProps) {
  const { wedding } = site;

  return (
    <IntroProvider monogram={[wedding.brideName.trim().charAt(0).toUpperCase(), wedding.groomName.trim().charAt(0).toUpperCase()]}>
      <Navigation monogram={initials(wedding.brideName, wedding.groomName)} links={nav} />
      <main>{children}</main>

      <footer className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-t-accent/30 to-transparent" />

        {/* Closing card: the couple framed in the floral oval */}
        <div className="relative mx-auto aspect-[480/640] w-[78vw] max-w-[340px] text-center">
          <Floral variant="oval-frame" className="absolute inset-0" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-[22%] pb-[16%]"
          >
            <div className="flex flex-col items-center">
              <span className="font-t-heading text-2xl md:text-3xl">{wedding.brideName}</span>
              <span className="font-t-script text-xl text-t-accent-text">&amp;</span>
              <span className="font-t-heading text-2xl md:text-3xl">{wedding.groomName}</span>
            </div>
            <p className="text-balance text-sm italic text-t-ink-soft">Thank you for being part of our special day</p>
            <div className="font-t-script text-xl text-t-accent-text">{formatLongDate(wedding.date)}</div>
          </motion.div>
        </div>
      </footer>
    </IntroProvider>
  );
}
