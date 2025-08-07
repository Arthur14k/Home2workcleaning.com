import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming form data:", body);

    const { firstName, lastName, email, phone, serviceType, message } = body;

    // Insert into Supabase
    const { data, error } = await supabase.from("supabase_review").insert([
      {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        service_type: serviceType,
        message,
      },
    ]);

    console.log("Supabase insert result:", { data, error });

    if (error) {
      throw error;
    }

    // Send email notification
    const msg = {
      to: "contact@home2workcleaning.com", // Your business email
      from: "contact@home2workcleaning.com", // Must match verified sender in SendGrid
      subject: "New Booking/Message from Website",
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Service Type: ${serviceType || "Not specified"}
        Message: ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Service Type:</strong> ${serviceType || "Not specified"}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in POST /api/send-contact:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}