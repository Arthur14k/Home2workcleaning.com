// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";          // Resend SDK needs Node runtime
export const dynamic = "force-dynamic";   // avoid static optimization issues

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  // simple honeypot (optional)
  website?: string;
};

function sanitizeLine(v: unknown) {
  return String(v ?? "").toString().slice(0, 1000);
}
function sanitizeMultiline(v: unknown) {
  return String(v ?? "").toString().slice(0, 8000);
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY missing");
      return NextResponse.json({ ok: false, error: "Server mail config missing" }, { status: 500 });
    }

    const from = process.env.NOTIFY_FROM;
    const to = process.env.NOTIFY_TO;
    if (!from || !to) {
      console.error("NOTIFY_FROM / NOTIFY_TO missing");
      return NextResponse.json({ ok: false, error: "Server mail addresses missing" }, { status: 500 });
    }

    const body = (await req.json()) as ContactPayload;

    // Basic validation
    const name = sanitizeLine(body.name);
    const email = sanitizeLine(body.email);
    const phone = sanitizeLine(body.phone);
    const topic = sanitizeLine(body.subject); // optional subject the user typed
    const message = sanitizeMultiline(body.message);

    // Honeypot check (bots often fill this)
    if (body.website && String(body.website).trim().length > 0) {
      // Pretend success to bots; do nothing.
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please provide name, email and message." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    // Compose subject
    const mailSubject = `New Contact Message — ${name}${topic ? ` (${topic})` : ""}`;

    const html = `
      <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px">New Contact Message</h2>
        <p style="margin:0 0 4px"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 4px"><strong>Email:</strong> ${email}</p>
        ${phone ? `<p style="margin:0 0 4px"><strong>Phone:</strong> ${phone}</p>` : ""}
        ${topic ? `<p style="margin:0 0 12px"><strong>Subject:</strong> ${topic}</p>` : ""}
        <div style="margin-top:12px">
          <strong>Message:</strong>
          <div style="white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-top:6px">
            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
        </div>
      </div>
    `;

    const text =
`New Contact Message
-------------------
Name:   ${name}
Email:  ${email}
Phone:  ${phone || "-"}
Subject:${topic || "-"}

Message:
${message}`;

    const { id } = await resend.emails.send({
      from,
      to,
      subject: mailSubject,
      text,
      html,
      // You can set reply-to so you can reply straight to the sender
      reply_to: email,
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error("Contact email error:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Failed to send message" }, { status: 500 });
  }
}
