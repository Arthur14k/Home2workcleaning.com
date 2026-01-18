import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log("📥 BOOKING FORM DATA RECEIVED:", data);

    // Explicit required fields
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
      "frequency",
      "preferredDate",
      "preferredTime",
      "rooms",
    ];

    const missingFields = requiredFields.filter(
      (field) => !data[field] || String(data[field]).trim() === ""
    );

    if (missingFields.length > 0) {
      console.error("❌ Missing fields:", missingFields);
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missingFields,
        },
        { status: 400 }
      );
    }

    // Convert ISO date to UK format for email display
    const isoDate = String(data.preferredDate); // YYYY-MM-DD
    const [year, month, day] = isoDate.split("-");
    const ukDate = `${day}/${month}/${year}`;

    const emailHtml = `
      <h2>New Cleaning Booking</h2>
      <p><strong>Service:</strong> ${data.serviceType}</p>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>

      <h3>Property</h3>
      <p>${data.address}, ${data.city}, ${data.postcode}</p>
      <p><strong>Rooms:</strong> ${data.rooms}</p>

      <h3>Service Details</h3>
      <p><strong>Cleaning Type:</strong> ${data.cleaningType}</p>
      <p><strong>Frequency:</strong> ${data.frequency}</p>
      <p><strong>Date:</strong> ${ukDate}</p>
      <p><strong>Time:</strong> ${data.preferredTime}</p>

      ${
        data.notes
          ? `<h3>Special Instructions</h3><p>${data.notes}</p>`
          : ""
      }
    `;

    await resend.emails.send({
      from: process.env.NOTIFY_FROM!,
      to: process.env.NOTIFY_TO!,
      subject: "New Cleaning Booking",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully.",
    });
  } catch (error) {
    console.error("🔥 Booking API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}