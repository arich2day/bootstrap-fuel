export const runtime = "edge";

export async function GET() {
  return new Response(
    JSON.stringify({ hasApiKey: Boolean(process.env.GEMINI_API_KEY) }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
