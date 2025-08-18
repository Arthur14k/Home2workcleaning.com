import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendContactEmail } from "@/lib/email/sendContactEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const contactData = { name, email, phone, message };

    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE!) // assuming bookings table is used for contact too
      .insert([contactData]);

    if (error) {
      console.error("Supabase insert error (send-contact):", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    await sendContactEmail(contactData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendContact Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
