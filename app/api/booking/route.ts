// app/api/booking/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { notifyEmail } from "@/lib/resend"

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
    const zip_code = formData.get("zip_code")?.toString()
    const rooms = formData.get("rooms")?.toString()
    const cleaning_type = formData.get("cleaning_type")?.toString()
    const frequency = formData.get("frequency")?.toString()
    const preferred_time = formData.get("preferred_time")?.toString()

    // Date handling (UK → ISO)
    const rawDate = formData.get("preferred_date")?.toString()
    let preferred_date: string | null = null

    if (rawDate) {
      // Expecting YYYY-MM-DD from client
      preferred_date = rawDate
    }

    // Optional fields
    const property_size = formData.get("property_size")
      ? Number(formData.get("property_size"))
      : null

    const special_instructions =
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
      !zip_code ||
      !rooms ||
      !cleaning_type ||
      !frequency ||
      !preferred_date ||
      !preferred_time
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields. Please complete all required inputs.",
        },
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
      zip_code,
      property_size,
      rooms,
      cleaning_type,
      frequency,
      preferred_date,
      preferred_time,
      special_instructions,
      status: "pending",
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save booking. Please try again.",
        },
        { status: 500 }
      )
    }

    // Email notification (admin)
    await notifyEmail({
      subject: "New Booking Received",
      html: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${cleaning_type}</p>
        <p><strong>Date:</strong> ${preferred_date}</p>
        <p><strong>Time:</strong> ${preferred_time}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Booking received successfully. We’ll contact you shortly.",
    })
  } catch (err) {
    console.error("Booking API error:", err)
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error. Please try again later.",
      },
      { status: 500 }
    )
  }
}
