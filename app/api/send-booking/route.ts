import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phone,
      service_type,
      property_type,
      frequency,
      address,
      city,
      postcode,
      date,
      time,
      message,
    } = await req.json();

    // Insert into Supabase
    const { error } = await supabase.from('bookings').insert([
      {
        name,
        email,
        phone,
        service_type,
        property_type,
        frequency,
        address,
        city,
        postcode,
        date,
        time,
        message,
      },
    ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ success: false, error: 'Database Insert Failed' }, { status: 500 });
    }

    // Send email using SendGrid
    await sgMail.send({
      to: 'contact@home2workcleaning.com',
      from: 'contact@home2workcleaning.com',
      subject: 'New Booking Request',
      text: `
New Booking Submitted:

Name: ${name}
Email: ${email}
Phone: ${phone}
Service Type: ${service_type}
Property Type: ${property_type}
Frequency: ${frequency}
Address: ${address}
City: ${city}
Postcode: ${postcode}
Date: ${date}
Time: ${time}
Message: ${message}
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('SendBooking Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
