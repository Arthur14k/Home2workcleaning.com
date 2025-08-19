import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendBookingEmail } from "@/lib/email/sendBookingEmail";

export async function POST(req: Request) {
  try {
    const {
      service_type,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      property_size,
      number_of_rooms,
      cleaning_type,
      cleaning_frequency,
      preferred_date,
      preferred_time,
      special_instructions,
    } = await req.json();

    // Send email
    await sendBookingEmail({
      service_type,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      property_size,
      number_of_rooms,
      cleaning_type,
      cleaning_frequency,
      preferred_date,
      preferred_time,
      special_instructions,
    });

    // Insert into Supabase
    const { error } = await supabase.from("bookings").insert([
      {
        service_type,
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        property_size,
        number_of_rooms,
        cleaning_type,
        cleaning_frequency,
        preferred_date,
        preferred_time,
        special_instructions,
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error.message);
      return NextResponse.json({ error: "Failed to save booking." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendBooking Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}