// Content for the Cherilyn & Lester demo wedding, shared by the database seed and the
// database-free demo so both show the same site.

export const DEMO_COVER_IMAGE = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=900&fit=crop";

export const DEMO_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop",
];

export const DEMO_SECTIONS = [
  { type: "HERO", enabled: true, position: 0, content: {} },
  {
    type: "STORY",
    enabled: true,
    position: 1,
    content: {
      chapters: [
        {
          label: "2020",
          title: "First Meeting",
          text: "It was a rainy afternoon at a small coffee shop. Cherilyn was reading her favourite book when Lester accidentally spilled his coffee. That moment sparked a conversation that lasted for hours, and neither of them wanted it to end.",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
        },
        {
          label: "2025",
          title: "The Proposal",
          text: "On a perfect summer evening, Lester arranged a private dinner on the rooftop where they had their first date. Under the stars and surrounded by fairy lights, he got down on one knee. Cherilyn said yes before he could even finish the question.",
          image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop",
        },
      ],
    },
  },
  {
    type: "EVENTS",
    enabled: true,
    position: 2,
    content: {
      events: [
        { kind: "ceremony", name: "Ceremony", time: "3:00 PM", venue: "The Orchard Chapel", address: "1200 Citrus Avenue, Laguna Beach, CA" },
        { kind: "reception", name: "Reception", time: "6:00 PM", venue: "The Golden Orchard Estate", address: "1200 Citrus Avenue, Laguna Beach, CA" },
      ],
    },
  },
  { type: "GALLERY", enabled: true, position: 3, content: {} },
  { type: "RSVP", enabled: true, position: 4, content: { deadline: "2027-05-01" } },
  {
    type: "FAQ",
    enabled: true,
    position: 5,
    content: {
      items: [
        { question: "What should I wear?", answer: "Garden formal. Soft neutrals and champagne tones are lovely; please avoid white." },
        { question: "Can I bring a plus one?", answer: "Your personal invitation shows how many seats are reserved for you." },
        { question: "Is there parking at the venue?", answer: "Yes, free valet parking is available at the estate entrance." },
      ],
    },
  },
] as const;
