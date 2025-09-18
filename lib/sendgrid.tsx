// SendGrid configuration and email functions
export async function sendEmail(emailData: {
  to: string
  from: string
  subject: string
  html: string
}) {
  console.log("🔑 Starting SendGrid email process...")

  // Get API key from environment
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  console.log("🔑 Environment check:")
  console.log("- SENDGRID_API_KEY exists:", !!SENDGRID_API_KEY)
  console.log("- SENDGRID_API_KEY length:", SENDGRID_API_KEY?.length || 0)
  console.log("- SENDGRID_API_KEY starts with SG.:", SENDGRID_API_KEY?.startsWith("SG.") || false)

  if (!SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY is missing from environment variables")
    console.error(
      "❌ Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("SENDGRID")),
    )
    return { success: false, error: "Email service not configured - missing API key" }
  }

  if (!SENDGRID_API_KEY.startsWith("SG.")) {
    console.error("❌ SENDGRID_API_KEY format is incorrect (should start with 'SG.')")
    return { success: false, error: "Email service not configured - invalid API key format" }
  }

  console.log("✅ SendGrid API key validated, sending email...")

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: emailData.to }],
            subject: emailData.subject,
          },
        ],
        from: { email: emailData.from },
        content: [
          {
            type: "text/html",
            value: emailData.html,
          },
        ],
      }),
    })

    console.log("📧 SendGrid response status:", response.status)
    console.log("📧 SendGrid response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      console.log("✅ Email sent successfully via SendGrid")
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error("❌ SendGrid API error response:", errorText)
      return { success: false, error: `SendGrid API error: ${response.status} - ${errorText}` }
    }
  } catch (error) {
    console.error("❌ Network error sending email:", error)
    return { success: false, error: `Network error: ${error}` }
  }
}

// Keep all your existing email template functions...
export function createBookingNotificationEmail(data: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Booking Request - ${data.firstName} ${data.lastName} - ${data.serviceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>🎉 New Booking Request!</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
            <h2 style="margin: 0; color: #1e40af;">📋 ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)} Service</h2>
            <p style="margin: 5px 0 0 0; color: #1e40af;">Type: ${data.cleaningType}</p>
            <p style="margin: 5px 0 0 0; color: #1e40af;">Frequency: ${data.frequency}</p>
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
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 10px;">${data.preferredDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Preferred Time:</td>
              <td style="padding: 10px;">${data.preferredTime}</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Quick Actions:</strong><br>
              📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>
              📧 <a href="mailto:${data.email}">Email ${data.firstName}</a>
            </p>
          </div>
        </div>
      </div>
    `,
  }
}

export function createBookingConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: "Contact@home2workcleaning.com",
    subject: "Booking Confirmation - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>Booking Confirmed!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for choosing Home2Work Cleaning! We've received your booking request and will contact you within 2 hours to confirm your appointment.</p>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">Your Booking Summary</h3>
            <p><strong>Service:</strong> ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}</p>
            <p><strong>Type:</strong> ${data.cleaningType}</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
          </div>
          
          <p>We look forward to providing you with exceptional cleaning service!</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
      </div>
    `,
  }
}

export function createContactNotificationEmail(data: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Contact Message - ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>💬 New Contact Message!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Contact Details</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
          
          <h2>Message</h2>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
            ${data.message}
          </div>
        </div>
      </div>
    `,
  }
}

export function createContactConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: "Contact@home2workcleaning.com",
    subject: "Message Received - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>Message Received!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for contacting Home2Work Cleaning! We've received your message and will get back to you within 24 hours.</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
      </div>
    `,
  }
}

export function createJobApplicationNotificationEmail(data: any, resumeInfo: any = null) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Job Application - ${data.firstName} ${data.lastName} - ${data.position}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>🎯 New Job Application!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Application Details</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Position:</strong> ${data.position}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
          <p><strong>Availability:</strong> ${data.availability}</p>
          
          ${
            data.coverLetter
              ? `
            <h2>Cover Letter</h2>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px;">
              ${data.coverLetter}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `,
  }
}

export function createJobApplicationConfirmationEmail(data: any) {
  return {
    to: data.email,
    from: "Contact@home2workcleaning.com",
    subject: "Application Received - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>Application Received!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for your interest in joining the Home2Work Cleaning team! We've received your application for the <strong>${data.position}</strong> position and will review it carefully.</p>
          
          <p>We'll contact you within 48 hours if your qualifications match our needs.</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
      </div>
    `,
  }
}
