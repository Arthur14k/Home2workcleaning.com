import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendBookingEmail({
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
    to: 'contact@home2workcleaning.com', // ✅ receiving address
    from: 'contact@home2workcleaning.com', // ✅ must match verified sender on SendGrid
    subject: 'New Booking Request',
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
