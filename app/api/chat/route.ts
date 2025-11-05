import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 1) Read user message
  const { message } = await req.json().catch(() => ({} as any));
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Missing 'message' (string)" }, { status: 400 });
  }

  // 2) Persist a session id for Simple Memory in n8n
  const cookieName = "rushd_sid";
  const existing = req.cookies.get(cookieName)?.value;
  const sessionId = existing ?? crypto.randomUUID();

  // 3) Your n8n webhook URL (set in .env.local)
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    return NextResponse.json({ error: "N8N_WEBHOOK_URL is not set" }, { status: 500 });
  }

  // 4) Call n8n (Webhook node) with session + message
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
    cache: "no-store",
  });

  // 5) Normalize response shape
  const contentType = res.headers.get("content-type") || "";
  let data: any;
  try {
    data = contentType.includes("application/json")
      ? await res.json()
      : { output: await res.text() };
  } catch {
    data = { output: await res.text() };
  }

  const reply = data.reply ?? data.output ?? data.text ?? data.answer ?? "";

  // 6) Return to the browser + set session cookie
  const out = NextResponse.json({ reply, raw: data, ok: res.ok, status: res.status });
  out.cookies.set(cookieName, sessionId, { httpOnly: true, sameSite: "lax", path: "/" });
  return out;
}