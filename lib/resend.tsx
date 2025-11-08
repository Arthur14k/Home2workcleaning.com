import { Resend } from "resend"

// Lazy initialization to prevent build-time errors
let resendClient: Resend | null = null

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error("[v0] RESEND_API_KEY environment variable is not set")
    }
    console.log("[v0] Initializing Resend client")
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

interface EmailData {
  to: string
  subject: string
  html: string
  from: string
}

export async function sendEmail(emailData: EmailData) {
  try {
    console.log("[v0] Attempting to send email:", {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from,
    })

    const resend = getResendClient()

    const result = await resend.emails.send({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    console.log("[v0] Email sent successfully:", result)
    return { success: true, data: result }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    return { success: false, error: String(error) }
  }
}

export function createBookingNotificationEmail(bookingData: any): EmailData {
  console.log("[v0] Creating booking notification email")

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Booking: ${bookingData.serviceType} - ${bookingData.firstName} ${bookingData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">New Booking Request</h1>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">Service Type: ${bookingData.serviceType}</p>
          </div>

          <h2 style="color: #374151; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280; width: 40%;">Name:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${bookingData.firstName} ${bookingData.lastName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Email:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Phone:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Address:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.address || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">City:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.city || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Zip Code:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.zipCode || "N/A"}</td>
            </tr>
          </table>

          <h2 style="color: #374151; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Service Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280; width: 40%;">Cleaning Type:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${bookingData.cleaningType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Property Size:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.propertySize || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Rooms:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.rooms || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Frequency:</td>
              <td style="padding: 12px 0; color: #1f2937;">${bookingData.frequency || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Preferred Date:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${bookingData.preferredDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Preferred Time:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${bookingData.preferredTime}</td>
            </tr>
          </table>

          ${
            bookingData.specialInstructions
              ? `
            <h2 style="color: #374151; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Special Instructions</h2>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; color: #1f2937;">
              ${bookingData.specialInstructions}
            </div>
          `
              : ""
          }

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This booking was submitted via the Home2Work Cleaning website.</p>
          </div>
        </div>
      </div>
    `,
  }
}

export function createBookingConfirmationEmail(bookingData: any): EmailData {
  console.log("[v0] Creating booking confirmation email for customer")

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: bookingData.email,
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">Thank You for Your Booking!</h1>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">Hi ${bookingData.firstName},</p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">We've received your booking request and will contact you within 2 hours to confirm your appointment.</p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0;">Your Booking Details</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">Service:</td>
                <td style="padding: 8px 0; color: #1f2937;">${bookingData.serviceType} - ${bookingData.cleaningType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${bookingData.preferredDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #1e40af; font-weight: 600;">Time:</td>
                <td style="padding: 8px 0; color: #1f2937;">${bookingData.preferredTime}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <h3 style="color: #374151; font-size: 16px; margin: 0 0 10px 0;">What Happens Next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our team will review your booking request</li>
              <li style="margin-bottom: 8px;">We'll call you at ${bookingData.phone} within 2 hours</li>
              <li style="margin-bottom: 8px;">We'll confirm the details and answer any questions</li>
              <li>You'll receive a final confirmation email</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Need to make changes or have questions?</p>
            <p style="color: #1f2937; font-size: 14px; margin: 0;">Contact us at <a href="mailto:contact@home2workcleaning.com" style="color: #2563eb;">contact@home2workcleaning.com</a></p>
          </div>
        </div>
      </div>
    `,
  }
}

export function createContactNotificationEmail(contactData: any): EmailData {
  console.log("[v0] Creating contact notification email")

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: "contact@home2workcleaning.com",
    subject: `New Contact Message from ${contactData.firstName} ${contactData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">New Contact Message</h1>
          
          <h2 style="color: #374151; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280; width: 30%;">Name:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${contactData.firstName} ${contactData.lastName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Email:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Phone:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.phone || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">City:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.city || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Zip Code:</td>
              <td style="padding: 12px 0; color: #1f2937;">${contactData.zipCode || "N/A"}</td>
            </tr>
            ${
              contactData.serviceType
                ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #6b7280;">Service Interest:</td>
              <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${contactData.serviceType}</td>
            </tr>
            `
                : ""
            }
          </table>

          <h2 style="color: #374151; font-size: 18px; margin-top: 25px; margin-bottom: 15px;">Message</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; color: #1f2937; line-height: 1.6;">
            ${contactData.message}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">This message was submitted via the Home2Work Cleaning contact form.</p>
          </div>
        </div>
      </div>
    `,
  }
}

export function createContactConfirmationEmail(contactData: any): EmailData {
  console.log("[v0] Creating contact confirmation email for customer")

  return {
    from: "Home2Work Cleaning <onboarding@resend.dev>",
    to: contactData.email,
    subject: "We Received Your Message - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1f2937; margin-bottom: 10px; font-size: 24px;">Thank You for Contacting Us!</h1>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">Hi ${contactData.firstName},</p>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">We've received your message and will get back to you within 24 hours.</p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <h2 style="color: #1e40af; font-size: 18px; margin: 0 0 15px 0;">Your Message</h2>
            <p style="color: #1f2937; line-height: 1.6; margin: 0;">${contactData.message}</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 25px 0;">
            <h3 style="color: #374151; font-size: 16px; margin: 0 0 10px 0;">What Happens Next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our team will review your inquiry</li>
              <li style="margin-bottom: 8px;">We'll respond within 24 hours</li>
              <li>We'll provide you with all the information you need</li>
            </ul>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Need immediate assistance?</p>
            <p style="color: #1f2937; font-size: 14px; margin: 0;">Call us or email <a href="mailto:contact@home2workcleaning.com" style="color: #2563eb;">contact@home2workcleaning.com</a></p>
          </div>
        </div>
      </div>
    `,
  }
}
