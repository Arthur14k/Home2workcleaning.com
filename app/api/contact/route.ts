import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createContactNotificationEmail, createContactConfirmationEmail } from "@/lib/sendgrid"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
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

    // Basic validation
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    // Save to Supabase database using your existing table name
    const tableName = process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE || "messages"

    const { data: supabaseData, error: supabaseError } = await supabase
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

    if (supabaseError) {
      console.error("Supabase contact error:", supabaseError)
    } else {
      console.log("Contact saved to Supabase:", supabaseData)
    }

    // Send emails
    const businessNotification = createContactNotificationEmail(contactData)
    const businessEmailResult = await sendEmail(businessNotification)

    const customerConfirmation = createContactConfirmationEmail(contactData)
    const customerEmailResult = await sendEmail(customerConfirmation)

    console.log("Contact form submission:", contactData)
    console.log("Business email sent:", businessEmailResult.success)
    console.log("Customer email sent:", customerEmailResult.success)

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We will get back to you within 24 hours.",
      data: contactData,
      supabaseId: supabaseData?.[0]?.id,
    })
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or call us directly." },
      { status: 500 },
    )
  }
}
