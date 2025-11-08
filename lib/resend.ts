// lib/resend.ts
import { Resend } from "resend";

let client: Resend | null = null;

export function getResend() {
  if (client) return client;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing in environment");
  }

  client = new Resend(apiKey);
  return client;
}
