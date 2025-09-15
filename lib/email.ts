import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await sgMail.send({
    to,
    from: 'contact@home2workcleaning.com', // make sure this is verified in SendGrid
    subject,
    text,
  });
}
