import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendContactEmail } from "@/lib/email/sendContactEmail";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    // Send email
    await sendContactEmail({ name, email, phone, message });

    // Store data in Supabase
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE!)
      .insert([{ name, email, phone, message }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendContact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
