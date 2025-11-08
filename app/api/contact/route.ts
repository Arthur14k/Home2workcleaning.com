import { NextResponse } from "next/server";
import { notifyEmail } from "@/lib/resend";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

// env table names with safe defaults
const MESSAGES_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE || "messages";

function isJSON(req: Request) {
  return (req.headers.get("content-type") || "").includes("application/json");
}

async function readBody(req: Request) {
  if (isJSON(req)) {
    return (await req.json()) as Record<string, any>;
  }
  const form = await req.formData();
  const obj: Record<string, any> = {};
  for (const [k, v] of form.entries()) obj[k] = v;
  return obj;
}

export async function POST(req: Request) {
  try {
    const body = await readBody(req);

    const name = (body.name || body.fullName || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || body.tel || "").toString().trim();
    const subject = (body.subject || "").toString().trim();
    const message = (body.message || body.msg || "").toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    // Try save to Supabase (but don't fail if DB is down)
    try {
      const supabase = await createSupabaseClient();
      await supabase.from(MESSAGES_TABLE).insert({
        name,
        email,
        phone,
        subject,
        message,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("[contact] Supabase insert warning:", (e as Error).message);
    }

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
        <h2>New Contact Message</h2>
        <table cellspacing="0" cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Phone</b></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><b>Subject</b></td><td>${escapeHtml(subject)}</td></tr>
          <tr><td valign="top"><b>Message</b></td><td>${escapeHtml(message)}</td></tr>
        </table>
      </div>
    `;

    await notifyEmail({
      subject: subject ? `Contact — ${subject}` : `Contact — ${name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] error:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
