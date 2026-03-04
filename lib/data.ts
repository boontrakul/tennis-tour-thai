export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  href: string;
};

export const articles: Article[] = [
  {
    id: "bangkok-night-tennis",
    title: "Where to Play Night Tennis in Bangkok",
    excerpt:
      "A curated list of the best-lit courts in Bangkok for after‑work and late‑night sessions, plus booking tips.",
    category: "Court Reviews",
    date: "2025-08-04",
    readTime: "6 min read",
    href: "/articles/bangkok-night-tennis",
  },
  {
    id: "beat-the-heat",
    title: "Beating the Thai Heat: Hydration & Gear Tips",
    excerpt:
      "Smart strategies, clothing, and equipment choices to keep your game sharp in hot and humid conditions.",
    category: "Tips",
    date: "2025-07-22",
    readTime: "5 min read",
    href: "/articles/beat-the-heat",
  },
  {
    id: "phuket-tennis-getaway",
    title: "Planning a Tennis Getaway in Phuket",
    excerpt:
      "Resorts, courts, and hidden local clubs that make Phuket a perfect destination for tennis‑centric trips.",
    category: "Travel",
    date: "2025-07-05",
    readTime: "7 min read",
    href: "/articles/phuket-tennis-getaway",
  },
  {
    id: "serve-consistency-drills",
    title: "Serve Consistency Drills for Club Players",
    excerpt:
      "Simple but powerful drills you can run alone or with a partner to build a more reliable first serve.",
    category: "Training",
    date: "2025-06-19",
    readTime: "8 min read",
    href: "/articles/serve-consistency-drills",
  },
  {
    id: "thai-tennis-culture",
    title: "Inside Thailand’s Growing Tennis Culture",
    excerpt:
      "From public courts to private academies, explore how tennis is evolving across Thailand.",
    category: "Culture",
    date: "2025-06-01",
    readTime: "9 min read",
    href: "/articles/thai-tennis-culture",
  },
  {
    id: "gear-checklist",
    title: "Essential Gear Checklist for Visiting Players",
    excerpt:
      "Everything you should pack before flying to Thailand for a tennis‑focused holiday.",
    category: "Travel",
    date: "2025-05-14",
    readTime: "4 min read",
    href: "/articles/gear-checklist",
  },
];

export type Topic = {
  id: string;
  title: string;
  category: "General" | "Trading" | "Partners";
  author: string;
  replies: number;
  lastActivity: string;
};

export const topics: Topic[] = [
  {
    id: "night-session-bangkok",
    title: "Best courts for night sessions in Bangkok?",
    category: "General",
    author: "Aom",
    replies: 12,
    lastActivity: "2 hours ago",
  },
  {
    id: "selling-racquet",
    title: "FS: Babolat Pure Drive 300g (very good condition)",
    category: "Trading",
    author: "Krit",
    replies: 5,
    lastActivity: "5 hours ago",
  },
  {
    id: "looking-doubles-partner",
    title: "Looking for doubles partner around Sukhumvit (NTRP 3.5–4.0)",
    category: "Partners",
    author: "Mint",
    replies: 18,
    lastActivity: "1 day ago",
  },
  {
    id: "phuket-clubs",
    title: "Which clubs in Phuket allow drop‑in visitors?",
    category: "General",
    author: "James",
    replies: 7,
    lastActivity: "2 days ago",
  },
  {
    id: "stringer-recommendation",
    title: "Recommend a reliable stringer in Nonthaburi?",
    category: "General",
    author: "Beam",
    replies: 3,
    lastActivity: "3 days ago",
  },
];

