import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    console.log("[v0] Attempting to send email to:", to)
    console.log("[v0] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables")
    }

    const { data, error } = await resend.emails.send({
      from: "Home2Work Cleaning <onboarding@resend.dev>",
      to: [to],
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
    console.error("[v0] Send email exception:", error)
    return { success: false, error }
  }
}

// Booking notification email (to business owner)
export function createBookingNotificationEmail(bookingData: any): EmailData {
  return {
    to: "contact@home2workcleaning.com",
    subject: `New Booking Request - ${bookingData.firstName} ${bookingData.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Request</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Booking Request</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #0066cc; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${bookingData.email}">${bookingData.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${bookingData.phone}">${bookingData.phone}</a></p>
            
            <h2 style="color: #0066cc; margin-top: 30px;">Service Details</h2>
            <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
            <p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
            <p><strong>Frequency:</strong> ${bookingData.frequency}</p>
            
            <h2 style="color: #0066cc; margin-top: 30px;">Property Information</h2>
            <p><strong>Address:</strong> ${bookingData.address || "Not provided"}</p>
            <p><strong>City:</strong> ${bookingData.city || "Not provided"}</p>
            <p><strong>Zip Code:</strong> ${bookingData.zipCode || "Not provided"}</p>
            <p><strong>Property Size:</strong> ${bookingData.propertySize || "Not provided"}</p>
            <p><strong>Number of Rooms:</strong> ${bookingData.rooms || "Not provided"}</p>
            
            <h2 style="color: #0066cc; margin-top: 30px;">Preferred Schedule</h2>
            <p><strong>Date:</strong> ${bookingData.preferredDate}</p>
            <p><strong>Time:</strong> ${bookingData.preferredTime}</p>
            
            ${
              bookingData.specialInstructions
                ? `
            <h2 style="color: #0066cc; margin-top: 30px;">Special Instructions</h2>
            <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #0066cc;">${bookingData.specialInstructions}</p>
            `
                : ""
            }
            
            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Action Required:</strong> Please contact the customer within 2 hours to confirm their appointment.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px;">
            <p>This is an automated notification from Home2Work Cleaning booking system.</p>
          </div>
        </body>
      </html>
    `,
  }
}

// Booking confirmation email (to customer)
export function createBookingConfirmationEmail(bookingData: any): EmailData {
  return {
    to: bookingData.email,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Booking!</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Dear ${bookingData.firstName},</p>
            
            <p>Thank you for choosing Home2Work Cleaning! We've received your booking request and will contact you within 2 hours to confirm your appointment.</p>
            
            <h2 style="color: #0066cc; margin-top: 30px;">Your Booking Details</h2>
            <div style="background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #0066cc;">
              <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
              <p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
              <p><strong>Frequency:</strong> ${bookingData.frequency}</p>
              <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
              <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #d1ecf1; border-radius: 5px; border-left: 4px solid #0c5460;">
              <p style="margin: 0;"><strong>Next Steps:</strong> Our team will review your booking and contact you shortly at ${bookingData.phone} or ${bookingData.email} to confirm the details.</p>
            </div>
            
            <p style="margin-top: 30px;">If you have any urgent questions, please don't hesitate to contact us:</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:contact@home2workcleaning.com" style="color: #0066cc;">contact@home2workcleaning.com</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:+1234567890" style="color: #0066cc;">Your Phone Number</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px;">
            <p>Home2Work Cleaning - Professional Cleaning Services You Can Trust</p>
            <p style="margin: 5px 0;">From your home to your workplace, we deliver exceptional cleaning services.</p>
          </div>
        </body>
      </html>
    `,
  }
}

// Contact notification email (to business owner)
export function createContactNotificationEmail(contactData: any): EmailData {
  return {
    to: "contact@home2workcleaning.com",
    subject: `New Contact Message - ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #28a745; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            ${contactData.phone ? `<p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>` : ""}
            ${contactData.city ? `<p><strong>City:</strong> ${contactData.city}</p>` : ""}
            ${contactData.zipCode ? `<p><strong>Zip Code:</strong> ${contactData.zipCode}</p>` : ""}
            ${contactData.serviceType ? `<p><strong>Interested In:</strong> ${contactData.serviceType}</p>` : ""}
            
            <h2 style="color: #28a745; margin-top: 30px;">Message</h2>
            <div style="background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745;">
              <p style="white-space: pre-wrap; margin: 0;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px;">
            <p>This is an automated notification from Home2Work Cleaning contact form.</p>
          </div>
        </body>
      </html>
    `,
  }
}

// Contact confirmation email (to customer)
export function createContactConfirmationEmail(contactData: any): EmailData {
  return {
    to: contactData.email,
    subject: "We Received Your Message - Home2Work Cleaning",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Dear ${contactData.firstName},</p>
            
            <p>Thank you for reaching out to Home2Work Cleaning! We've received your message and our team will get back to you within 24 hours.</p>
            
            <h2 style="color: #28a745; margin-top: 30px;">Your Message</h2>
            <div style="background-color: white; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745;">
              <p style="white-space: pre-wrap; margin: 0;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #d1ecf1; border-radius: 5px; border-left: 4px solid #0c5460;">
              <p style="margin: 0;"><strong>What's Next:</strong> Our team is reviewing your message and will respond shortly. If you have an urgent inquiry, please call us directly.</p>
            </div>
            
            <p style="margin-top: 30px;">In the meantime, feel free to explore our services or contact us:</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:contact@home2workcleaning.com" style="color: #28a745;">contact@home2workcleaning.com</a></p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:+1234567890" style="color: #28a745;">Your Phone Number</a></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px;">
            <p>Home2Work Cleaning - Professional Cleaning Services You Can Trust</p>
            <p style="margin: 5px 0;">From your home to your workplace, we deliver exceptional cleaning services.</p>
          </div>
        </body>
      </html>
    `,
  }
}
