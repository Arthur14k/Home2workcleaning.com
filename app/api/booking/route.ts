import { NextResponse } from "next/server";
import { notifyEmail } from "@/lib/resend";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

// env table names with safe defaults
const BOOKINGS_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE || "bookings";

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

    // Extract common booking fields
    const name = (body.name || body.fullName || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || body.tel || "").toString().trim();
    const service = (body.service || body.serviceType || "").toString().trim();
    const date = (body.date || body.bookingDate || "").toString().trim();
    const message = (body.message || body.notes || "").toString().trim();

    if (!name || !email || !service) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (name, email, service)" },
        { status: 400 }
      );
    }

    // Try save to Supabase (but don't fail the whole request if DB is down)
    try {
      const supabase = await createSupabaseClient();
      await supabase.from(BOOKINGS_TABLE).insert({
        name,
        email,
        phone,
        service,
        date,
        message,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("[booking] Supabase insert warning:", (e as Error).message);
    }

    // Build email HTML summary
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
        <h2>New Booking Request</h2>
        <table cellspacing="0" cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Phone</b></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><b>Service</b></td><td>${escapeHtml(service)}</td></tr>
          <tr><td><b>Date</b></td><td>${escapeHtml(date)}</td></tr>
          <tr><td><b>Message</b></td><td>${escapeHtml(message)}</td></tr>
        </table>
      </div>
    `;

    await notifyEmail({
      subject: `Booking — ${name} (${service})`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/booking] error:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

// minimal safe-escape
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}