import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import {
  createContactNotificationEmail,
  createContactConfirmationEmail,
} from "@/lib/sendgrid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`;

    await sendEmail(createContactNotificationEmail(fullName, email, phone, message));
    await sendEmail(createContactConfirmationEmail(fullName, email));

    return NextResponse.json({ message: "Message submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
