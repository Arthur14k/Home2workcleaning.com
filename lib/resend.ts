{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // lib/resend.ts\
import "server-only";\
import \{ Resend \} from "resend";\
\
const API_KEY = process.env.RESEND_API_KEY || "";\
export const resend = new Resend(API_KEY);\
\
/**\
 * Send an internal notification email.\
 * Uses NOTIFY_FROM / NOTIFY_TO unless `to` is provided.\
 */\
export async function notifyEmail(opts: \{\
  subject: string;\
  html: string;\
  to?: string;\
  text?: string; // optional plain-text fallback\
\}) \{\
  const from = process.env.NOTIFY_FROM;\
  const to = opts.to || process.env.NOTIFY_TO;\
\
  if (!from || !to) \{\
    throw new Error("NOTIFY_FROM / NOTIFY_TO missing");\
  \}\
  if (!API_KEY) \{\
    throw new Error("RESEND_API_KEY is missing");\
  \}\
\
  return await resend.emails.send(\{\
    from,           // e.g. "Home2Work Cleaning <contact@home2workcleaning.com>"\
    to,\
    subject: opts.subject,\
    html: opts.html,\
    text: opts.text, // nice to include for deliverability\
  \});\
\}}