import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const BUSINESS_EMAIL = "contact@home2workcleaning.com" // Where you receive notifications
const FROM_EMAIL = "Home2Work Cleaning <onboarding@resend.dev>" // Resend's default domain

interface EmailPayload {
  from: string
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload) {
  try {
    console.log("[v0] Sending email:", { to: payload.to, subject: payload.subject })

    const { data, error } = await resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return { success: false, error }
    }

    console.log("[v0] Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    return { success: false, error }
  }
}

// Booking notification email (sent to business)
export function createBookingNotificationEmail(bookingData: any): EmailPayload {
  return {
    from: FROM_EMAIL,
    to: BUSINESS_EMAIL,
    subject: `New Booking Request - ${bookingData.firstName} ${bookingData.lastName}`,
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
      <p><strong>Name:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Phone:</strong> ${bookingData.phone}</p>
      <p><strong>Address:</strong> ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}</p>
      <p><strong>Property Size:</strong> ${bookingData.propertySize}</p>
      <p><strong>Rooms:</strong> ${bookingData.rooms}</p>
      <p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
      <p><strong>Frequency:</strong> ${bookingData.frequency}</p>
      <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
      <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
      ${bookingData.specialInstructions ? `<p><strong>Special Instructions:</strong> ${bookingData.specialInstructions}</p>` : ""}
    `,
  }
}

// Booking confirmation email (sent to customer)
export function createBookingConfirmationEmail(bookingData: any): EmailPayload {
  return {
    from: FROM_EMAIL,
    to: bookingData.email,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <h2>Thank You for Your Booking!</h2>
      <p>Hi ${bookingData.firstName},</p>
      <p>We've received your booking request and will contact you within 2 hours to confirm your appointment.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Service:</strong> ${bookingData.serviceType} - ${bookingData.cleaningType}</p>
      <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
      <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
      <p><strong>Location:</strong> ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}</p>
      
      <p>If you have any questions, please contact us at ${BUSINESS_EMAIL} or call us.</p>
      
      <p>Best regards,<br>Home2Work Cleaning Team</p>
    `,
  }
}

// Contact notification email (sent to business)
export function createContactNotificationEmail(contactData: any): EmailPayload {
  return {
    from: FROM_EMAIL,
    to: BUSINESS_EMAIL,
    subject: `New Contact Message - ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone || "Not provided"}</p>
      <p><strong>City:</strong> ${contactData.city || "Not provided"}</p>
      <p><strong>Zip Code:</strong> ${contactData.zipCode || "Not provided"}</p>
      <p><strong>Service Type:</strong> ${contactData.serviceType || "Not specified"}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
    `,
  }
}

// Contact confirmation email (sent to customer)
export function createContactConfirmationEmail(contactData: any): EmailPayload {
  return {
    from: FROM_EMAIL,
    to: contactData.email,
    subject: "Message Received - Home2Work Cleaning",
    html: `
      <h2>Thank You for Contacting Us!</h2>
      <p>Hi ${contactData.firstName},</p>
      <p>We've received your message and will get back to you within 24 hours.</p>
      
      <p><strong>Your message:</strong></p>
      <p>${contactData.message}</p>
      
      <p>If you need immediate assistance, please call us directly.</p>
      
      <p>Best regards,<br>Home2Work Cleaning Team</p>
    `,
  }
}
