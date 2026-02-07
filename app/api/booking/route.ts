import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createBookingNotificationEmail, createBookingConfirmationEmail } from "@/lib/resend"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Booking API called")

    const formData = await request.formData()

    const bookingData = {
      serviceType: formData.get("serviceType") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postcode: formData.get("postCode") as string,
      propertySize: formData.get("propertySize") as string,
      rooms: formData.get("rooms") as string,
      cleaningType: formData.get("cleaningType") as string,
      frequency: formData.get("frequency") as string,
      preferredDate: formData.get("preferredDate") as string,
      preferredTime: formData.get("preferredTime") as string,
      specialInstructions: formData.get("specialInstructions") as string,
    }

    console.log("[v0] Booking data received")

    // Basic validation
    if (
      !bookingData.serviceType ||
      !bookingData.firstName ||
      !bookingData.lastName ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.cleaningType ||
      !bookingData.preferredDate ||
      !bookingData.preferredTime
    ) {
      console.log("[v0] Validation failed")
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    console.log("[v0] Validation passed")

    let supabaseResult = null
    try {
      console.log("[v0] Attempting Supabase save...")

      const supabase = await createClient()
      const tableName = process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE || "bookings"
      console.log("[v0] Using table:", tableName)

      const { data, error } = await supabase
        .from(tableName)
        .insert([
          {
            service_type: bookingData.serviceType,
            first_name: bookingData.firstName,
            last_name: bookingData.lastName,
            email: bookingData.email,
            phone: bookingData.phone,
            address: bookingData.address,
            city: bookingData.city,
            postcode: bookingData.postCode,
            property_size: bookingData.propertySize ? parseInt(bookingData.propertySize, 10) : null,
            rooms: bookingData.rooms,
            cleaning_type: bookingData.cleaningType,
            frequency: bookingData.frequency,
            preferred_date: bookingData.preferredDate,
            preferred_time: bookingData.preferredTime,
            special_instructions: bookingData.specialInstructions,
            status: "pending",
          },
        ])
        .select()

      if (error) {
        console.error("[v0] Supabase error:", error)
      } else {
        console.log("[v0] Supabase save successful")
        supabaseResult = data
      }
    } catch (supabaseError) {
      console.error("[v0] Supabase connection failed:", supabaseError)
      // Continue with email sending even if Supabase fails
    }

    // Send emails
    console.log("[v0] Sending emails...")

    try {
      // Send notification email to business
      const businessNotification = createBookingNotificationEmail(bookingData)
      const businessEmailResult = await sendEmail(businessNotification)
      console.log("[v0] Business email sent:", businessEmailResult.success)

      // Send confirmation email to customer
      const customerConfirmation = createBookingConfirmationEmail(bookingData)
      const customerEmailResult = await sendEmail(customerConfirmation)
      console.log("[v0] Customer email sent:", customerEmailResult.success)

      console.log("[v0] All processing complete")

      return NextResponse.json({
        success: true,
        message:
          "Booking request submitted successfully! We will contact you within 2 hours to confirm your appointment.",
        data: bookingData,
        supabaseId: supabaseResult?.[0]?.id || null,
        emailsSent: {
          business: businessEmailResult.success,
          customer: customerEmailResult.success,
        },
      })
    } catch (emailError) {
      console.error("[v0] Email sending failed:", emailError)
      return NextResponse.json(
        {
          success: false,
          message: "There was an issue sending confirmation emails. Please contact us directly.",
          error: emailError instanceof Error ? emailError.message : String(emailError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Booking submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or contact us directly.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
