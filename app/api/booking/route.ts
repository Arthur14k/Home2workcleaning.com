import { NextResponse } from "next/server"
import { notifyEmail } from "@/lib/resend"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Convert FormData to plain object
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = String(value)
    })

    // 🔍 TEMP DEBUG — remove after final confirmation
    console.log("BOOKING PAYLOAD RECEIVED:", data)

    // ✅ Canonical required fields
    const requiredFields = [
      "serviceType",
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postcode",
      "cleaningType",
      "preferredDate",
      "preferredTime",
    ]

    const missingFields = requiredFields.filter(
      (field) => !data[field] || data[field].trim() === ""
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // ✉️ Email content
    const emailHtml = `
      <h2>New Booking Received</h2>
      <p><strong>Service Type:</strong> ${data.serviceType}</p>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>

      <h3>Property Details</h3>
      <p>${data.address}, ${data.city}, ${data.postcode}</p>
      <p><strong>Rooms:</strong> ${data.rooms || "N/A"}</p>
      <p><strong>Property Size:</strong> ${data.propertySize || "N/A"}</p>

      <h3>Service Details</h3>
      <p><strong>Cleaning Type:</strong> ${data.cleaningType}</p>
      <p><strong>Frequency:</strong> ${data.frequency || "N/A"}</p>

      <h3>Date & Time</h3>
      <p>${data.preferredDate} — ${data.preferredTime}</p>

      <h3>Instructions</h3>
      <p>${data.instructions || "None"}</p>
    `

    // 🔔 Send notification email
    await notifyEmail({
      subject: "New Cleaning Booking",
      html: emailHtml,
    })

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully.",
    })
  } catch (error) {
    console.error("BOOKING API ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again.",
      },
      { status: 500 }
    )
  }
}