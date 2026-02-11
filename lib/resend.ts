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
  return {
    to: process.env.NOTIFY_TO!,
    from: process.env.NOTIFY_FROM!,
    subject: `New Booking – ${data.firstName} ${data.lastName}`,
    html: `<p>New booking received for ${data.preferredDate} at ${data.preferredTime}</p>`,
  }
}

export function createBookingConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: process.env.NOTIFY_FROM!,
    subject: "Booking request received",
    html: `<p>Thanks ${data.firstName}, we’ll confirm shortly.</p>`,
  }
}

/* ======================================================
   Contact emails
====================================================== */
export function createContactNotificationEmail(data: any) {
  return {
    to: process.env.NOTIFY_TO!,
    from: process.env.NOTIFY_FROM!,
    subject: `New contact message – ${data.firstName} ${data.lastName}`,
    html: `<p>${data.message}</p>`,
  }
}

export function createContactConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: process.env.NOTIFY_FROM!,
    subject: "We’ve received your message",
    html: `<p>Thanks ${data.firstName}, we’ll be in touch.</p>`,
  }
}