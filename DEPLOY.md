# Deploying BootstrapFuel (laptop-off mode)

You don't need a server. Vercel's free Hobby tier runs this app and the edge
streaming API at $0/mo until you hit very high request counts. The app stores
all project state in the user's browser, so there's no database to provision.

## One-click deploy

After pushing to your own GitHub repo, click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel&env=GEMINI_API_KEY,ACCESS_PASSCODE,RATE_LIMIT_PER_HOUR&envDescription=Gemini%20key%20required.%20Passcode%20%26%20rate%20limit%20optional.&envLink=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel%2Fblob%2Fmain%2F.env.example)

Vercel will prompt for the three env vars below before the first build. The
repo URL in the button assumes the GitHub path `arich2day/bootstrap-fuel` —
swap it if you fork.

## Manual deploy (CLI)

```bash
npm i -g vercel
vercel link              # connect this folder to a Vercel project
vercel env add GEMINI_API_KEY production
vercel env add ACCESS_PASSCODE production       # optional
vercel env add RATE_LIMIT_PER_HOUR production   # optional
vercel --prod
```

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Server-side key for `gemini-1.5-flash`. Get one at <https://aistudio.google.com/apikey>. Never expose to the browser. |
| `ACCESS_PASSCODE` | no | If set, the workspace shows a passcode gate. Only visitors who know the string can generate. Share it out-of-band (DM, email). |
| `RATE_LIMIT_PER_HOUR` | no | Per-IP generation cap, sliding hour. Defaults to `20`. The 429 response includes `Retry-After`. |

## Cost & abuse posture

- **Vercel:** Hobby tier is free for personal use; Pro is $20/mo if you cross
  bandwidth or function-invocation limits.
- **Gemini:** `gemini-1.5-flash` is the cheapest streaming model Google
  offers. Free tier exists; once you outgrow it, billing is on your Google
  account. **Anyone with the URL spends your tokens.** That's why
  `RATE_LIMIT_PER_HOUR` and `ACCESS_PASSCODE` exist — use at least one before
  posting the link publicly.
- The rate limit is an **in-memory edge map**. On Vercel's edge runtime each
  instance has its own bucket; a determined attacker hitting many regions can
  bypass it. For stronger limits, swap `lib/rateLimit.ts` to Upstash Redis or
  Vercel KV — both have free tiers and the API surface is identical to the
  current `checkRateLimit` function.

## After deploy

1. Visit the Vercel URL.
2. (If you set a passcode) enter it in the gate screen. It's stored in the
   visitor's localStorage; clearing site data signs them out.
3. Generate something. Check the Vercel function logs to confirm the
   `/api/generate` edge function is being hit.
4. Optional — add a custom domain via Vercel's dashboard (Settings → Domains).

## Updating

`git push` to the branch you connected. Vercel auto-builds and ships. Roll
back with `vercel rollback` or via the Deployments tab.

## Turning the lights off

Delete the Vercel project (Settings → Advanced → Delete). The repo and your
Gemini key remain untouched.
