import { validateLicenseKey } from "@/lib/licenseValidation";

export const runtime = "edge";

export async function POST(req: Request) {
  let body: { licenseKey?: string };
  try {
    body = (await req.json()) as { licenseKey?: string };
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }
  const key = body.licenseKey?.trim();
  if (!key) {
    return new Response("Missing licenseKey", { status: 400 });
  }
  const result = await validateLicenseKey(key);
  return new Response(
    JSON.stringify({
      valid: result.valid,
      instanceName: result.instanceName ?? null,
      reason: result.valid ? undefined : result.reason,
    }),
    {
      status: result.valid ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
