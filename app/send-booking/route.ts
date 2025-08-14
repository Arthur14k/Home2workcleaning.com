// app/api/send-booking/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { supabase } from "@/lib/supabase";

const TO_EMAIL = "contact@home2workcleaning.com"; // change if needed
const TABLE_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE ?? "messages"; // override via env if your table name differs

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY is not set. Email sending will fail.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const serviceType = (body.serviceType || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !serviceType || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Save to Supabase (into a “messages” table by default)
    // Ensure this table has these columns or change TABLE_NAME accordingly:
    // name, email, phone, service_type, message, kind, created_at
    const { error: dbError } = await supabase.from(TABLE_NAME).insert([
      {
        name,
        email,
        phone,
        service_type: serviceType,
        message,
        kind: "BOOKING",
      },
    ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed saving booking." },
        { status: 500 }
      );
    }

    // 2) Send email via SendGrid
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "—"}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Message:</strong><br />${message.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: TO_EMAIL,
        from: "no-reply@home2workcleaning.com", // must be a verified sender in SendGrid
        subject: `New Booking: ${serviceType} — ${name}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/send-booking:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}