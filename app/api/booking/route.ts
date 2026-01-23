import { NextResponse } from "next/server";
import { notifyEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Required fields (single source of truth)
    const requiredFields = [
      "serviceType",
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postcode",
      "rooms",
      "cleaningType",
      "frequency",
      "preferredDate",
      "preferredTime",
    ];

    const missing = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Normalize date to ISO (YYYY-MM-DD)
    const rawDate = formData.get("preferredDate") as string;
    const [dd, mm, yyyy] = rawDate.split("/");
    const normalizedDate = `${yyyy}-${mm}-${dd}`;

    const booking = {
      serviceType: formData.get("serviceType"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      postcode: formData.get("postcode"),
      rooms: formData.get("rooms"),
      cleaningType: formData.get("cleaningType"),
      frequency: formData.get("frequency"),
      preferredDate: normalizedDate,
      preferredTime: formData.get("preferredTime"),
      instructions: formData.get("instructions") || "—",
    };

    await notifyEmail({
      subject: "New Cleaning Booking",
      html: `
        <h2>New Booking</h2>
        <pre>${JSON.stringify(booking, null, 2)}</pre>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully",
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
