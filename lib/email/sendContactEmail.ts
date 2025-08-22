import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendContactEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const msg = {
    to: 'contact@home2workcleaning.com',
    from: 'contact@home2workcleaning.com',
    subject: 'New Contact Form Submission',
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  await sgMail.send(msg);
}