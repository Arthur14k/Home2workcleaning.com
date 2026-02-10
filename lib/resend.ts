// lib/resend.ts
import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing")
}

const resend = new Resend(process.env.RESEND_API_KEY)

type NotifyEmailArgs = {
  subject: string
  html: string
  to?: string
}

/**
 * Sends notification emails for bookings & contact forms
 * Used by API routes only (server-side)
 */
export async function notifyEmail({
  subject,
  html,
  to,
}: NotifyEmailArgs) {
  const from = process.env.NOTIFY_FROM
  const recipient = to || process.env.NOTIFY_TO

  if (!from) {
    throw new Error("NOTIFY_FROM is missing")
  }

  if (!recipient) {
    throw new Error("NOTIFY_TO is missing")
  }

  return await resend.emails.send({
    from,
    to: recipient,
    subject,
    html,
  })
}
