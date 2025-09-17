// lib/sendgrid.ts

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(msg: {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
}) {
  await sgMail.send(msg);
}

// ========== BOOKINGS ==========
export function createBookingNotificationEmail(data: any) {
  return {
    to: 'contact@home2workcleaning.com',
    from: 'contact@home2workcleaning.com',
    subject: 'New Booking Received',
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `,
  };
}

export function createBookingConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: 'contact@home2workcleaning.com',
    subject: 'Booking Received!',
    html: `
      <h2>Thanks for booking with Home2Work Cleaning!</h2>
      <p>Hi ${data.firstName},</p>
      <p>We’ve received your booking and will be in touch shortly.</p>
    `,
  };
}

// ========== CONTACT ==========
export function createContactNotificationEmail(data: any) {
  return {
    to: 'contact@home2workcleaning.com',
    from: 'contact@home2workcleaning.com',
    subject: 'New Contact Message',
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `,
  };
}

export function createContactConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: 'contact@home2workcleaning.com',
    subject: 'We’ve received your message!',
    html: `
      <h2>Hi ${data.firstName},</h2>
      <p>Thank you for contacting Home2Work Cleaning. We'll reply shortly.</p>
    `,
  };
}

// ========== CAREERS ==========
export function createJobApplicationNotificationEmail(data: any) {
  return {
    to: 'contact@home2workcleaning