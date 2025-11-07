// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return NextResponse.json({ error: "Server misconfig" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const data = await req.json();

    const from = process.env.NOTIFY_FROM!;
    const to = process.env.NOTIFY_TO!;

    await resend.emails.send({
      from,
      to,
      subject: `New Booking — ${data?.name ?? "Website"}`,
      text: `Name: ${data?.name}\nEmail: ${data?.email}\nPhone: ${data?.phone}\nMessage: ${data?.message}`,
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${data?.name || "-"}</p>
        <p><b>Email:</b> ${data?.email || "-"}</p>
        <p><b>Phone:</b> ${data?.phone || "-"}</p>
        <p><b>Message:</b><br/>${(data?.message || "").replace(/\n/g,"<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Booking email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
