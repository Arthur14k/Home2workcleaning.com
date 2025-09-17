import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendgrid";
import { createJobApplicationEmail } from "@/lib/sendgrid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const experience = formData.get("experience") as string;
    const availability = formData.get("availability") as string;
    const transportation = formData.get("transportation") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !phone || !experience || !availability || !transportation || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendEmail(
      createJobApplicationEmail(name, email, phone, experience, availability, transportation, message)
    );

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Job application submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
