import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createBookingNotificationEmail, createBookingConfirmationEmail } from "@/lib/sendgrid"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

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

    // Save to Supabase database using your existing table name
    const tableName = process.env.NEXT_PUBLIC_SUPABASE_BOOKINGS_TABLE || "Bookings"

    const { data: supabaseData, error: supabaseError } = await supabase
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

    if (supabaseError) {
      console.error("Supabase booking error:", supabaseError)
    } else {
      console.log("Booking saved to Supabase:", supabaseData)
    }

    // Send emails
    const businessNotification = createBookingNotificationEmail(bookingData)
    const businessEmailResult = await sendEmail(businessNotification)

    const customerConfirmation = createBookingConfirmationEmail(bookingData)
    const customerEmailResult = await sendEmail(customerConfirmation)

    console.log("Booking submission:", bookingData)
    console.log("Business email sent:", businessEmailResult.success)
    console.log("Customer email sent:", customerEmailResult.success)

    return NextResponse.json({
      success: true,
      message:
        "Booking request submitted successfully! We will contact you within 2 hours to confirm your appointment.",
      data: bookingData,
      supabaseId: supabaseData?.[0]?.id,
    })
  } catch (error) {
    console.error("Booking submission error:", error)
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
  }
}
