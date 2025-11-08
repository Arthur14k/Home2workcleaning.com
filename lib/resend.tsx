import { Resend } from "resend"

// Initialize Resend client lazily to avoid build-time errors
let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

// Email sending function with proper error handling
export async function sendEmail(emailData: {
  from: string
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  console.log("[v0] Sending email via Resend...")
  console.log("[v0] Email details:", { from: emailData.from, to: emailData.to, subject: emailData.subject })

  try {
    const resend = getResendClient()
    const result = await resend.emails.send(emailData)

    console.log("[v0] Resend API response:", result)

    if (result.error) {
      console.error("[v0] Resend error:", result.error)
      return { success: false, error: result.error }
    }

    console.log("[v0] Email sent successfully, ID:", result.data?.id)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return { success: false, error: error }
  }
}

// Create booking notification email to business
export function createBookingNotificationEmail(bookingData: any) {
  console.log("[v0] Creating booking notification email")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .detail-row { margin: 10px 0; padding: 10px; background-color: white; border-left: 3px solid #2563eb; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Request</h1>
          </div>
          <div class="content">
            <h2>Customer Details</h2>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${bookingData.firstName} ${bookingData.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${bookingData.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${bookingData.phone}</span>
            </div>
            
            <h2>Service Details</h2>
            <div class="detail-row">
              <span class="label">Service Type:</span>
              <span class="value">${bookingData.serviceType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Cleaning Type:</span>
              <span class="value">${bookingData.cleaningType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Frequency:</span>
              <span class="value">${bookingData.frequency || "One-time"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Property Size:</span>
              <span class="value">${bookingData.propertySize || "Not specified"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Rooms:</span>
              <span class="value">${bookingData.rooms || "Not specified"}</span>
            </div>
            
            <h2>Location</h2>
            <div class="detail-row">
              <span class="label">Address:</span>
              <span class="value">${bookingData.address || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <span class="label">City:</span>
              <span class="value">${bookingData.city || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Zip Code:</span>
              <span class="value">${bookingData.zipCode || "Not provided"}</span>
            </div>
            
            <h2>Schedule</h2>
            <div class="detail-row">
              <span class="label">Preferred Date:</span>
              <span class="value">${bookingData.preferredDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Preferred Time:</span>
              <span class="value">${bookingData.preferredTime}</span>
            </div>
            
            ${
              bookingData.specialInstructions
                ? `
            <h2>Special Instructions</h2>
            <div class="detail-row">
              <span class="value">${bookingData.specialInstructions}</span>
            </div>
            `
                : ""
            }
          </div>
          <div class="footer">
            <p>Home2Work Cleaning - New Booking Notification</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Booking: ${bookingData.firstName} ${bookingData.lastName} - ${bookingData.preferredDate}`,
    html: html,
    replyTo: bookingData.email,
  }
}

// Create booking confirmation email to customer
export function createBookingConfirmationEmail(bookingData: any) {
  console.log("[v0] Creating booking confirmation email")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .highlight { background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #1f2937; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${bookingData.firstName},</p>
            
            <p>Thank you for choosing Home2Work Cleaning! We have received your booking request.</p>
            
            <div class="highlight">
              <p><strong>We will contact you within 2 hours to confirm your appointment.</strong></p>
            </div>
            
            <h2>Your Booking Details</h2>
            <div class="detail-row">
              <span class="label">Service:</span> ${bookingData.serviceType} - ${bookingData.cleaningType}
            </div>
            <div class="detail-row">
              <span class="label">Preferred Date:</span> ${bookingData.preferredDate}
            </div>
            <div class="detail-row">
              <span class="label">Preferred Time:</span> ${bookingData.preferredTime}
            </div>
            
            <p style="margin-top: 20px;">If you have any questions, please don't hesitate to contact us:</p>
            <p>
              Email: contact@home2workcleaning.com<br>
              Phone: ${bookingData.phone}
            </p>
          </div>
          <div class="footer">
            <p>Home2Work Cleaning - Professional Cleaning Services</p>
            <p>www.home2workcleaning.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: bookingData.email,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: html,
    replyTo: "contact@home2workcleaning.com",
  }
}

// Create contact notification email to business
export function createContactNotificationEmail(contactData: any) {
  console.log("[v0] Creating contact notification email")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #8b5cf6; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .detail-row { margin: 10px 0; padding: 10px; background-color: white; border-left: 3px solid #8b5cf6; }
          .label { font-weight: bold; color: #1f2937; }
          .value { color: #4b5563; }
          .message-box { background-color: white; padding: 15px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Message</h1>
          </div>
          <div class="content">
            <h2>Contact Details</h2>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${contactData.firstName} ${contactData.lastName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${contactData.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${contactData.phone || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <span class="label">City:</span>
              <span class="value">${contactData.city || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service Interest:</span>
              <span class="value">${contactData.serviceType || "General Inquiry"}</span>
            </div>
            
            <h2>Message</h2>
            <div class="message-box">
              <p>${contactData.message}</p>
            </div>
          </div>
          <div class="footer">
            <p>Home2Work Cleaning - Contact Form Submission</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Contact: ${contactData.firstName} ${contactData.lastName}`,
    html: html,
    replyTo: contactData.email,
  }
}

// Create contact confirmation email to customer
export function createContactConfirmationEmail(contactData: any) {
  console.log("[v0] Creating contact confirmation email")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .highlight { background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message Received!</h1>
          </div>
          <div class="content">
            <p>Dear ${contactData.firstName},</p>
            
            <p>Thank you for contacting Home2Work Cleaning! We have received your message.</p>
            
            <div class="highlight">
              <p><strong>We will get back to you within 24 hours.</strong></p>
            </div>
            
            <p>If you need immediate assistance, please feel free to call us.</p>
            
            <p style="margin-top: 20px;">
              Email: contact@home2workcleaning.com
            </p>
          </div>
          <div class="footer">
            <p>Home2Work Cleaning - Professional Cleaning Services</p>
            <p>www.home2workcleaning.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: contactData.email,
    subject: "We received your message - Home2Work Cleaning",
    html: html,
    replyTo: "contact@home2workcleaning.com",
  }
}
