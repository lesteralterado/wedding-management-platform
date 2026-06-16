import { Reveal } from "@/components/motion/reveal";

export function FaqSection() {
  const faqs = [
    ["What should I wear?", "Warm citrus tones, garden formal, or anything that feels celebratory."],
    ["Can I bring a plus one?", "Please follow the seat allowance shown on your personalized invitation."],
    ["When is the RSVP deadline?", "RSVPs are appreciated as soon as possible so we can finalize seating."],
  ];

  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">FAQ</p>
          <h2 className="font-display text-4xl font-black">Questions before the big day</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map(([question, answer]) => (
            <Reveal key={question}>
              <details className="rounded-[1.25rem] border border-border bg-card p-5">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
