import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendBookingEmail } from "@/lib/email/sendBookingEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service_type, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const bookingData = { name, email, phone, service_type, message };

    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE!)
      .insert([bookingData]);

    if (error) {
      console.error("Supabase insert error (send-booking):", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    await sendBookingEmail(bookingData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendBooking Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
