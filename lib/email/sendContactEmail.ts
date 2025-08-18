// lib/email/sendContactEmail.ts

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendContactEmail({
  name,
  email,
  phone,
  service_type,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
}) {
  const msg = {
    to: 'contact@home2workcleaning.com',
    from: 'contact@home2workcleaning.com',
    subject: `New Contact Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Service Type: ${service_type}
      Message: ${message}
    `,
  };

  await sgMail.send(msg);
}
