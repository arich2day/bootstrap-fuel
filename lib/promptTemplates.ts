import type { RecipeKey } from "./types";

const SYSTEM_RULES = `You are BootstrapFuel, an operator-grade strategy engine for solo founders and indie hackers.
Hard rules:
- Zero marketing fluff. No "unleash", "revolutionize", "synergy", "game-changer", "leverage", "empower".
- Concrete, specific, falsifiable. Numbers over adjectives.
- Output clean GitHub-flavored markdown. Use headings, bullet lists, and numbered action steps.
- When you describe actions the founder should take, prefix them with a checkbox: "- [ ] ...".
- Never include preamble like "Here is..." or "Sure!". Start with the first markdown heading.
- Never invent statistics. If you don't know, say "validate this".`;

interface RecipeDef {
  label: string;
  description: string;
  build: (ctx: PromptContext) => string;
}

export interface PromptContext {
  idea: string;
  audience?: string;
  competitorContext?: string;
  previous?: string;
  refinement?: string;
}

const recipes: Record<RecipeKey, RecipeDef> = {
  audience: {
    label: "Audience Deep-Dive",
    description: "3 ICPs with pains and visceral motivations.",
    build: (ctx) => `${SYSTEM_RULES}

TASK: Audience Deep-Dive

Startup idea:
"""${ctx.idea}"""
${ctx.audience ? `Founder's working audience guess: ${ctx.audience}\n` : ""}
Produce exactly the following markdown structure:

## Audience Deep-Dive

### ICP 1: <one-line label>
- **Who they are:** ...
- **Where they hang out:** ...
- **Core pain (in their own words):** ...
- **Visceral motivation:** ...
- **Trigger event that makes them search for a solution:** ...

### ICP 2: <one-line label>
(same five bullets)

### ICP 3: <one-line label>
(same five bullets)

### Action steps to validate
- [ ] One concrete validation action per ICP (5 total, max).`,
  },

  positioning: {
    label: "Positioning & Hooks",
    description: "3 angles, value props, elevator pitch.",
    build: (ctx) => `${SYSTEM_RULES}

TASK: Positioning & Hooks

Startup idea:
"""${ctx.idea}"""
${ctx.audience ? `Audience: ${ctx.audience}\n` : ""}${ctx.competitorContext ? `Competitor context: ${ctx.competitorContext}\n` : ""}
Produce exactly this structure:

## Positioning & Hooks

### Angle 1: <name>
- **Hook (one line, < 14 words):** ...
- **Value prop:** ...
- **Why it converts:** ...

### Angle 2: <name>
(same three bullets)

### Angle 3: <name>
(same three bullets)

### Elevator pitch (40 words max)
> ...

### Action steps
- [ ] 3-5 concrete things to test these angles in the next 7 days.`,
  },

  copy: {
    label: "Copy Factory",
    description: "PAS + AIDA conversion copy.",
    build: (ctx) => `${SYSTEM_RULES}

TASK: Copy Factory

Startup idea:
"""${ctx.idea}"""
${ctx.audience ? `Audience: ${ctx.audience}\n` : ""}
Produce conversion copy mapped to two frameworks. Use this exact structure:

## Copy Factory

### PAS Framework
- **Problem:** ...
- **Agitate:** ...
- **Solve:** ...

#### Landing page block (PAS)
> Final, ready-to-paste copy here. 80-120 words.

### AIDA Framework
- **Attention:** ...
- **Interest:** ...
- **Desire:** ...
- **Action:** ...

#### Landing page block (AIDA)
> Final, ready-to-paste copy here. 80-120 words.

### Action steps
- [ ] 3-5 tactical experiments to A/B these blocks.`,
  },

  pitch: {
    label: "Pitch Architect",
    description: "Cold email + deck-text template.",
    build: (ctx) => `${SYSTEM_RULES}

TASK: Pitch Architect

Startup idea:
"""${ctx.idea}"""
${ctx.competitorContext ? `Competitor / context: ${ctx.competitorContext}\n` : ""}
Produce a zero-hype application package. Exact structure:

## Pitch Architect

### Cold email to an indie-hacker fund (≤ 140 words)
\`\`\`
Subject: ...
Hi <Name>,
<body>
\`\`\`

### Deck text (8 slides, one line each)
1. Problem — ...
2. Why now — ...
3. Solution — ...
4. Market — ...
5. Traction — ...
6. Business model — ...
7. Ask — ...
8. Founder — ...

### Action steps
- [ ] 4-6 prep actions before sending.`,
  },

  funding: {
    label: "Capital Matchmaker",
    description: "Pitch strategy tied to local funding shortlist.",
    build: (ctx) => `${SYSTEM_RULES}

TASK: Capital Matchmaker — pitch strategy

Startup idea:
"""${ctx.idea}"""
${ctx.competitorContext ? `Competitor / context: ${ctx.competitorContext}\n` : ""}
The frontend will display a shortlist of indie-friendly funds beside this output. Your job is the *strategy* a solo founder uses to pursue them.

## Capital Matchmaker — Strategy

### Fit profile
- **Stage:** ...
- **Capital type that actually fits:** (e.g. revenue-based, non-dilutive grant, micro-equity, crowdfunding) ...
- **What you need the money for (one sentence):** ...

### Outreach playbook
- **Who to email first:** ...
- **What single metric to lead with:** ...
- **Common rejection reason to pre-empt:** ...

### Action steps
- [ ] 5-7 sequential actions to actually land non-dilutive or indie-friendly capital this quarter.`,
  },
};

export function buildPrompt(recipe: RecipeKey, ctx: PromptContext): string {
  const base = recipes[recipe].build(ctx);
  if (ctx.previous && ctx.refinement) {
    return `${base}

---
PRIOR OUTPUT (you wrote this previously):
"""
${ctx.previous}
"""

FOUNDER REFINEMENT REQUEST:
"""${ctx.refinement}"""

Re-emit the FULL document with the requested changes applied. Keep the same markdown structure. Do not narrate the changes.`;
  }
  return base;
}

export function listRecipes(): Array<{ key: RecipeKey; label: string; description: string }> {
  return (Object.keys(recipes) as RecipeKey[]).map((key) => ({
    key,
    label: recipes[key].label,
    description: recipes[key].description,
  }));
}
