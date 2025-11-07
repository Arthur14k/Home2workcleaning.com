import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Email sending function
export async function sendEmail(emailData: {
  from: string
  to: string
  subject: string
  html: string
}) {
  try {
    console.log("[v0] Attempting to send email via Resend...")
    console.log("[v0] From:", emailData.from)
    console.log("[v0] To:", emailData.to)
    console.log("[v0] Subject:", emailData.subject)

    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] ERROR: RESEND_API_KEY is not set!")
      return {
        success: false,
        error: "RESEND_API_KEY environment variable is not configured",
      }
    }

    const data = await resend.emails.send(emailData)

    console.log("[v0] Resend API response:", data)

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error("[v0] Resend error:", error)
    return {
      success: false,
      error: error.message || "Unknown error",
    }
  }
}

// Create booking notification email (to business owner)
export function createBookingNotificationEmail(bookingData: any) {
  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Booking Request - ${bookingData.serviceType}`,
    html: `
      <h2>New Booking Request</h2>
      <p><strong>Service:</strong> ${bookingData.serviceType}</p>
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

// Create booking confirmation email (to customer)
export function createBookingConfirmationEmail(bookingData: any) {
  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: bookingData.email,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <h2>Thank You for Your Booking!</h2>
      <p>Dear ${bookingData.firstName},</p>
      <p>We have received your booking request for ${bookingData.serviceType}.</p>
      <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
      <p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
      <p>We will contact you within 2 hours to confirm your appointment.</p>
      <p>If you have any questions, please contact us at contact@home2workcleaning.com</p>
      <p>Best regards,<br>Home2Work Cleaning Team</p>
    `,
  }
}

// Create contact notification email (to business owner)
export function createContactNotificationEmail(contactData: any) {
  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Contact Message from ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone}</p>
      ${contactData.city ? `<p><strong>City:</strong> ${contactData.city}</p>` : ""}
      ${contactData.zipCode ? `<p><strong>Zip Code:</strong> ${contactData.zipCode}</p>` : ""}
      ${contactData.serviceType ? `<p><strong>Service Type:</strong> ${contactData.serviceType}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
    `,
  }
}

// Create contact confirmation email (to customer)
export function createContactConfirmationEmail(contactData: any) {
  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: contactData.email,
    subject: "We Received Your Message - Home2Work Cleaning",
    html: `
      <h2>Thank You for Contacting Us!</h2>
      <p>Dear ${contactData.firstName},</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p>Your message:</p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${contactData.message}</p>
      <p>If you need immediate assistance, please call us directly.</p>
      <p>Best regards,<br>Home2Work Cleaning Team</p>
    `,
  }
}
