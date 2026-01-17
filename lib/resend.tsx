import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[v0] Sending email to:", options.to)
    console.log("[v0] Subject:", options.subject)
    console.log("[v0] RESEND_API_KEY present:", !!process.env.RESEND_API_KEY)
    console.log("[v0] NOTIFY_FROM:", process.env.NOTIFY_FROM)

    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_FROM || "Home2Work Cleaning <contact@home2workcleaning.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return { success: false, error: error.message }
    }

    console.log("[v0] Email sent successfully:", data)
    return { success: true }
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

interface BookingData {
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
}

interface ContactData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  city?: string
  zipCode?: string
  serviceType?: string
  message: string
}

export function createBookingNotificationEmail(data: BookingData): EmailOptions {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Request</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0ea5e9; margin-top: 0;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${data.phone}">${data.phone}</a></td>
          </tr>
          ${data.address ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Address:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.address}</td></tr>` : ""}
          ${data.city ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>City:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.city}</td></tr>` : ""}
          ${data.zipCode ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Postcode:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.zipCode}</td></tr>` : ""}
        </table>
        
        <h2 style="color: #0ea5e9; margin-top: 30px;">Service Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Service Type:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Cleaning Type:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.cleaningType}</td>
          </tr>
          ${data.propertySize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Property Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.propertySize}</td></tr>` : ""}
          ${data.rooms ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Rooms:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.rooms}</td></tr>` : ""}
          ${data.frequency ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Frequency:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.frequency}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Date:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.preferredDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Preferred Time:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.preferredTime}</td>
          </tr>
        </table>
        
        ${
          data.specialInstructions
            ? `
        <h2 style="color: #0ea5e9; margin-top: 30px;">Special Instructions</h2>
        <p style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #e2e8f0;">${data.specialInstructions}</p>
        `
            : ""
        }
        
        <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;"><strong>Action Required:</strong> Please contact the customer within 2 hours to confirm the appointment.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    to: process.env.NOTIFY_TO || "contact@home2workcleaning.com",
    subject: `New Booking Request - ${data.firstName} ${data.lastName} - ${data.cleaningType}`,
    html,
  }
}

export function createBookingConfirmationEmail(data: BookingData): EmailOptions {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Request Received</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Home2Work Cleaning</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi ${data.firstName},</p>
        
        <p>Thank you for choosing Home2Work Cleaning! We've received your booking request and will contact you within <strong>2 hours</strong> to confirm your appointment.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <h2 style="color: #0ea5e9; margin-top: 0; font-size: 18px;">Your Booking Summary</h2>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0;"><strong>Service:</strong></td>
              <td style="padding: 8px 0;">${data.cleaningType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Date:</strong></td>
              <td style="padding: 8px 0;">${data.preferredDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Time:</strong></td>
              <td style="padding: 8px 0;">${data.preferredTime}</td>
            </tr>
            ${data.frequency ? `<tr><td style="padding: 8px 0;"><strong>Frequency:</strong></td><td style="padding: 8px 0;">${data.frequency}</td></tr>` : ""}
          </table>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <h3 style="color: #065f46; margin-top: 0;">What happens next?</h3>
          <ol style="color: #065f46; margin-bottom: 0;">
            <li>Our team will review your request</li>
            <li>We'll contact you within 2 hours to confirm</li>
            <li>You'll receive a final confirmation with all details</li>
            <li>Our professional cleaners will arrive as scheduled</li>
          </ol>
        </div>
        
        <p>If you have any urgent questions, please don't hesitate to contact us:</p>
        <p>
          <strong>Phone:</strong> <a href="tel:+353838776868">+353 83 877 6868</a><br>
          <strong>Email:</strong> <a href="mailto:contact@home2workcleaning.com">contact@home2workcleaning.com</a>
        </p>
        
        <p>Thank you for trusting Home2Work Cleaning!</p>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong>
        </p>
      </div>
    </body>
    </html>
  `

  return {
    to: data.email,
    subject: "Booking Request Received - Home2Work Cleaning",
    html,
  }
}

export function createContactNotificationEmail(data: ContactData): EmailOptions {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Message</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0ea5e9; margin-top: 0;">Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Name:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ""}
          ${data.city ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>City:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.city}</td></tr>` : ""}
          ${data.zipCode ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Postcode:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.zipCode}</td></tr>` : ""}
          ${data.serviceType ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Service Interest:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${data.serviceType}</td></tr>` : ""}
        </table>
        
        <h2 style="color: #0ea5e9; margin-top: 30px;">Message</h2>
        <div style="background: white; padding: 20px; border-radius: 5px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 5px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return {
    to: process.env.NOTIFY_TO || "contact@home2workcleaning.com",
    subject: `New Contact Message - ${data.firstName} ${data.lastName}`,
    html,
  }
}

export function createContactConfirmationEmail(data: ContactData): EmailOptions {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Message Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Message Received</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Home2Work Cleaning</p>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hi ${data.firstName},</p>
        
        <p>Thank you for reaching out to Home2Work Cleaning! We've received your message and will get back to you within <strong>24 hours</strong>.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
          <h3 style="color: #0ea5e9; margin-top: 0;">Your Message</h3>
          <p style="margin-bottom: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <p>If you need immediate assistance, please contact us directly:</p>
        <p>
          <strong>Phone:</strong> <a href="tel:+353838776868">+353 83 877 6868</a><br>
          <strong>Email:</strong> <a href="mailto:contact@home2workcleaning.com">contact@home2workcleaning.com</a>
        </p>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong>
        </p>
      </div>
    </body>
    </html>
  `

  return {
    to: data.email,
    subject: "We've Received Your Message - Home2Work Cleaning",
    html,
  }
}
