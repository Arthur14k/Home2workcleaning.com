// lib/resend.ts
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_FROM = process.env.NOTIFY_FROM;
const NOTIFY_TO = process.env.NOTIFY_TO;

let resendClient: Resend | null = null;

function getResendClient() {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }

  return resendClient;
}

export async function sendBookingEmail(opts: {
  subject: string;
  html: string;
  to?: string;
}) {
  if (!NOTIFY_FROM) {
    throw new Error("NOTIFY_FROM is missing");
  }

  const to = opts.to || NOTIFY_TO;
  if (!to) {
    throw new Error("NOTIFY_TO is missing");
  }

  const resend = getResendClient();

  return await resend.emails.send({
    from: NOTIFY_FROM,
    to,
    subject: opts.subject,
    html: opts.html,
  });
}