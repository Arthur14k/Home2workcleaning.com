export async function POST(req: Request) {
  console.log("📥 POST /api/send-booking called");

  let body;
  try {
    body = await req.json();
    console.log("🧾 Parsed body:", body);
  } catch (err) {
    console.error("❌ Invalid JSON:", err);
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, serviceType, message } = body;

  console.log("📤 Inserting into Supabase...");
  const { data, error } = await supabase.from("bookings").insert([
    {
      name,
      email,
      phone,
      service_type: serviceType,
      message,
    },
  ]);

  if (error) {
    console.error("🔥 Supabase insert error:", error);
    return NextResponse.json(
      { success: false, error: JSON.stringify(error, null, 2) },
      { status: 500 }
    );
  }

  console.log("✅ Booking saved:", data);
  return NextResponse.json({ success: true });
}
