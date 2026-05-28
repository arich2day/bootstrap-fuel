import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "@/lib/promptTemplates";
import type { GenerateRequestBody } from "@/lib/types";

export const runtime = "edge";

const MODEL = "gemini-1.5-flash";

export async function POST(req: Request) {
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "GEMINI_API_KEY is not configured on the server. Add it to .env.local and restart.",
      { status: 503 }
    );
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
    },
  });
}
