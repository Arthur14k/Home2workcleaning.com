// app/api/booking/route.ts

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  sendEmail,
  createBookingNotificationEmail,
  createBookingConfirmationEmail,
} from "@/lib/resend"
import { verifyRecaptcha } from "@/lib/recaptcha"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Verify reCAPTCHA
    const recaptchaToken = formData.get("recaptchaToken")?.toString()
    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Please complete the reCAPTCHA verification." },
        { status: 400 }
      )
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      )
    }

    // Required fields (form uses camelCase)
    const service_type = formData.get("serviceType")?.toString()
    const first_name = formData.get("firstName")?.toString()
    const last_name = formData.get("lastName")?.toString()
    const email = formData.get("email")?.toString()
    const phone = formData.get("phone")?.toString()
    const address = formData.get("address")?.toString()
    const city = formData.get("city")?.toString()
    const postcode = formData.get("postcode")?.toString()
    const rooms = formData.get("rooms")?.toString()
    const cleaning_type = formData.get("cleaningType")?.toString()
    const frequency = formData.get("frequency")?.toString()
    const preferred_time = formData.get("preferredTime")?.toString()
    const preferred_date = formData.get("preferredDate")?.toString()

    // New fields
    const bathrooms = formData.get("bathrooms")?.toString() || null
    const addons = formData.get("addons")?.toString() || null
    const total_price = formData.get("totalPrice") 
      ? Number(formData.get("totalPrice")) 
      : null
    const business_type = formData.get("businessType")?.toString() || null
    const floors = formData.get("floors")?.toString() || null

    const property_size = formData.get("propertySize")
      ? Number(formData.get("propertySize"))
      : null

    const special_instruc =
      formData.get("specialInstructions")?.toString() || null

    // Validation
    if (
      !service_type ||
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !rooms ||
      !cleaning_type ||
      !frequency ||
      !preferred_date ||
      !preferred_time
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.from("bookings").insert({
      service_type,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postcode,
      property_size,
      rooms,
      cleaning_type,
      frequency,
      preferred_date,
      preferred_time,
      special_instructions: special_instruc,
      status: "pending",
      // New fields
      bathrooms,
      addons,
      total_price,
      business_type,
      floors,
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save booking." },
        { status: 500 }
      )
    }

    // Send emails (NON-BLOCKING)
    try {
      const bookingData = {
        serviceType: service_type,
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
        address,
        city,
        zipCode: postcode,
        cleaningType: cleaning_type,
        frequency,
        preferredDate: preferred_date,
        preferredTime: preferred_time,
        propertySize: property_size,
        rooms,
        specialInstructions: special_instruc,
        // New fields
        bathrooms,
        addons,
        totalPrice: total_price,
        businessType: business_type,
        floors,
      }

      await sendEmail(createBookingNotificationEmail(bookingData))
      await sendEmail(createBookingConfirmationEmail(bookingData))
    } catch (emailError) {
      console.error("Email send failed (booking still saved):", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Booking saved successfully.",
    })
  } catch (err) {
    console.error("Booking API error:", err)

    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 }
    )
  }
}
