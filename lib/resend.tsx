// lib/resend.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/* ======================================================
   Core email sender
====================================================== */
export interface EmailData {
  to: string
  from: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  from,
  subject,
  html,
}: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing")
  }

  const { data, error } = await resend.emails.send({
    to,
    from,
    subject,
    html,
  })

  if (error) {
    console.error("[Resend] API error:", error)
    throw error
  }

  return data
}

/* ======================================================
   Simple notifier (used by booking API)
====================================================== */
export async function notifyEmail(opts: {
  subject: string
  html: string
  to?: string
}) {
  const from = process.env.NOTIFY_FROM
  const to = opts.to || process.env.NOTIFY_TO

  if (!from || !to) {
    throw new Error("NOTIFY_FROM / NOTIFY_TO missing")
  }

  return sendEmail({
    from,
    to,
    subject: opts.subject,
    html: opts.html,
  })
}

/* ======================================================
   Booking emails
====================================================== */
export function createBookingNotificationEmail(data: any) {
  const specialInstructionsHtml = data.specialInstructions 
    ? `<h3 style="color: #374151; margin-top: 20px;">Special Instructions</h3>
       <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${data.specialInstructions}</p>`
    : ''

  return {
    to: process.env.NOTIFY_TO!,
    from: process.env.NOTIFY_FROM!,
    subject: `New Booking – ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Booking Request</h2>
        
        <h3 style="color: #374151; margin-top: 20px;">Client Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        </table>

        <h3 style="color: #374151; margin-top: 20px;">Property Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Address:</td><td style="padding: 8px 0;">${data.address}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">City:</td><td style="padding: 8px 0;">${data.city}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Postcode:</td><td style="padding: 8px 0;">${data.zipCode || data.postcode || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Property Size:</td><td style="padding: 8px 0;">${data.propertySize ? data.propertySize + ' sq ft' : 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Rooms:</td><td style="padding: 8px 0;">${data.rooms}</td></tr>
        </table>

        <h3 style="color: #374151; margin-top: 20px;">Service Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Service Type:</td><td style="padding: 8px 0; font-weight: 600;">${data.serviceType}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Cleaning Type:</td><td style="padding: 8px 0; font-weight: 600;">${data.cleaningType}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Frequency:</td><td style="padding: 8px 0;">${data.frequency}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Preferred Date:</td><td style="padding: 8px 0; font-weight: 600;">${data.preferredDate}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Preferred Time:</td><td style="padding: 8px 0; font-weight: 600;">${data.preferredTime}</td></tr>
        </table>

        ${specialInstructionsHtml}

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          This booking was submitted via Home2Work Cleaning website.
        </p>
      </div>
    `,
  }
}

export function createBookingConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: process.env.NOTIFY_FROM!,
    subject: "Your Booking Request - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Your Booking!</h2>
        
        <p>Hi ${data.firstName},</p>
        
        <p>We have received your cleaning service request and will confirm your appointment shortly.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Booking Summary</h3>
          <p><strong>Service:</strong> ${data.serviceType} - ${data.cleaningType}</p>
          <p><strong>Date:</strong> ${data.preferredDate}</p>
          <p><strong>Time:</strong> ${data.preferredTime}</p>
          <p><strong>Address:</strong> ${data.address}, ${data.city}, ${data.zipCode || data.postcode || ''}</p>
        </div>

        <p>If you have any questions, please do not hesitate to contact us.</p>

        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Home2Work Cleaning Team</strong>
        </p>
      </div>
    `,
  }
}

/* ======================================================
   Contact emails
====================================================== */
export function createContactNotificationEmail(data: any) {
  return {
    to: process.env.NOTIFY_TO!,
    from: process.env.NOTIFY_FROM!,
    subject: `New Contact Message – ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Message</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Phone:</td><td style="padding: 8px 0;">${data.phone || 'Not provided'}</td></tr>
        </table>

        <h3 style="color: #374151; margin-top: 20px;">Message</h3>
        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${data.message}</p>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          This message was submitted via Home2Work Cleaning website.
        </p>
      </div>
    `,
  }
}

export function createContactConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: process.env.NOTIFY_FROM!,
    subject: "We have received your message - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
        
        <p>Hi ${data.firstName},</p>
        
        <p>We have received your message and will get back to you as soon as possible.</p>

        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Home2Work Cleaning Team</strong>
        </p>
      </div>
    `,
  }
}
