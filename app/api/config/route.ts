export const runtime = "edge";

export async function GET() {
  return new Response(
    JSON.stringify({
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      passcodeRequired: Boolean(process.env.ACCESS_PASSCODE),
      freeRateLimitPerHour: Number(process.env.FREE_RATE_LIMIT_PER_HOUR || 3),
      proRateLimitPerHour: Number(process.env.PRO_RATE_LIMIT_PER_HOUR || 100),
      checkoutUrl: process.env.PRO_CHECKOUT_URL || null,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
