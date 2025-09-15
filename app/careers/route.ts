import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || '';
    const experience = formData.get('experience')?.toString() || '';
    const availability = formData.get('availability')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    const emailText = `
New Job Application Received:

Name: ${name}
Email: ${email}
Phone: ${phone}
Experience: ${experience}
Availability: ${availability}
Message: ${message}
`;

    await sendEmail({
      to: 'contact@home2workcleaning.com',
      subject: 'New Job Application Submission',
      text: emailText,
    });

    await sendEmail({
      to: email,
      subject: 'Application Received - Home2Work Cleaning',
      text: `Hi ${name},\n\nThank you for applying to join Home2Work Cleaning! We'll review your application and get back to you soon.\n\nBest,\nHome2Work Cleaning Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job application submission error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}
