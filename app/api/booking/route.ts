import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import {
  createBookingNotificationEmail,
  createBookingConfirmationEmail,
} from "@/lib/sendgrid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendEmail(createBookingNotificationEmail(name, email, phone, message));
    await sendEmail(createBookingConfirmationEmail(name, email));

    return NextResponse.json({ message: "Booking submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
