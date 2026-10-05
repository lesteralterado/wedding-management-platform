"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { SectionProps } from "../registry-types";
import { EASE_SOFT } from "./art";
import { SectionHeader } from "./section-header";

export function Faq({ content }: SectionProps<"FAQ">) {
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader tag={content.tag} title={content.title} />

        <div className="divide-y divide-t-accent/20 border-y border-t-accent/20">
          {content.items.map((item, index) => (
            <motion.details
              key={`${item.question}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: EASE_SOFT }}
              className="group py-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-t-heading text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-t-accent-text transition-transform duration-300 group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-t-ink-soft">{item.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
