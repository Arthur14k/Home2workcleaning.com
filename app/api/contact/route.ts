import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createContactNotificationEmail, createContactConfirmationEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Contact API called")

    const formData = await request.formData()
    console.log("📝 Form data received")

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

    console.log("📋 Contact data:", contactData)

    // Basic validation
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
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

        const tableName = process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE || "messages"
        console.log("📊 Using table:", tableName)

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
      const businessNotification = createContactNotificationEmail(contactData)
      const businessEmailResult = await sendEmail(businessNotification)
      console.log("📧 Business email result:", businessEmailResult)

      // Send confirmation email to customer
      const customerConfirmation = createContactConfirmationEmail(contactData)
      const customerEmailResult = await sendEmail(customerConfirmation)
      console.log("📧 Customer email result:", customerEmailResult)

      console.log("✅ All processing complete")

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
      console.error("❌ Email sending failed:", emailError)
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
    console.error("❌ Contact submission error:", error)
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
