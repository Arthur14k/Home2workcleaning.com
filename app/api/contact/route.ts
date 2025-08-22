import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createContactNotificationEmail, createContactConfirmationEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data
    const contactData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      serviceType: formData.get("serviceType") as string,
      message: formData.get("message") as string,
    }

    // Basic validation
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.message) {
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    // Send notification email to business
    const businessNotification = createContactNotificationEmail(contactData)
    const businessEmailResult = await sendEmail(businessNotification)

    // Send confirmation email to customer
    const customerConfirmation = createContactConfirmationEmail(contactData)
    const customerEmailResult = await sendEmail(customerConfirmation)

    // Log the submission
    console.log("Contact form submission:", contactData)
    console.log("Business email sent:", businessEmailResult.success)
    console.log("Customer email sent:", customerEmailResult.success)

    // Return success even if emails fail (but log the issues)
    if (!businessEmailResult.success) {
      console.error("Failed to send business notification email:", businessEmailResult.error)
    }

    if (!customerEmailResult.success) {
      console.error("Failed to send customer confirmation email:", customerEmailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We will get back to you within 24 hours.",
      data: contactData,
    })
  } catch (error) {
    console.error("Contact form submission error:", error)
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or call us directly." },
      { status: 500 },
    )
  }
}
