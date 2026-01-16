import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { notifyEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      phone,
      address,
      service,
      date,
      notes,
    } = body

    // ---- 1. Validate required fields (fail fast, clearly)
    if (!name || !email || !service || !date) {
      return NextResponse.json(
        { message: "Missing required booking fields." },
        { status: 400 }
      )
    }

    // ---- 2. Insert booking into Supabase (SOURCE OF TRUTH)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          name,
          email,
          phone,
          address,
          service,
          date,
          notes,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase booking insert failed:", error)
      return NextResponse.json(
        { message: "Booking could not be saved. Please try again." },
        { status: 500 }
      )
    }

    // ---- 3. Send notification email (NON-BLOCKING)
    try {
      await notifyEmail({
        subject: "New Booking Received",
        html: `
          <h2>New Booking</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "—"}</p>
          <p><strong>Address:</strong> ${address || "—"}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Notes:</strong> ${notes || "—"}</p>
        `,
      })
    } catch (emailError) {
      // Email failure should NEVER break booking
      console.warn("Booking email failed (non-fatal):", emailError)
    }

    // ---- 4. Return success once booking exists
    return NextResponse.json(
      {
        message: "Booking received successfully.",
        bookingId: data.id,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Unhandled booking API error:", err)

    return NextResponse.json(
      { message: "Unexpected server error." },
      { status: 500 }
    )
  }
}
