// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract fields safely
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const service = formData.get("service")?.toString();
    const date = formData.get("date")?.toString();

    if (!name || !email || !service || !date) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 1️⃣ Save booking (CRITICAL)
    const { error: dbError } = await supabase.from("bookings").insert({
      name,
      email,
      service,
      date,
    });

    if (dbError) {
      console.error("Booking DB error:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save booking." },
        { status: 500 }
      );
    }

    // 2️⃣ Send email (NON-CRITICAL)
    try {
      await sendBookingEmail({
        subject: "New Cleaning Booking",
        html: `
          <h2>New Booking</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
        `,
      });
    } catch (emailError) {
      // IMPORTANT: Do NOT fail the request
      console.error("Email failed but booking succeeded:", emailError);
    }

    // 3️⃣ Always return success if booking saved
    return NextResponse.json({
      success: true,
      message: "Booking received successfully.",
    });
  } catch (err) {
    console.error("Unexpected booking error:", err);

    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 }
    );
  }
}