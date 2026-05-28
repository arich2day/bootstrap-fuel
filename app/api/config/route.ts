export const runtime = "edge";

export async function GET() {
  return new Response(
    JSON.stringify({
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      passcodeRequired: Boolean(process.env.ACCESS_PASSCODE),
      rateLimitPerHour: Number(process.env.RATE_LIMIT_PER_HOUR || 20),
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
