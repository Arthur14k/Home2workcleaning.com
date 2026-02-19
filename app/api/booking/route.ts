// app/api/booking/route.ts

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  sendEmail,
  createBookingNotificationEmail,
  createBookingConfirmationEmail,
} from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Required fields
    const service_type = formData.get("service_type")?.toString()
    const first_name = formData.get("first_name")?.toString()
    const last_name = formData.get("last_name")?.toString()
    const email = formData.get("email")?.toString()
    const phone = formData.get("phone")?.toString()
    const address = formData.get("address")?.toString()
    const city = formData.get("city")?.toString()
    const postcode = formData.get("postcode")?.toString()
    const rooms = formData.get("rooms")?.toString()
    const cleaning_type = formData.get("cleaning_type")?.toString()
    const frequency = formData.get("frequency")?.toString()
    const preferred_time = formData.get("preferred_time")?.toString()

    const preferred_date = formData.get("preferred_date")?.toString()

    const property_size = formData.get("property_size")
      ? Number(formData.get("property_size"))
      : null

    const special_instruc =
      formData.get("special_instructions")?.toString() || null

    // Validation
    if (
      !service_type ||
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !rooms ||
      !cleaning_type ||
      !frequency ||
      !preferred_date ||
      !preferred_time
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { error } = await supabase.from("bookings").insert({
      service_type,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postcode,
      property_size,
      rooms,
      cleaning_type,
      frequency,
      preferred_date,
      preferred_time,
      special_instruc,
      status: "pending",
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save booking." },
        { status: 500 }
      )
    }

    // Send emails (NON-BLOCKING)
    try {
      const bookingData = {
        serviceType: service_type,
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
        address,
        city,
        zipCode: postcode,
        cleaningType: cleaning_type,
        frequency,
        preferredDate: preferred_date,
        preferredTime: preferred_time,
        propertySize: property_size,
        rooms,
        specialInstructions: special_instruc,
      }

      await sendEmail(createBookingNotificationEmail(bookingData))
      await sendEmail(createBookingConfirmationEmail(bookingData))
    } catch (emailError) {
      console.error("Email send failed (booking still saved):", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Booking saved successfully.",
    })
  } catch (err) {
    console.error("Booking API error:", err)

    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 }
    )
  }
}
