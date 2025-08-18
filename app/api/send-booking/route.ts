import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sendBookingEmail from "@/lib/email/sendBookingEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceType, message } = body;

    // Compose the booking data object
    const bookingData: any = {
      name,
      email,
      phone,
      message,
    };

    // Include service_type only if serviceType exists
    if (serviceType) {
      bookingData.service_type = serviceType;
    }

    // Insert into Supabase
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE!)
      .insert([bookingData]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    // Send notification email
    await sendBookingEmail({ name, email, phone, serviceType, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendBooking Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
