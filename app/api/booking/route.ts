import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createBookingNotificationEmail, createBookingConfirmationEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Booking API called")

    const formData = await request.formData()
    console.log("📝 Form data received")

    const bookingData = {
      serviceType: formData.get("serviceType") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      propertySize: formData.get("propertySize") as string,
      rooms: formData.get("rooms") as string,
      cleaningType: formData.get("cleaningType") as string,
      frequency: formData.get("frequency") as string,
      preferredDate: formData.get("preferredDate") as string,
      preferredTime: formData.get("preferredTime") as string,
      specialInstructions: formData.get("specialInstructions") as string,
    }

    console.log("📋 Booking data:", bookingData)

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
      console.log("❌ Validation failed")
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    console.log("✅ Validation passed")

    // Try Supabase save (but don't let it break emails)
    let supabaseResult = null
    try {
      console.log("💾 Attempting Supabase save...")

      // Only try Supabase if we have the required environment variables
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

        const tableName = process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE || "Bookings"
        console.log("📊 Using table:", tableName)

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
              postcode: bookingData.zipCode,
              property_size: bookingData.propertySize,
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
          console.error("❌ Supabase error:", error)
        } else {
          console.log("✅ Supabase save successful:", data)
          supabaseResult = data
        }
      } else {
        console.log("⚠️ Supabase environment variables not found, skipping database save")
      }
    } catch (supabaseError) {
      console.error("❌ Supabase connection failed:", supabaseError)
      // Continue with email sending even if Supabase fails
    }

    // Send emails (this should always work)
    console.log("📧 Sending emails...")

    try {
      // Send notification email to business
      const businessNotification = createBookingNotificationEmail(bookingData)
      const businessEmailResult = await sendEmail(businessNotification)
      console.log("📧 Business email result:", businessEmailResult)

      // Send confirmation email to customer
      const customerConfirmation = createBookingConfirmationEmail(bookingData)
      const customerEmailResult = await sendEmail(customerConfirmation)
      console.log("📧 Customer email result:", customerEmailResult)

      console.log("✅ All processing complete")

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
      console.error("❌ Email sending failed:", emailError)
      return NextResponse.json(
        {
          success: false,
          message: "There was an issue sending confirmation emails. Please contact us directly.",
          error: emailError,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Booking submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or contact us directly.",
        error: error,
      },
      { status: 500 },
    )
  }
}
