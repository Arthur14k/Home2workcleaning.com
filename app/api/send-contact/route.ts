import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sendBookingEmail from "@/lib/email/sendBookingEmail"; // same email handler for now

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceType, message } = body;

    // Create the data object for Supabase
    const contactData: any = {
      name,
      email,
      phone,
      message,
    };

    // Include service_type only if provided
    if (serviceType) {
      contactData.service_type = serviceType;
    }

    // Insert into Supabase
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE!)
      .insert([contactData]);

    if (error) {
      console.error("Supabase insert error (send-contact):", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    // Send confirmation email
    await sendBookingEmail({ name, email, phone, serviceType, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendContact Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
