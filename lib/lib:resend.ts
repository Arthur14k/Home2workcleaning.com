// lib/resend.ts
import { Resend } from "resend";

/**
 * Shared Resend client + helper for notifications.
 * This does NOT throw at import-time (avoids build crashes).
 */
const API_KEY = process.env.RESEND_API_KEY || "";
export const resend = new Resend(API_KEY);

/**
 * Sends a notification email to NOTIFY_TO (or provided `to`),
 * from NOTIFY_FROM.
 */
export async function notifyEmail(opts: {
  subject: string;
  html: string;
  to?: string;
}) {
  const from = process.env.NOTIFY_FROM;
  const to = opts.to || process.env.NOTIFY_TO;

  if (!from || !to) {
    throw new Error("NOTIFY_FROM / NOTIFY_TO missing");
  }
  if (!API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  return await resend.emails.send({
    from,
    to,
    subject: opts.subject,
    html: opts.html,
  });
}