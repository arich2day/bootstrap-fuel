import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "@/lib/promptTemplates";
import { checkRateLimit, clientKeyFromRequest } from "@/lib/rateLimit";
import { validateLicenseKey } from "@/lib/licenseValidation";
import type { GenerateRequestBody } from "@/lib/types";

export const runtime = "edge";

const MODEL = "gemini-1.5-flash";

const FREE_LIMIT = Number(process.env.FREE_RATE_LIMIT_PER_HOUR || 3);
const PRO_LIMIT = Number(process.env.PRO_RATE_LIMIT_PER_HOUR || 100);
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "GEMINI_API_KEY is not configured on the server.",
      { status: 503 }
    );
  }

  const requiredPasscode = process.env.ACCESS_PASSCODE;
  if (requiredPasscode) {
    const supplied = req.headers.get("x-bootstrap-passcode") || "";
    if (supplied !== requiredPasscode) {
      return new Response(
        "Access passcode required. Enter the passcode to continue.",
        { status: 401 }
      );
    }
  }

  let tier: "free" | "pro" = "free";
  let limit = FREE_LIMIT;

  const licenseKey = req.headers.get("x-bootstrap-license");
  if (licenseKey) {
    const result = await validateLicenseKey(licenseKey);
    if (result.valid) {
      tier = "pro";
      limit = PRO_LIMIT;
    }
  }

  const ipKey = clientKeyFromRequest(req);
  const rateKey = tier === "pro" ? `pro:${licenseKey}` : `free:${ipKey}`;
  const rate = checkRateLimit(rateKey, { limit, windowMs: WINDOW_MS });

  if (!rate.ok) {
    const retrySec = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000));
    const msg =
      tier === "free"
        ? `Free limit reached (${limit}/hr). Upgrade to Pro for ${PRO_LIMIT}/hr, or wait ${Math.ceil(retrySec / 60)} min.`
        : `Pro limit reached (${limit}/hr). Try again in ${Math.ceil(retrySec / 60)} min.`;
    return new Response(msg, {
      status: 429,
      headers: {
        "Retry-After": String(retrySec),
        "X-RateLimit-Limit": String(rate.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
        "X-Bootstrap-Tier": tier,
      },
    });
  }

  let body: GenerateRequestBody;
  try {
    body = (await req.json()) as GenerateRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { recipe, idea, audience, competitorContext, previous, refinement } = body;
  if (!recipe || !idea?.trim()) {
    return new Response("Missing 'recipe' or 'idea'.", { status: 400 });
  }

  const prompt = buildPrompt(recipe, {
    idea,
    audience,
    competitorContext,
    previous,
    refinement,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL });
        const result = await model.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`\n\n> Generation failed: ${msg}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-RateLimit-Limit": String(rate.limit),
      "X-RateLimit-Remaining": String(rate.remaining),
      "X-RateLimit-Reset": String(Math.floor(rate.resetAt / 1000)),
      "X-Bootstrap-Tier": tier,
    },
  });
}
