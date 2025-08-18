import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendBookingEmail = async ({
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
}) => {
  const msg = {
    to: 'contact@home2workcleaning.com', // ✅ your verified recipient
    from: 'contact@home2workcleaning.com', // ✅ must match SendGrid verified sender
    subject: `New ${service_type} booking from ${name}`,
    text: `
You have received a new booking request:

Name: ${name}
Email: ${email}
Phone: ${phone}
Service Type: ${service_type}
Message: ${message}
    `,
  };

  await sgMail.send(msg);
};