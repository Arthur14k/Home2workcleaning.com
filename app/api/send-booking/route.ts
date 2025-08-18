import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceType, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !serviceType || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Insert into Supabase bookings table
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE!)
      .insert([{ name, email, phone, service_type, message }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save booking." },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendBooking Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
