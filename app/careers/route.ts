import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const availability = formData.get('availability') as string;
    const transport = formData.get('transport') as string;
    const message = formData.get('message') as string;

    // Email to admin
    const adminSubject = `📥 New Job Application from ${name}`;
    const adminHtml = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Availability:</strong> ${availability}</p>
      <p><strong>Transport:</strong> ${transport}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `;

    await sendEmail('contact@home2workcleaning.com', adminSubject, adminHtml);

    // Confirmation email to applicant
    const userSubject = '🧼 Thanks for Applying to Home2Work Cleaning';
    const userHtml = `
      <p>Hi ${name},</p>
      <p>Thanks for your application! We've received your details and will be in touch shortly.</p>
      <p>— Home2Work Cleaning Team</p>
    `;

    await sendEmail(email, userSubject, userHtml);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job application submission error:', error);
    return NextResponse.json({ error: 'Failed to send application.' }, { status: 500 });
  }
}