import { Resend } from "resend"

// Email configuration
const BUSINESS_EMAIL = "contact@home2workcleaning.com"
const FROM_EMAIL = "Home2Work Cleaning <onboarding@resend.dev>"

// Lazy-load Resend client to avoid build-time errors
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

// Email sending function
export async function sendEmail(emailData: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    console.log("[v0] Sending email to:", emailData.to)
    console.log("[v0] Subject:", emailData.subject)

    const resend = getResendClient()

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    console.log("[v0] Email sent successfully:", result)

    return {
      success: true,
      id: result.data?.id,
    }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Booking notification email (to business)
export function createBookingNotificationEmail(bookingData: {
  serviceType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  zipCode?: string
  propertySize?: string
  rooms?: string
  cleaningType: string
  frequency?: string
  preferredDate: string
  preferredTime: string
  specialInstructions?: string
}): { to: string; subject: string; html: string } {
  return {
    to: BUSINESS_EMAIL,
    subject: `New ${bookingData.serviceType} Booking Request`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #059669; }
            .value { margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Request</h1>
            </div>
            <div class="content">
              <div class="field"><span class="label">Service Type:</span><span class="value">${bookingData.serviceType}</span></div>
              <div class="field"><span class="label">Name:</span><span class="value">${bookingData.firstName} ${bookingData.lastName}</span></div>
              <div class="field"><span class="label">Email:</span><span class="value">${bookingData.email}</span></div>
              <div class="field"><span class="label">Phone:</span><span class="value">${bookingData.phone}</span></div>
              ${bookingData.address ? `<div class="field"><span class="label">Address:</span><span class="value">${bookingData.address}</span></div>` : ""}
              ${bookingData.city ? `<div class="field"><span class="label">City:</span><span class="value">${bookingData.city}</span></div>` : ""}
              ${bookingData.zipCode ? `<div class="field"><span class="label">Zip Code:</span><span class="value">${bookingData.zipCode}</span></div>` : ""}
              ${bookingData.propertySize ? `<div class="field"><span class="label">Property Size:</span><span class="value">${bookingData.propertySize}</span></div>` : ""}
              ${bookingData.rooms ? `<div class="field"><span class="label">Rooms:</span><span class="value">${bookingData.rooms}</span></div>` : ""}
              <div class="field"><span class="label">Cleaning Type:</span><span class="value">${bookingData.cleaningType}</span></div>
              ${bookingData.frequency ? `<div class="field"><span class="label">Frequency:</span><span class="value">${bookingData.frequency}</span></div>` : ""}
              <div class="field"><span class="label">Preferred Date:</span><span class="value">${bookingData.preferredDate}</span></div>
              <div class="field"><span class="label">Preferred Time:</span><span class="value">${bookingData.preferredTime}</span></div>
              ${bookingData.specialInstructions ? `<div class="field"><span class="label">Special Instructions:</span><span class="value">${bookingData.specialInstructions}</span></div>` : ""}
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// Booking confirmation email (to customer)
export function createBookingConfirmationEmail(bookingData: {
  firstName: string
  lastName: string
  email: string
  preferredDate: string
  preferredTime: string
  serviceType: string
}): { to: string; subject: string; html: string } {
  return {
    to: bookingData.email,
    subject: "Booking Request Received - Home2Work Cleaning",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${bookingData.firstName} ${bookingData.lastName},</p>
              <p>Thank you for choosing Home2Work Cleaning! We have received your ${bookingData.serviceType} booking request for ${bookingData.preferredDate} at ${bookingData.preferredTime}.</p>
              <p>Our team will contact you within 2 hours to confirm your appointment and answer any questions you may have.</p>
              <p>If you need immediate assistance, please call us or reply to this email.</p>
              <p>Best regards,<br>The Home2Work Cleaning Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// Contact notification email (to business)
export function createContactNotificationEmail(contactData: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  city?: string
  zipCode?: string
  serviceType?: string
  message: string
}): { to: string; subject: string; html: string } {
  return {
    to: BUSINESS_EMAIL,
    subject: `New Contact Form Message from ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #059669; }
            .value { margin-left: 10px; }
            .message { background: white; padding: 15px; border-left: 4px solid #059669; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Message</h1>
            </div>
            <div class="content">
              <div class="field"><span class="label">Name:</span><span class="value">${contactData.firstName} ${contactData.lastName}</span></div>
              <div class="field"><span class="label">Email:</span><span class="value">${contactData.email}</span></div>
              ${contactData.phone ? `<div class="field"><span class="label">Phone:</span><span class="value">${contactData.phone}</span></div>` : ""}
              ${contactData.city ? `<div class="field"><span class="label">City:</span><span class="value">${contactData.city}</span></div>` : ""}
              ${contactData.zipCode ? `<div class="field"><span class="label">Zip Code:</span><span class="value">${contactData.zipCode}</span></div>` : ""}
              ${contactData.serviceType ? `<div class="field"><span class="label">Service Interest:</span><span class="value">${contactData.serviceType}</span></div>` : ""}
              <div class="message">
                <strong>Message:</strong><br>
                ${contactData.message}
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}

// Contact confirmation email (to customer)
export function createContactConfirmationEmail(contactData: {
  firstName: string
  lastName: string
  email: string
}): { to: string; subject: string; html: string } {
  return {
    to: contactData.email,
    subject: "Message Received - Home2Work Cleaning",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 5px; }
            .content { background: #f9fafb; padding: 20px; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Message Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${contactData.firstName} ${contactData.lastName},</p>
              <p>Thank you for contacting Home2Work Cleaning! We have received your message and will respond within 24 hours.</p>
              <p>In the meantime, if you have any urgent questions, please feel free to call us directly.</p>
              <p>Best regards,<br>The Home2Work Cleaning Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }
}
