import sgMail from "@sendgrid/mail"

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = "info@home2workcleaning.com"
const TO_EMAIL = "info@home2workcleaning.com"

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
  console.log("[v0] SendGrid initialized successfully")
} else {
  console.error("[v0] SENDGRID_API_KEY is not configured")
}

interface EmailData {
  to: string
  from: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData) {
  if (!SENDGRID_API_KEY) {
    console.error("[v0] Cannot send email: SENDGRID_API_KEY is not configured")
    return {
      success: false,
      error: "Email service not configured",
    }
  }

  try {
    console.log("[v0] Sending email to:", emailData.to)
    await sgMail.send(emailData)
    console.log("[v0] Email sent successfully to:", emailData.to)
    return { success: true }
  } catch (error: any) {
    console.error("[v0] SendGrid error:", error.response?.body || error.message || error)
    return {
      success: false,
      error: error.response?.body || error.message || "Failed to send email",
    }
  }
}

// Booking notification email (to business)
export function createBookingNotificationEmail(bookingData: any): EmailData {
  return {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `New Booking Request - ${bookingData.serviceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Booking Request</h2>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
        <p><strong>Email:</strong> ${bookingData.email}</p>
        <p><strong>Phone:</strong> ${bookingData.phone}</p>
        
        <h3>Service Details</h3>
        <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
        <p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
        <p><strong>Frequency:</strong> ${bookingData.frequency || "One-time"}</p>
        <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
        
        <h3>Property Information</h3>
        <p><strong>Address:</strong> ${bookingData.address || "N/A"}</p>
        <p><strong>City:</strong> ${bookingData.city || "N/A"}</p>
        <p><strong>Zip Code:</strong> ${bookingData.zipCode || "N/A"}</p>
        <p><strong>Property Size:</strong> ${bookingData.propertySize || "N/A"} sq ft</p>
        <p><strong>Rooms:</strong> ${bookingData.rooms || "N/A"}</p>
        
        ${bookingData.specialInstructions ? `<h3>Special Instructions</h3><p>${bookingData.specialInstructions}</p>` : ""}
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated notification from your Home2Work Cleaning website.</p>
      </div>
    `,
  }
}

// Booking confirmation email (to customer)
export function createBookingConfirmationEmail(bookingData: any): EmailData {
  return {
    to: bookingData.email,
    from: FROM_EMAIL,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Your Booking!</h2>
        
        <p>Dear ${bookingData.firstName},</p>
        
        <p>We have received your booking request and will contact you within 2 hours to confirm your appointment.</p>
        
        <h3>Your Booking Details</h3>
        <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
        <p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
        <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
        
        <p>If you have any questions or need to make changes, please contact us:</p>
        <p>
          <strong>Phone:</strong> (555) 123-4567<br>
          <strong>Email:</strong> info@home2workcleaning.com
        </p>
        
        <p>We look forward to serving you!</p>
        
        <p>Best regards,<br>
        <strong>Home2Work Cleaning Team</strong></p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated confirmation email. Please do not reply to this email.</p>
      </div>
    `,
  }
}

// Contact notification email (to business)
export function createContactNotificationEmail(contactData: any): EmailData {
  return {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `New Contact Message from ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Message</h2>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Phone:</strong> ${contactData.phone || "Not provided"}</p>
        <p><strong>City:</strong> ${contactData.city || "Not provided"}</p>
        <p><strong>Zip Code:</strong> ${contactData.zipCode || "Not provided"}</p>
        <p><strong>Service Type:</strong> ${contactData.serviceType || "Not specified"}</p>
        
        <h3>Message</h3>
        <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${contactData.message}</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated notification from your Home2Work Cleaning website.</p>
      </div>
    `,
  }
}

// Contact confirmation email (to customer)
export function createContactConfirmationEmail(contactData: any): EmailData {
  return {
    to: contactData.email,
    from: FROM_EMAIL,
    subject: "We Received Your Message - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
        
        <p>Dear ${contactData.firstName},</p>
        
        <p>We have received your message and will get back to you within 24 hours.</p>
        
        <h3>Your Message</h3>
        <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${contactData.message}</p>
        
        <p>If you need immediate assistance, please contact us:</p>
        <p>
          <strong>Phone:</strong> (555) 123-4567<br>
          <strong>Email:</strong> info@home2workcleaning.com
        </p>
        
        <p>Best regards,<br>
        <strong>Home2Work Cleaning Team</strong></p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">This is an automated confirmation email. Please do not reply to this email.</p>
      </div>
    `,
  }
}
