import type { FundingMatch } from "./types";

export const fundingDatabase: FundingMatch[] = [
  {
    name: "TinySeed",
    type: "Revenue-friendly accelerator",
    focusKeywords: [
      "saas", "b2b", "bootstrapped", "mrr", "indie", "remote", "solo founder",
      "early revenue", "subscription",
    ],
    description:
      "Year-long remote accelerator for early-stage B2B SaaS with some revenue. Small check, mentorship, no aggressive growth pressure.",
    url: "https://tinyseed.com",
  },
  {
    name: "Calm Fund",
    type: "Micro-equity for calm companies",
    focusKeywords: [
      "saas", "calm", "profitable", "sustainable", "indie", "small team",
      "no hypergrowth", "founder-led",
    ],
    description:
      "Invests in profitable, founder-led software companies that prefer steady growth over venture-scale outcomes.",
    url: "https://calmfund.com",
  },
  {
    name: "Earnest Capital",
    type: "Shared Earnings Agreement",
    focusKeywords: [
      "saas", "bootstrapped", "revenue-based", "non-dilutive-ish",
      "early revenue", "indie",
    ],
    description:
      "Provides ~$75-250k via Shared Earnings Agreement — repaid out of founder distributions, no exit pressure.",
    url: "https://earnestcapital.com",
  },
  {
    name: "Indie.vc",
    type: "Revenue-based investment",
    focusKeywords: [
      "indie", "revenue", "bootstrapped", "saas", "ecommerce",
    ],
    description:
      "Capital that pays itself back through revenue share. Built for companies that want to stay independent.",
    url: "https://indie.vc",
  },
  {
    name: "Lighter Capital",
    type: "Revenue-based financing",
    focusKeywords: [
      "saas", "mrr", "tech-enabled", "non-dilutive", "growth capital",
      "$15k+ mrr",
    ],
    description:
      "Non-dilutive RBF for SaaS with $15k+ MRR. Funds up to 1/3 of ARR; flat repayment cap.",
    url: "https://lightercapital.com",
  },
  {
    name: "Pioneer",
    type: "Global tournament / micro-grant",
    focusKeywords: [
      "solo founder", "early stage", "prototype", "global", "remote",
      "indie hacker", "first check",
    ],
    description:
      "Weekly tournament for ambitious solo builders. Winners get cash, credits, and a path to investor intros.",
    url: "https://pioneer.app",
  },
  {
    name: "Kickstarter",
    type: "Reward-based crowdfunding",
    focusKeywords: [
      "hardware", "creative", "product", "consumer", "community",
      "pre-order", "crowdfunding",
    ],
    description:
      "Reward-based crowdfunding. Best for tangible products, creative tools, and pre-orderable goods.",
    url: "https://kickstarter.com",
  },
  {
    name: "Indiegogo",
    type: "Reward-based / flexible crowdfunding",
    focusKeywords: [
      "hardware", "consumer", "international", "flexible funding",
      "crowdfunding",
    ],
    description:
      "Flexible crowdfunding for products and projects. Keeps funds even below target with flexible mode.",
    url: "https://indiegogo.com",
  },
  {
    name: "WeFunder",
    type: "Regulation Crowdfunding (equity)",
    focusKeywords: [
      "community", "equity crowdfunding", "us", "regulation cf",
      "consumer", "saas", "diy round",
    ],
    description:
      "Lets US-based companies raise up to $5M from anyone via Reg CF. Strong for community-backed brands.",
    url: "https://wefunder.com",
  },
  {
    name: "Republic",
    type: "Equity crowdfunding",
    focusKeywords: [
      "equity crowdfunding", "us", "international", "consumer", "web3",
      "community",
    ],
    description:
      "Equity and revenue-share crowdfunding platform. Strong distribution to retail investors.",
    url: "https://republic.com",
  },
  {
    name: "SBIR / STTR Grants",
    type: "Non-dilutive government grant (US)",
    focusKeywords: [
      "deep tech", "research", "us", "non-dilutive", "grant", "hardware",
      "ai", "biotech", "climate",
    ],
    description:
      "US federal grants for R&D-heavy startups. Equity-free capital, phased awards from ~$50k to $1M+.",
    url: "https://www.sbir.gov",
  },
  {
    name: "NSF America's Seed Fund",
    type: "Non-dilutive R&D grant",
    focusKeywords: [
      "deep tech", "science", "research", "us", "non-dilutive",
      "phase i", "early r&d",
    ],
    description:
      "Up to $275k Phase I, up to $1M+ Phase II for technically risky US startups. Equity-free.",
    url: "https://seedfund.nsf.gov",
  },
  {
    name: "Mozilla Builders / Open Source Grants",
    type: "Open-source / mission grant",
    focusKeywords: [
      "open source", "privacy", "ai", "decentralized", "web",
      "mission-driven", "non-dilutive",
    ],
    description:
      "Periodic grant programs for builders aligned with open web, privacy, and decentralized AI.",
    url: "https://builders.mozilla.org",
  },
  {
    name: "GitHub Accelerator",
    type: "Equity-free OSS grant",
    focusKeywords: [
      "open source", "developer tools", "non-dilutive", "early stage",
      "maintainer",
    ],
    description:
      "Equity-free grant + mentorship for open-source maintainers turning projects into sustainable companies.",
    url: "https://accelerator.github.com",
  },
  {
    name: "AI Grant",
    type: "Non-dilutive AI grant",
    focusKeywords: [
      "ai", "ml", "research", "agents", "open source", "non-dilutive",
    ],
    description:
      "Quarterly grants and compute credits for ambitious AI projects, especially open and agentic work.",
    url: "https://aigrant.com",
  },
  {
    name: "Y Combinator (Bootstrapper-friendly track)",
    type: "Accelerator (equity)",
    focusKeywords: [
      "early stage", "global", "any sector", "first check",
      "founder community",
    ],
    description:
      "Standard YC deal ($500k for ~7%). Not lean-friendly on dilution but unmatched network and post-Demo Day fundraising.",
    url: "https://ycombinator.com",
  },
  {
    name: "On Deck Fellowships",
    type: "Community + capital",
    focusKeywords: [
      "pre-idea", "community", "remote", "founder fellowship",
      "first-time founder",
    ],
    description:
      "Cohort programs for pre-idea and pre-seed founders. Optional capital + warm intros.",
    url: "https://beondeck.com",
  },
  {
    name: "Stripe Atlas + Founders Fund credits",
    type: "Credits & infra",
    focusKeywords: [
      "infrastructure", "credits", "us incorporation", "early stage",
      "saas", "global",
    ],
    description:
      "Not cash but de-facto runway: incorporation, banking, and partner credits worth $5-50k for early SaaS.",
    url: "https://stripe.com/atlas",
  },
  {
    name: "Microacquire / Acquire.com community angels",
    type: "Solo angel / micro-acquisition",
    focusKeywords: [
      "profitable", "small saas", "acquisition", "indie", "exit",
      "micro pe",
    ],
    description:
      "Network of buyers and angels who fund or acquire small profitable SaaS. Useful for partial exits.",
    url: "https://acquire.com",
  },
  {
    name: "Hustle Fund",
    type: "Pre-seed venture",
    focusKeywords: [
      "pre-seed", "first check", "global", "underrepresented founders",
      "scrappy",
    ],
    description:
      "Small first checks ($25-100k) into scrappy pre-seed teams. Founder-friendly, fast process.",
    url: "https://hustlefund.vc",
  },
];

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s+#./-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

export function matchFunding(query: string, limit = 6): FundingMatch[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return fundingDatabase.slice(0, limit).map((f) => ({ ...f, score: 0 }));
  }
  const scored = fundingDatabase.map((entry) => {
    const haystack = [
      entry.name,
      entry.type,
      entry.description,
      ...entry.focusKeywords,
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (entry.focusKeywords.some((k) => k.toLowerCase().includes(tok))) {
        score += 3;
      } else if (haystack.includes(tok)) {
        score += 1;
      }
    }
    return { ...entry, score };
  });
  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return scored.slice(0, limit);
}
