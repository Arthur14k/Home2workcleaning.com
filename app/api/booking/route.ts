import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const serviceType = formData.get("serviceType")?.toString()
    const firstName = formData.get("firstName")?.toString()
    const lastName = formData.get("lastName")?.toString()
    const email = formData.get("email")?.toString()
    const phone = formData.get("phone")?.toString()
    const address = formData.get("address")?.toString()
    const city = formData.get("city")?.toString()
    const postcode = formData.get("postcode")?.toString()
    const rooms = formData.get("rooms")?.toString()
    const cleaningType = formData.get("cleaningType")?.toString()
    const frequency = formData.get("frequency")?.toString()
    const preferredTime = formData.get("preferredTime")?.toString()
    const preferredDate = formData.get("preferredDate")?.toString()

    const propertySize = formData.get("propertySize")
      ? Number(formData.get("propertySize"))
      : null

    const specialInstructions =
      formData.get("specialInstructions")?.toString() || null

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
        { status: 400 },
      )
    }

    // Use @supabase/supabase-js directly (no cookies needed in API routes)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

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
      special_instructions: specialInstructions,
      status: "pending",
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save booking." },
        { status: 500 },
      )
    }

    // Email notification - wrapped in try/catch so it never kills the request
    try {
      await notifyEmail({
        subject: "New Booking Received",
        html: `
          <h2>New Booking</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${cleaningType}</p>
          <p><strong>Date:</strong> ${preferredDate}</p>
          <p><strong>Time:</strong> ${preferredTime}</p>
        `,
      })
    } catch (emailError) {
      console.error("Email notification failed:", emailError)
      // Continue - booking was saved, email failure is non-critical
    }

    return NextResponse.json({
      success: true,
      message: "Booking received successfully.",
    })
  } catch (err) {
    console.error("Booking API error:", err)
    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 },
    )
  }
}
