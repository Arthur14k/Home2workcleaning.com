import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    // ✅ Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // ✅ Insert into Supabase
    const { error } = await supabase
      .from(process.env.NEXT_PUBLIC_SUPABASE_MESSAGES_TABLE!)
      .insert([{ name, email, phone, message }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to save message.' },
        { status: 500 }
      );
    }

    // ✅ Send confirmation email
    const msg = {
      to: 'contact@home2workcleaning.com',
      from: 'contact@home2workcleaning.com',
      subject: 'New Contact Message from Website',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'N/A'}
        Message: ${message}
      `,
    };

    await sgMail.send(msg);

    // ✅ Return success
    return NextResponse.json({ success: true });

  } catch (error) {
    // 🔥 This will show in Vercel logs
    console.error('SendContact Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
