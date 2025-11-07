// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helpers
const S = (v: unknown, max = 1000) => String(v ?? "").slice(0, max);
const M = (v: unknown) => S(v, 8000);
const esc = (t: string) => t.replace(/</g, "&lt;").replace(/>/g, "&gt;");

function formToObject(fd: FormData) {
  const o: Record<string, any> = {};
  for (const [k, v] of fd.entries()) o[k] = typeof v === "string" ? v : "";
  return o;
}

async function readPayload(req: Request) {
  const ct = req.headers.get("content-type") || "";
  let raw: any = {};
  try {
    if (ct.includes("application/json")) raw = await req.json();
    else if (ct.includes("form")) raw = formToObject(await req.formData());
    else raw = await req.json();
  } catch {
    // leave empty; we'll validate
  }

  const name =
    raw.name ?? raw.fullname ?? raw.full_name ?? raw.contact_name ?? "";
  const email = raw.email ?? raw.contact_email ?? "";
  const phone = raw.phone ?? raw.contact_phone ?? raw.tel ?? "";
  const subject = raw.subject ?? raw.topic ?? raw.reason ?? "";
  const message =
    raw.message ?? raw.details ?? raw.notes ?? raw.description ?? "";
  const website = raw.website ?? raw.url ?? ""; // honeypot if present

  return { name, email, phone, subject, message, website };
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const FROM = process.env.NOTIFY_FROM;
  const TO = process.env.NOTIFY_TO;

  if (!key || !FROM || !TO) {
    console.error("Mail envs missing:", { hasKey: !!key, FROM, TO });
    return NextResponse.json(
      { ok: false, error: "Server mail configuration missing" },
      { status: 500 }
    );
  }

  const { name, email, phone, subject, message, website } =
    await readPayload(req);

  if (website && String(website).trim()) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email and message are required." },
      { status: 400 }
    );
  }

  const safe = {
    name: S(name),
    email: S(email),
    phone: S(phone),
    subject: S(subject),
    message: M(message),
  };

  const resend = new Resend(key);
  const mailSubject = `New Contact Message — ${safe.name}${
    safe.subject ? ` (${safe.subject})` : ""
  }`;

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">New Contact Message</h2>
      <p><b>Name:</b> ${esc(safe.name)}</p>
      <p><b>Email:</b> ${esc(safe.email)}</p>
      ${safe.phone ? `<p><b>Phone:</b> ${esc(safe.phone)}</p>` : ""}
      ${safe.subject ? `<p><b>Subject:</b> ${esc(safe.subject)}</p>` : ""}
      <div style="margin-top:12px"><b>Message:</b>
        <div style="white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-top:6px">
          ${esc(safe.message)}
        </div>
      </div>
    </div>
  `;

  const text =
`New Contact Message
-------------------
Name:    ${safe.name}
Email:   ${safe.email}
Phone:   ${safe.phone || "-"}
Subject: ${safe.subject || "-"}

Message:
${safe.message}`;

  try {
    const { id } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: mailSubject,
      html,
      text,
      reply_to: safe.email,
    });
    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("Contact email error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Email failed" }, { status: 500 });
  }
}
