import { Resend } from "resend"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Email sending function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const from = process.env.NOTIFY_FROM || "contact@home2workcleaning.com"

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return { success: false, error }
    }

    console.log("[v0] Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return { success: false, error }
  }
}

// Backwards compatibility alias
export const notifyEmail = sendEmail

// Booking notification email for business
export function createBookingNotificationEmail(booking: {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  cleaningType: string
  serviceType: string
  propertySize: string
  rooms: string
  preferredDate: string
  preferredTime: string
  frequency: string
  specialInstructions?: string
}) {
  return {
    subject: `New Booking Request - ${booking.cleaningType} Cleaning`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Booking Request</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0 0;">Home2Work Cleaning Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name:</strong></td><td style="padding: 8px 0;">${booking.firstName} ${booking.lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${booking.email}" style="color: #2d5a87;">${booking.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0;"><a href="tel:${booking.phone}" style="color: #2d5a87;">${booking.phone}</a></td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Service Location</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Address:</strong></td><td style="padding: 8px 0;">${booking.address}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>City:</strong></td><td style="padding: 8px 0;">${booking.city}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Zip Code:</strong></td><td style="padding: 8px 0;">${booking.zipCode}</td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Service Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Cleaning Type:</strong></td><td style="padding: 8px 0;"><span style="background: #e8f4f8; padding: 4px 12px; border-radius: 20px; color: #1e3a5f;">${booking.cleaningType}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Service Type:</strong></td><td style="padding: 8px 0;">${booking.serviceType}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Property Size:</strong></td><td style="padding: 8px 0;">${booking.propertySize}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Rooms:</strong></td><td style="padding: 8px 0;">${booking.rooms}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Frequency:</strong></td><td style="padding: 8px 0;">${booking.frequency}</td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Preferred Schedule</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 140px;"><strong>Date:</strong></td><td style="padding: 8px 0;"><strong style="color: #1e3a5f;">${booking.preferredDate}</strong></td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Time:</strong></td><td style="padding: 8px 0;"><strong style="color: #1e3a5f;">${booking.preferredTime}</strong></td></tr>
            </table>
          </div>

          ${
            booking.specialInstructions
              ? `
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Special Instructions</h2>
            <p style="margin: 0; color: #555; background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3a5f;">${booking.specialInstructions}</p>
          </div>
          `
              : ""
          }

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #1e3a5f; border-radius: 8px;">
            <p style="margin: 0; color: white; font-size: 14px;">Please respond to this booking request within 2 hours.</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 0;">Home2Work Cleaning Services</p>
          <p style="margin: 5px 0 0 0;">This is an automated notification from your website.</p>
        </div>
      </body>
      </html>
    `,
  }
}

// Booking confirmation email for customer
export function createBookingConfirmationEmail(booking: {
  firstName: string
  lastName: string
  cleaningType: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  address: string
  city: string
  zipCode: string
  frequency: string
}) {
  return {
    subject: `Booking Request Received - Home2Work Cleaning`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Request Received!</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0 0;">Home2Work Cleaning Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 25px;">Hi ${booking.firstName},</p>
          
          <p style="font-size: 16px; margin-bottom: 25px;">Thank you for your booking request! We've received your information and will contact you within <strong>2 hours</strong> to confirm your appointment.</p>

          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Your Booking Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; color: #666; width: 140px;"><strong>Service:</strong></td><td style="padding: 10px 0;">${booking.cleaningType} - ${booking.serviceType}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Date:</strong></td><td style="padding: 10px 0;"><strong style="color: #1e3a5f;">${booking.preferredDate}</strong></td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Time:</strong></td><td style="padding: 10px 0;"><strong style="color: #1e3a5f;">${booking.preferredTime}</strong></td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Frequency:</strong></td><td style="padding: 10px 0;">${booking.frequency}</td></tr>
              <tr><td style="padding: 10px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 10px 0;">${booking.address}, ${booking.city}, ${booking.zipCode}</td></tr>
            </table>
          </div>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1e3a5f;">
            <h3 style="color: #1e3a5f; margin-top: 0;">What Happens Next?</h3>
            <ol style="margin: 0; padding-left: 20px; color: #555;">
              <li style="margin-bottom: 8px;">Our team will review your request</li>
              <li style="margin-bottom: 8px;">We'll call or email you within 2 hours to confirm</li>
              <li style="margin-bottom: 8px;">Once confirmed, you'll receive a final confirmation</li>
              <li style="margin-bottom: 0;">Our professional team arrives on schedule!</li>
            </ol>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="margin: 0 0 10px 0; color: #666;">Questions? Contact us:</p>
            <p style="margin: 0;">
              <a href="mailto:contact@home2workcleaning.com" style="color: #2d5a87; text-decoration: none;">contact@home2workcleaning.com</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 0;">Home2Work Cleaning Services</p>
          <p style="margin: 5px 0 0 0;">Professional cleaning you can trust.</p>
        </div>
      </body>
      </html>
    `,
  }
}

// Contact notification email for business
export function createContactNotificationEmail(contact: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  return {
    subject: `New Contact Message - ${contact.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0 0;">Home2Work Cleaning Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; width: 100px;"><strong>Name:</strong></td><td style="padding: 8px 0;">${contact.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${contact.email}" style="color: #2d5a87;">${contact.email}</a></td></tr>
              ${contact.phone ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0;"><a href="tel:${contact.phone}" style="color: #2d5a87;">${contact.phone}</a></td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td><td style="padding: 8px 0;"><strong>${contact.subject}</strong></td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e3a5f; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Message</h2>
            <p style="margin: 0; color: #555; white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3a5f;">${contact.message}</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 0;">Home2Work Cleaning Services</p>
          <p style="margin: 5px 0 0 0;">This is an automated notification from your website.</p>
        </div>
      </body>
      </html>
    `,
  }
}

// Contact confirmation email for customer
export function createContactConfirmationEmail(contact: {
  name: string
  subject: string
}) {
  return {
    subject: `Message Received - Home2Work Cleaning`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Message Received!</h1>
          <p style="color: #a8d4ff; margin: 10px 0 0 0;">Home2Work Cleaning Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 25px;">Hi ${contact.name},</p>
          
          <p style="font-size: 16px; margin-bottom: 25px;">Thank you for contacting Home2Work Cleaning Services! We've received your message regarding "<strong>${contact.subject}</strong>" and will get back to you as soon as possible.</p>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #1e3a5f;">
            <p style="margin: 0; color: #555;">Our team typically responds within <strong>24 hours</strong> during business hours.</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #1e3a5f; margin-top: 0;">Business Hours</h3>
            <p style="margin: 0; color: #555;">Monday - Friday: 8:00AM - 19:00PM<br>Saturday: 9:00AM - 18:00PM<br>Sunday: Closed</p>
          </div>

          <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br><strong>The Home2Work Cleaning Team</strong></p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 0;">Home2Work Cleaning Services</p>
          <p style="margin: 5px 0 0 0;">Professional cleaning you can trust.</p>
        </div>
      </body>
      </html>
    `,
  }
}
