import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendContactEmail } from "@/lib/email/sendContactEmail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service_type, message } = body;

    // Basic validation (optional but helpful)
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Prepare data object
    const contactData = {
      name,
      email,
      phone,
      service_type, // Optional, will be undefined if not passed
      message,
    };

    // Insert into Supabase
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE!)
      .insert([contactData]);

    if (error) {
      console.error("Supabase insert error (send-contact):", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    // Send email
    await sendBookingEmail({ name, email, phone, service_type, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendContact Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
