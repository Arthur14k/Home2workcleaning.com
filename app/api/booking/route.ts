import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createBookingNotificationEmail, createBookingConfirmationEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data - matching the booking form fields
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
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    // Send notification email to business
    const businessNotification = createBookingNotificationEmail(bookingData)
    const businessEmailResult = await sendEmail(businessNotification)

    // Send confirmation email to customer
    const customerConfirmation = createBookingConfirmationEmail(bookingData)
    const customerEmailResult = await sendEmail(customerConfirmation)

    // Log the submission
    console.log("Booking submission:", bookingData)
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
      message:
        "Booking request submitted successfully! We will contact you within 2 hours to confirm your appointment.",
      data: bookingData,
    })
  } catch (error) {
    console.error("Booking submission error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
