import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (to: string, subject: string, html: string) => {
  const msg = {
    to,
    from: 'contact@home2workcleaning.com', // Must match verified sender in SendGrid
    subject,
    html,
  };

  await sgMail.send(msg);
};