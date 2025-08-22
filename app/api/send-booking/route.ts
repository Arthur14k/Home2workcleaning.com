import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceType, message } = body;

    // Send email to business
    await sgMail.send({
      to: "contact@home2workcleaning.com",
      from: "contact@home2workcleaning.com",
      subject: "New Booking Request",
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Type: ${serviceType}
        Message: ${message}
      `,
    });

    // Optional: send confirmation to customer
    await sgMail.send({
      to: email,
      from: "contact@home2workcleaning.com",
      subject: "Thanks for Booking with Home2Work Cleaning!",
      text: `Hi ${name},\n\nThanks for your booking. We’ll be in touch shortly to confirm the details.\n\n- Home2Work Cleaning`,
    });

    return NextResponse.json({ message: "Booking sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json({ error: "Failed to send booking request." }, { status: 500 });
  }
}
