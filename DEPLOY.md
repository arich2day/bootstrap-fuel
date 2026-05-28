# Deploying BootstrapFuel (laptop-off + charging customers)

Vercel hosts the app and the Gemini-streaming edge function. LemonSqueezy
handles checkout, license keys, and global VAT/sales tax. No database needed.

## One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel&env=GEMINI_API_KEY,FREE_RATE_LIMIT_PER_HOUR,PRO_RATE_LIMIT_PER_HOUR,PRO_CHECKOUT_URL,LEMONSQUEEZY_STORE_ID,ACCESS_PASSCODE&envDescription=Gemini%20key%20required.%20Set%20PRO_CHECKOUT_URL%20to%20enable%20the%20Upgrade%20button.&envLink=https%3A%2F%2Fgithub.com%2Farich2day%2Fbootstrap-fuel%2Fblob%2Fmain%2F.env.example)

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Server-side key for `gemini-1.5-flash`. <https://aistudio.google.com/apikey> |
| `FREE_RATE_LIMIT_PER_HOUR` | no | Free-tier generations per IP per hour. Default `3`. |
| `PRO_RATE_LIMIT_PER_HOUR` | no | Pro generations per license key per hour. Default `100`. |
| `PRO_CHECKOUT_URL` | no | LemonSqueezy checkout link. If unset, the Upgrade button is hidden. |
| `LEMONSQUEEZY_STORE_ID` | no | Restrict license validation to your store id (recommended). |
| `ACCESS_PASSCODE` | no | Pre-launch / private mode. If set, **everyone** must enter this passcode before seeing the app. Leave empty for a public Free + Pro deployment. |

## Selling Pro access in 10 minutes (LemonSqueezy)

1. Create an account at <https://lemonsqueezy.com>. They handle global VAT
   and sales tax as merchant of record (5% + 50¢/transaction).
2. Create a **digital product**, set the price (e.g. $19/mo or $99 lifetime).
3. In the product's **License keys** tab, enable license key generation. You
   can pick test mode while you're iterating.
4. Grab the product's **checkout URL** — set it as `PRO_CHECKOUT_URL` on
   Vercel.
5. From LemonSqueezy → Settings → General, copy your **Store ID** → set as
   `LEMONSQUEEZY_STORE_ID`. (Optional but stops keys from other stores from
   working.)
6. Redeploy. The sidebar now shows **Free · 3/hr** + an **Upgrade to Pro**
   button. After purchase, the customer pastes their key (LemonSqueezy emails
   it automatically) into "Have a key?" and is bumped to **Pro · 100/hr**.

License validation is server-side via LemonSqueezy's public license endpoint;
keys are cached for 10 minutes per edge instance.

## Cost & abuse posture

- **Vercel:** Hobby free; Pro at $20/mo if you cross limits.
- **Gemini Flash:** charged per token on your Google account. Free tier
  covers small traffic. Two-tier rate limits cap exposure: anonymous IPs get
  3/hr, paid customers 100/hr.
- The free quota is **per IP, in-memory, per edge instance**. A determined
  attacker can spin through it across regions. If that becomes a problem,
  swap `lib/rateLimit.ts` to Upstash Redis / Vercel KV — same function
  signature, just persisted globally.
- LemonSqueezy refunds / churn flow on their end. License revocations
  propagate within the 10-minute cache window. To force-revoke faster, lower
  `CACHE_TTL_MS` in `lib/licenseValidation.ts`.

## Pricing suggestions (anchor points)

- **Free**: 3 generations/hr, all recipes, local-first.
- **Pro $19/mo or $99 lifetime**: 100/hr, priority for new recipes.
- (Future) **Team**: bring-your-own Gemini key — see roadmap.

## After deploy

1. Visit the URL. Confirm the sidebar footer reads `Free · 3/hr` and the
   Upgrade button opens your LemonSqueezy checkout.
2. Buy your own product in test mode, copy the license, paste into "Have a
   key?" — sidebar should flip to `Pro · 100/hr`.
3. Custom domain via Vercel → Settings → Domains.

## Updating

`git push` to the deployed branch — Vercel rebuilds. Roll back via the
Deployments tab or `vercel rollback`.

## Turning the lights off

Delete the Vercel project + close the LemonSqueezy product. Repo and Gemini
key are untouched.
