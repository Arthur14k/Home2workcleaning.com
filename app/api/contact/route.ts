import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createContactNotificationEmail, createContactConfirmationEmail } from "@/lib/resend"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Contact API called")

    const formData = await request.formData()

    const contactData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      serviceType: formData.get("serviceType") as string,
      message: formData.get("message") as string,
    }

    console.log("[v0] Contact data received")

    // Basic validation
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      console.log("[v0] Validation failed")
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    console.log("[v0] Validation passed")

    let supabaseResult = null
    try {
      console.log("[v0] Attempting Supabase save...")

      const supabase = await createClient()
      const tableName = process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE || "messages"
      console.log("[v0] Using table:", tableName)

      const { data, error } = await supabase
        .from(tableName)
        .insert([
          {
            first_name: contactData.firstName,
            last_name: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
            city: contactData.city,
            postcode: contactData.zipCode,
            service_type: contactData.serviceType,
            message: contactData.message,
            status: "new",
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
      const businessNotification = createContactNotificationEmail(contactData)
      const businessEmailResult = await sendEmail(businessNotification)
      console.log("[v0] Business email sent:", businessEmailResult.success)

      // Send confirmation email to customer
      const customerConfirmation = createContactConfirmationEmail(contactData)
      const customerEmailResult = await sendEmail(customerConfirmation)
      console.log("[v0] Customer email sent:", customerEmailResult.success)

      console.log("[v0] All processing complete")

      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We will get back to you within 24 hours.",
        data: contactData,
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
          message: "There was an issue sending your message. Please contact us directly.",
          error: emailError instanceof Error ? emailError.message : String(emailError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Contact submission error:", error)
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
