import { Reveal } from "@/components/motion/reveal";

export function StorySection({ names }: { names: string }) {
  return (
    <section className="px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Our Story</p>
          <h2 className="font-display text-4xl font-black md:text-5xl">{names} begin their forever</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            From first hello to shared sunsets, every chapter brought them closer to this joyful celebration. We are honored to have you witness the next beautiful beginning.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
