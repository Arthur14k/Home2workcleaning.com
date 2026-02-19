// app/api/booking/route.ts
import { NextResponse } from "next/server"
import { createClientInstance } from "@/lib/supabase/server"
import { sendEmail, createBookingNotificationEmail, createBookingConfirmationEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Extract values (camelCase from client)
    const serviceType = formData.get("serviceType")?.toString()
    const firstName = formData.get("firstName")?.toString()
    const lastName = formData.get("lastName")?.toString()
    const email = formData.get("email")?.toString()
    const phone = formData.get("phone")?.toString()
    const address = formData.get("address")?.toString()
    const city = formData.get("city")?.toString()
    const postcode = formData.get("postcode")?.toString()
    const propertySize = formData.get("propertySize")
      ? Number(formData.get("propertySize"))
      : null
    const rooms = formData.get("rooms")?.toString()
    const cleaningType = formData.get("cleaningType")?.toString()
    const frequency = formData.get("frequency")?.toString()
    const preferredDate = formData.get("preferredDate")?.toString()
    const preferredTime = formData.get("preferredTime")?.toString()
    const specialInstructions =
      formData.get("specialInstructions")?.toString() || null

    // Validation
    if (
      !serviceType ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !rooms ||
      !cleaningType ||
      !frequency ||
      !preferredDate ||
      !preferredTime
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      )
    }

    const supabase = createClientInstance()

    // Insert using snake_case (matches Supabase table)
    const { error } = await supabase.from("bookings").insert({
      service_type: serviceType,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      city,
      postcode,
      property_size: propertySize,
      rooms,
      cleaning_type: cleaningType,
      frequency,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      special_instruc: specialInstructions,
      status: "pending",
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save booking." },
        { status: 500 }
      )
    }

    // Send admin notification
    const notificationEmail = createBookingNotificationEmail({
      serviceType,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postcode,
      propertySize,
      rooms,
      cleaningType,
      frequency,
      preferredDate,
      preferredTime,
      specialInstructions,
    })

    await sendEmail(notificationEmail)

    // Send confirmation to customer
    const confirmationEmail = createBookingConfirmationEmail({
      serviceType,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postcode,
      propertySize,
      rooms,
      cleaningType,
      frequency,
      preferredDate,
      preferredTime,
      specialInstructions,
    })

    await sendEmail(confirmationEmail)

    return NextResponse.json({
      success: true,
      message: "Booking received successfully.",
    })
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 }
    )
  }
}
