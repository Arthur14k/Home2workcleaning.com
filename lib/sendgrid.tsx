import sgMail from "@sendgrid/mail"

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is not configured")
  throw new Error("SENDGRID_API_KEY is required")
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Generic email sending function
export async function sendEmail(emailData: {
  to: string
  from: string
  subject: string
  text: string
  html: string
}) {
  try {
    console.log("📧 Sending email to:", emailData.to)
    await sgMail.send(emailData)
    console.log("✅ Email sent successfully")
    return { success: true }
  } catch (error) {
    console.error("❌ SendGrid error:", error)
    return { success: false, error }
  }
}

// Booking notification email (to business)
export function createBookingNotificationEmail(bookingData: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Booking Request - ${bookingData.firstName} ${bookingData.lastName}`,
    text: `
New booking request received:

Customer: ${bookingData.firstName} ${bookingData.lastName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Service Type: ${bookingData.serviceType}
Cleaning Type: ${bookingData.cleaningType}
Preferred Date: ${bookingData.preferredDate}
Preferred Time: ${bookingData.preferredTime}
Address: ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}
Property Size: ${bookingData.propertySize}
Rooms: ${bookingData.rooms}
Frequency: ${bookingData.frequency}
Special Instructions: ${bookingData.specialInstructions || "None"}
    `,
    html: `
<h2>New Booking Request</h2>
<p><strong>Customer:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
<p><strong>Email:</strong> ${bookingData.email}</p>
<p><strong>Phone:</strong> ${bookingData.phone}</p>
<p><strong>Service Type:</strong> ${bookingData.serviceType}</p>
<p><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</p>
<p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
<p><strong>Preferred Time:</strong> ${bookingData.preferredTime}</p>
<p><strong>Address:</strong> ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}</p>
<p><strong>Property Size:</strong> ${bookingData.propertySize}</p>
<p><strong>Rooms:</strong> ${bookingData.rooms}</p>
<p><strong>Frequency:</strong> ${bookingData.frequency}</p>
<p><strong>Special Instructions:</strong> ${bookingData.specialInstructions || "None"}</p>
    `,
  }
}

// Booking confirmation email (to customer)
export function createBookingConfirmationEmail(bookingData: any) {
  return {
    to: bookingData.email,
    from: "Contact@home2workcleaning.com",
    subject: "Booking Confirmation - Home2Work Cleaning",
    text: `
Dear ${bookingData.firstName},

Thank you for choosing Home2Work Cleaning! We have received your booking request and will contact you within 2 hours to confirm your appointment.

Booking Details:
- Service Type: ${bookingData.serviceType}
- Cleaning Type: ${bookingData.cleaningType}
- Preferred Date: ${bookingData.preferredDate}
- Preferred Time: ${bookingData.preferredTime}
- Address: ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}

If you have any questions, please contact us at:
Phone: 07526229926
Email: Contact@home2workcleaning.com

Best regards,
Home2Work Cleaning Team
    `,
    html: `
<h2>Booking Confirmation</h2>
<p>Dear ${bookingData.firstName},</p>
<p>Thank you for choosing Home2Work Cleaning! We have received your booking request and will contact you within 2 hours to confirm your appointment.</p>

<h3>Booking Details:</h3>
<ul>
  <li><strong>Service Type:</strong> ${bookingData.serviceType}</li>
  <li><strong>Cleaning Type:</strong> ${bookingData.cleaningType}</li>
  <li><strong>Preferred Date:</strong> ${bookingData.preferredDate}</li>
  <li><strong>Preferred Time:</strong> ${bookingData.preferredTime}</li>
  <li><strong>Address:</strong> ${bookingData.address}, ${bookingData.city}, ${bookingData.zipCode}</li>
</ul>

<p>If you have any questions, please contact us at:</p>
<p><strong>Phone:</strong> 07526229926<br>
<strong>Email:</strong> Contact@home2workcleaning.com</p>

<p>Best regards,<br>
Home2Work Cleaning Team</p>
    `,
  }
}

// Contact notification email (to business)
export function createContactNotificationEmail(contactData: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Contact Message - ${contactData.firstName} ${contactData.lastName}`,
    text: `
New contact message received:

Name: ${contactData.firstName} ${contactData.lastName}
Email: ${contactData.email}
Phone: ${contactData.phone || "Not provided"}
City: ${contactData.city}
Postcode: ${contactData.zipCode}
Service Type: ${contactData.serviceType || "Not specified"}

Message:
${contactData.message}
    `,
    html: `
<h2>New Contact Message</h2>
<p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
<p><strong>Email:</strong> ${contactData.email}</p>
<p><strong>Phone:</strong> ${contactData.phone || "Not provided"}</p>
<p><strong>City:</strong> ${contactData.city}</p>
<p><strong>Postcode:</strong> ${contactData.zipCode}</p>
<p><strong>Service Type:</strong> ${contactData.serviceType || "Not specified"}</p>

<h3>Message:</h3>
<p>${contactData.message}</p>
    `,
  }
}

// Contact confirmation email (to customer)
export function createContactConfirmationEmail(contactData: any) {
  return {
    to: contactData.email,
    from: "Contact@home2workcleaning.com",
    subject: "Message Received - Home2Work Cleaning",
    text: `
Dear ${contactData.firstName},

Thank you for contacting Home2Work Cleaning! We have received your message and will get back to you within 24 hours.

Your Message:
${contactData.message}

If you need immediate assistance, please contact us at:
Phone: 07526229926
Email: Contact@home2workcleaning.com

Best regards,
Home2Work Cleaning Team
    `,
    html: `
<h2>Message Received</h2>
<p>Dear ${contactData.firstName},</p>
<p>Thank you for contacting Home2Work Cleaning! We have received your message and will get back to you within 24 hours.</p>

<h3>Your Message:</h3>
<p>${contactData.message}</p>

<p>If you need immediate assistance, please contact us at:</p>
<p><strong>Phone:</strong> 07526229926<br>
<strong>Email:</strong> Contact@home2workcleaning.com</p>

<p>Best regards,<br>
Home2Work Cleaning Team</p>
    `,
  }
}
