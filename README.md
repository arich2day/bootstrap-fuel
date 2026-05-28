# BootstrapFuel

Open-source, ultra-lean alternative to FounderPal. Turn raw startup ideas into
interactive execution roadmaps and indie-friendly funding pipelines.

- **AI backend:** Google Gemini `gemini-1.5-flash` (streaming).
- **Storage:** browser `localStorage` only. $0 hosting cost.
- **Stack:** Next.js App Router · TypeScript · Tailwind CSS · `react-markdown` · `lucide-react`.

## Features

- **Audience Deep-Dive** — 3 ICPs with pains and visceral motivations.
- **Positioning & Hooks** — conversion angles, value props, elevator pitch.
- **Copy Factory** — PAS + AIDA landing-page copy blocks.
- **Pitch Architect** — zero-hype cold email + 8-slide deck text.
- **Capital Matchmaker** — pitch strategy paired with a programmatically
  filtered shortlist of indie-friendly funds (TinySeed, Calm Fund, Earnest,
  SBIR/STTR, AI Grant, etc.).
- **Interactive action checklist** parsed live from streamed markdown.
- **Iterative refinement loop** — micro-chat below each output edits in place.
- **Multi-project sidebar** with create / switch / delete.
- **One-click blueprint export** to `BOOTSTRAP_FUEL_BLUEPRINT.md`.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
npm run dev
```

Get a Gemini API key at <https://aistudio.google.com/apikey>. The UI runs
without one — a warning banner is shown and the generate buttons remain
disabled gracefully.

## Project structure

```
app/
  api/generate/route.ts  # Edge streaming endpoint to Gemini
  api/config/route.ts    # Reports whether the API key is set
  page.tsx               # Main workspace + multi-project shell
  layout.tsx
components/              # Sidebar, Workspace, MarkdownView, ChecklistBoard, FundingPanel
lib/
  promptTemplates.ts     # Audience, Positioning, Copy, Pitch, Funding recipes
  fundingDatabase.ts     # Local static funding shortlist + keyword matcher
  checklistParser.ts     # Pulls actionable tasks from streamed markdown
  projectStore.ts        # localStorage persistence
  blueprintExport.ts     # Consolidated markdown export
  types.ts
```

## License

MIT.
