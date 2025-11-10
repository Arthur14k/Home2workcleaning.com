// app/api/contact/route.ts
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/resend";

export const runtime = "nodejs";

type ContactPayload = {
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  [key: string]: any;
};

async function readBody(req: NextRequest): Promise<Record<string, any>> {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      return await req.json();
    }
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const out: Record<string, any> = {};
      for (const [k, v] of form.entries()) out[k] = typeof v === "string" ? v : (v as File).name;
      return out;
    }
    const text = await req.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

function requireEnv() {
  const from = process.env.NOTIFY_FROM;
  const to = process.env.NOTIFY_TO;
  if (!from || !to) throw new Error("NOTIFY_FROM / NOTIFY_TO missing");
  return { from, to };
}

export async function POST(req: NextRequest) {
  try {
    const { from, to } = requireEnv();
    const data = (await readBody(req)) as ContactPayload;

    const fullName = data.fullName || data.name || "Unknown";
    const email = data.email || "no-email-provided";
    const phone = data.phone || "";
    const subjectLine = data.subject || `New Contact Message from ${fullName}`;
    const message = data.message || data.notes || "";

    // --- Send Email
    const text = [
      `New contact message`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Message: ${message}`,
    ].join("\n");

    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
    `;

    await sendNotificationEmail({
      subject: subjectLine,
      text,
      html,
      from,
      to,
    });

    // --- Best-effort DB insert
    try {
      const supabase = await createClient();
      const table =
        process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE?.trim() || "messages";
      await supabase.from(table).insert({
        name: fullName,
        email,
        phone,
        subject: subjectLine,
        message,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Contact DB insert failed:", (e as Error).message);
    }

    return Response.json({ ok: true });
  } catch (err) {
    const msg = (err as Error).message || "Unknown error";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
