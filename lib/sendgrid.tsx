import sgMail from "@sendgrid/mail"

// Ensure API key is set before attempting to send emails
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

if (!SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is not set. Emails will not be sent.")
  // You might want to throw an error here in a real application,
  // but for now, we'll just log and prevent sgMail from being set up.
} else {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

export interface EmailData {
  to: string
  from: string
  subject: string
  html: string
}

export async function sendEmail({ to, from, subject, html }: EmailData) {
  if (!SENDGRID_API_KEY) {
    console.error("Email not sent: SENDGRID_API_KEY is missing.")
    return { success: false, error: new Error("SendGrid API key is missing.") }
  }

  try {
    await sgMail.send({
      to,
      from,
      subject,
      html,
    })
    console.log("Email sent successfully to:", to)
    return { success: true }
  } catch (error: any) {
    console.error("SendGrid error sending email to", to, ":", error.response?.body || error.message)
    return { success: false, error: error.response?.body || error.message }
  }
}

// Email templates (unchanged, but included for context)
export function createContactNotificationEmail(data: any) {
  return {
    to: "Contact@home2workcleaning.com", // Your business email
    from: "Contact@home2workcleaning.com", // Must be verified in SendGrid
    subject: `New Contact Form Submission - ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Name:</td>
              <td style="padding: 10px;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone || "Not provided"}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Service Type:</td>
              <td style="padding: 10px;">${data.serviceType || "Not specified"}</td>
            </tr>
          </table>
          
          <h3 style="color: #1f2937; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
            ${data.message}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Quick Actions:</strong><br>
              📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>
              📧 <a href="mailto:${data.email}">Reply to ${data.email}</a>
            </p>
          </div>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Home2Work Cleaning - Contact Form Notification
        </div>
      </div>
    `,
  }
}

export function createContactConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: "Contact@home2workcleaning.com",
    subject: "Thank you for contacting Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>Thank You, ${data.firstName}!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for contacting Home2Work Cleaning! We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Your Message Summary:</h3>
            <p><strong>Service Interest:</strong> ${data.serviceType || "General inquiry"}</p>
            <p><strong>Your Message:</strong></p>
            <p style="font-style: italic;">"${data.message}"</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>📞 Call us directly at <a href="tel:+447526229926">07526229926</a></li>
            <li>📧 Email us at <a href="mailto:Contact@home2workcleaning.com">Contact@home2workcleaning.com</a></li>
            <li>🌐 Visit our website for more information about our services</li>
          </ul>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Business Hours:</strong><br>
              Monday - Friday: 8:00 AM - 6:00 PM<br>
              Saturday: 9:00 AM - 4:00 PM<br>
              Sunday: Closed
            </p>
          </div>
          
          <p>We look forward to helping you with your cleaning needs!</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Home2Work Cleaning | Professional Cleaning Services<br>
          📞 07526229926 | 📧 Contact@home2workcleaning.com
        </div>
      </div>
    `,
  }
}

export function createBookingNotificationEmail(data: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Booking Request - ${data.firstName} ${data.lastName} - ${data.preferredDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>🎉 New Booking Request!</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: #dcfce7; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #059669;">
            <h2 style="margin: 0; color: #065f46;">📅 ${data.preferredDate} at ${data.preferredTime}</h2>
            <p style="margin: 5px 0 0 0; color: #065f46;">${data.cleaningType} - ${data.serviceType}</p>
          </div>
          
          <h2 style="color: #1f2937;">Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Name:</td>
              <td style="padding: 10px;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone}</a></td>
            </tr>
          </table>
          
          <h2 style="color: #1f2937;">Service Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Service Type:</td>
              <td style="padding: 10px;">${data.serviceType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Cleaning Type:</td>
              <td style="padding: 10px;">${data.cleaningType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Frequency:</td>
              <td style="padding: 10px;">${data.frequency}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Property Size:</td>
              <td style="padding: 10px;">${data.propertySize || "Not specified"} sq ft</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Rooms:</td>
              <td style="padding: 10px;">${data.rooms || "Not specified"}</td>
            </tr>
          </table>
          
          <h2 style="color: #1f2937;">Property Address</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
            ${data.address}<br>
            ${data.city} ${data.zipCode}
          </div>
          
          ${
            data.specialInstructions
              ? `
            <h2 style="color: #1f2937;">Special Instructions</h2>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
              ${data.specialInstructions}
            </div>
          `
              : ""
          }
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Quick Actions:</strong><br>
              📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>
              📧 <a href="mailto:${data.email}">Email ${data.firstName}</a><br>
              📍 <a href="https://maps.google.com/?q=${encodeURIComponent(data.address + ", " + data.city)}">View on Map</a>
            </p>
          </div>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Home2Work Cleaning - Booking Notification
        </div>
      </div>
    `,
  }
}

export function createBookingConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: "Contact@home2workcleaning.com",
    subject: `Booking Request Received - Home2Work Cleaning`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>Booking Request Received!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for choosing Home2Work Cleaning! We've received your booking request and will contact you within 2 hours to confirm your appointment.</p>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">Your Booking Summary</h3>
            <p><strong>Service:</strong> ${data.cleaningType} (${data.serviceType})</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
            <p><strong>Frequency:</strong> ${data.frequency}</p>
            <p><strong>Address:</strong> ${data.address}, ${data.city}</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>We'll review your booking request</li>
            <li>One of our team members will call you within 2 hours</li>
            <li>We'll confirm the details and finalize your appointment</li>
            <li>You'll receive a final confirmation with our team's arrival time</li>
          </ol>
          
          <p>If you have any urgent questions, please don't hesitate to contact us:</p>
          <ul>
            <li>📞 <a href="tel:+447526229926">07526229926</a></li>
            <li>📧 <a href="mailto:Contact@home2workcleaning.com">Contact@home2workcleaning.com</a></li>
          </ul>
          
          <p>We're excited to help make your space spotless!</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Home2Work Cleaning | Professional Cleaning Services<br>
          📞 07526229926 | 📧 Contact@home2workcleaning.com
        </div>
      </div>
    `,
  }
}
