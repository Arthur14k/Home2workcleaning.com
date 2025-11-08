import { Resend } from "resend"

// Lazy initialization - only create client when actually sending email
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error("[v0] RESEND_API_KEY is not set in environment variables")
    throw new Error("RESEND_API_KEY is not configured. Please add it to your Vercel environment variables.")
  }

  return new Resend(apiKey)
}

// Main email sending function
export async function sendEmail(params: {
  from: string
  to: string
  subject: string
  html: string
}) {
  console.log("[v0] sendEmail called with params:", {
    from: params.from,
    to: params.to,
    subject: params.subject,
  })

  try {
    const resend = getResendClient()

    const { data, error } = await resend.emails.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error("[v0] Resend API error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log("[v0] Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error in sendEmail:", error)
    throw error
  }
}

// Email template functions
export function createBookingNotificationEmail(bookingData: {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  serviceType: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  frequency: string
  preferredDate: string
  preferredTime: string
  additionalInfo?: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Booking Request</h1>
          </div>
          <div class="content">
            <p>You have received a new booking request from your website.</p>
            
            <div class="field">
              <span class="label">Customer Name:</span>
              <span class="value">${bookingData.name}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${bookingData.email}</span>
            </div>
            
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${bookingData.phone}</span>
            </div>
            
            <div class="field">
              <span class="label">Address:</span>
              <span class="value">${bookingData.address}, ${bookingData.city}, ${bookingData.postcode}</span>
            </div>
            
            <div class="field">
              <span class="label">Service Type:</span>
              <span class="value">${bookingData.serviceType}</span>
            </div>
            
            <div class="field">
              <span class="label">Property Type:</span>
              <span class="value">${bookingData.propertyType}</span>
            </div>
            
            <div class="field">
              <span class="label">Bedrooms:</span>
              <span class="value">${bookingData.bedrooms}</span>
            </div>
            
            <div class="field">
              <span class="label">Bathrooms:</span>
              <span class="value">${bookingData.bathrooms}</span>
            </div>
            
            <div class="field">
              <span class="label">Frequency:</span>
              <span class="value">${bookingData.frequency}</span>
            </div>
            
            <div class="field">
              <span class="label">Preferred Date:</span>
              <span class="value">${bookingData.preferredDate}</span>
            </div>
            
            <div class="field">
              <span class="label">Preferred Time:</span>
              <span class="value">${bookingData.preferredTime}</span>
            </div>
            
            ${
              bookingData.additionalInfo
                ? `
              <div class="field">
                <span class="label">Additional Information:</span>
                <span class="value">${bookingData.additionalInfo}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </body>
    </html>
  `
}

export function createBookingConfirmationEmail(customerName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for choosing Home2Work Cleaning! We have received your booking request and will contact you shortly to confirm the details and schedule your cleaning service.</p>
            <p>If you have any questions, please don't hesitate to reach out to us at contact@home2workcleaning.com.</p>
            <p>Best regards,<br>Home2Work Cleaning Team</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function createContactNotificationEmail(contactData: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Contact Message</h1>
          </div>
          <div class="content">
            <p>You have received a new message from your website contact form.</p>
            
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${contactData.name}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${contactData.email}</span>
            </div>
            
            ${
              contactData.phone
                ? `
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${contactData.phone}</span>
              </div>
            `
                : ""
            }
            
            <div class="field">
              <span class="label">Message:</span>
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${contactData.message}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export function createContactConfirmationEmail(customerName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Message Received</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for contacting Home2Work Cleaning! We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,<br>Home2Work Cleaning Team</p>
          </div>
        </div>
      </body>
    </html>
  `
}
