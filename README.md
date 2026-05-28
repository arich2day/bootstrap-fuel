# BootstrapFuel

The execution engine for indie founders. Turn raw startup ideas into
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

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel&env=GEMINI_API_KEY,FREE_RATE_LIMIT_PER_HOUR,PRO_RATE_LIMIT_PER_HOUR,PRO_CHECKOUT_URL,LEMONSQUEEZY_STORE_ID,ACCESS_PASSCODE&envDescription=Gemini%20key%20required.%20Set%20PRO_CHECKOUT_URL%20to%20enable%20the%20Upgrade%20button.&envLink=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel%2Fblob%2Fmain%2F.env.example)

Full walkthrough including rate limiting, passcode gating, and cost posture:
see [`DEPLOY.md`](./DEPLOY.md).

## Local setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
npm run dev
```

### Monetization (Free + Pro tiers via LemonSqueezy)

- `FREE_RATE_LIMIT_PER_HOUR` — anonymous quota (default 3).
- `PRO_RATE_LIMIT_PER_HOUR` — license-holder quota (default 100).
- `PRO_CHECKOUT_URL` — LemonSqueezy checkout link; shows the **Upgrade** button.
- `LEMONSQUEEZY_STORE_ID` — restrict valid keys to your store.
- `ACCESS_PASSCODE` — optional pre-launch / private-deployment gate.

Customers paste their LemonSqueezy license key in the sidebar; the server
validates against LemonSqueezy's API and lifts them to the Pro rate limit.
Full setup walkthrough in [`DEPLOY.md`](./DEPLOY.md).

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
