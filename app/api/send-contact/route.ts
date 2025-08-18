import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Incoming contact request:", body);

    const { data, error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE!)
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          message: body.message,
        },
      ])
      .select();

   if (error) {
  console.error("Supabase insert error:", error);
  return NextResponse.json(
    { success: false, error: JSON.stringify(error, null, 2) },
    { status: 500, headers: CORS_HEADERS }
  );
}

    console.log("✅ Contact message saved:", data);
    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error("🔥 Unexpected server error (CONTACT):", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
