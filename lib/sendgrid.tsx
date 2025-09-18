// SendGrid configuration and email functions
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

interface EmailData {
  to: string
  from: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData) {
  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not configured")
    return { success: false, error: "Email service not configured" }
  }

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

    if (response.ok) {
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error("SendGrid API error:", errorText)
      return { success: false, error: errorText }
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

// Booking email functions
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
              <td style="padding: 10px; font-weight: bold;">Address:</td>
              <td style="padding: 10px;">${data.address || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">City:</td>
              <td style="padding: 10px;">${data.city || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Postcode:</td>
              <td style="padding: 10px;">${data.zipCode || "Not provided"}</td>
            </tr>
          </table>
          
          <h2 style="color: #1f2937;">Service Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 10px;">${data.preferredDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Preferred Time:</td>
              <td style="padding: 10px;">${data.preferredTime}</td>
            </tr>
            ${
              data.propertySize
                ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Property Size:</td>
              <td style="padding: 10px;">${data.propertySize} sq ft</td>
            </tr>
            `
                : ""
            }
            ${
              data.rooms
                ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Rooms:</td>
              <td style="padding: 10px;">${data.rooms}</td>
            </tr>
            `
                : ""
            }
          </table>
          
          ${
            data.specialInstructions
              ? `
          <h2 style="color: #1f2937;">Special Instructions</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #7c3aed;">
            ${data.specialInstructions}
          </div>
          `
              : ""
          }
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Quick Actions:</strong><br>
              📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>
              📧 <a href="mailto:${data.email}">Email ${data.firstName}</a>
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
            <p><strong>Frequency:</strong> ${data.frequency}</p>
            <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
            <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
            ${data.address ? `<p><strong>Address:</strong> ${data.address}, ${data.city}, ${data.zipCode}</p>` : ""}
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>We'll call you within 2 hours to confirm your appointment</li>
            <li>We'll discuss any specific requirements or questions</li>
            <li>You'll receive a final confirmation with our team's arrival time</li>
            <li>Our professional team will arrive on schedule</li>
          </ol>
          
          <p>If you need to make any changes or have questions, please contact us:</p>
          <ul>
            <li>📞 <a href="tel:+447526229926">07526229926</a></li>
            <li>📧 <a href="mailto:Contact@home2workcleaning.com">Contact@home2workcleaning.com</a></li>
          </ul>
          
          <p>We look forward to providing you with exceptional cleaning service!</p>
          
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

// Contact email functions
export function createContactNotificationEmail(data: any) {
  return {
    to: "Contact@home2workcleaning.com",
    from: "Contact@home2workcleaning.com",
    subject: `New Contact Form Message - ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>💬 New Contact Message!</h1>
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
            ${
              data.phone
                ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone}</a></td>
            </tr>
            `
                : ""
            }
            ${
              data.serviceType
                ? `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Service Interest:</td>
              <td style="padding: 10px;">${data.serviceType}</td>
            </tr>
            `
                : ""
            }
          </table>
          
          <h2 style="color: #1f2937;">Message</h2>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
            ${data.message}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 5px;">
            <p style="margin: 0; color: #065f46;">
              <strong>Quick Actions:</strong><br>
              ${data.phone ? `📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>` : ""}
              📧 <a href="mailto:${data.email}">Email ${data.firstName}</a>
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
    subject: "Message Received - Home2Work Cleaning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>Message Received!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hi ${data.firstName},</p>
          
          <p>Thank you for contacting Home2Work Cleaning! We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">Your Message</h3>
            <p style="color: #065f46; font-style: italic;">"${data.message}"</p>
          </div>
          
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>📞 Call us directly at <a href="tel:+447526229926">07526229926</a></li>
            <li>📧 Email us at <a href="mailto:Contact@home2workcleaning.com">Contact@home2workcleaning.com</a></li>
            <li>🌐 Visit our website to learn more about our services</li>
          </ul>
          
          <p>We appreciate your interest in Home2Work Cleaning and look forward to serving you!</p>
          
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

// Job application email functions
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
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: #dcfce7; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #059669;">
            <h2 style="margin: 0; color: #065f46;">📋 ${data.position}</h2>
            <p style="margin: 5px 0 0 0; color: #065f46;">Availability: ${data.availability}</p>
            ${data.startDate ? `<p style="margin: 5px 0 0 0; color: #065f46;">Available from: ${data.startDate}</p>` : ""}
          </div>
          
          <h2 style="color: #1f2937;">Applicant Details</h2>
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
              <td style="padding: 10px; font-weight: bold;">Address:</td>
              <td style="padding: 10px;">${data.address || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px; font-weight: bold;">Transportation:</td>
              <td style="padding: 10px;">${data.transportation}</td>
            </tr>
          </table>
          
          ${
            data.experience
              ? `
            <h2 style="color: #1f2937;">Experience</h2>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
              ${data.experience}
            </div>
          `
              : ""
          }
          
          ${
            data.coverLetter
              ? `
            <h2 style="color: #1f2937;">Cover Letter</h2>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #7c3aed;">
              ${data.coverLetter}
            </div>
          `
              : ""
          }
          
          ${
            data.reference1 || data.reference2
              ? `
            <h2 style="color: #1f2937;">References</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${
                data.reference1
                  ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px; font-weight: bold;">Reference 1:</td>
                  <td style="padding: 10px;">${data.reference1}</td>
                </tr>
              `
                  : ""
              }
              ${
                data.reference2
                  ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px; font-weight: bold;">Reference 2:</td>
                  <td style="padding: 10px;">${data.reference2}</td>
                </tr>
              `
                  : ""
              }
            </table>
          `
              : ""
          }
          
          ${
            resumeInfo
              ? `
            <h2 style="color: #1f2937;">Resume/CV</h2>
            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>File:</strong> ${resumeInfo.name}</p>
              <p style="margin: 5px 0 0 0;"><strong>Size:</strong> ${(resumeInfo.size / 1024 / 1024).toFixed(2)} MB</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #92400e;">Note: Resume file was uploaded but not attached to this email. Please check your application system.</p>
            </div>
          `
              : ""
          }
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Quick Actions:</strong><br>
              📞 <a href="tel:${data.phone}">Call ${data.firstName}</a><br>
              📧 <a href="mailto:${data.email}">Email ${data.firstName}</a><br>
              ✅ Background check consent: ${data.backgroundCheck ? "Yes" : "No"}
            </p>
          </div>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-center; font-size: 12px;">
          Home2Work Cleaning - Job Application Notification
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
          
          <div style="background: #dcfce7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">Your Application Summary</h3>
            <p><strong>Position:</strong> ${data.position}</p>
            <p><strong>Availability:</strong> ${data.availability}</p>
            <p><strong>Transportation:</strong> ${data.transportation}</p>
            ${data.startDate ? `<p><strong>Available Start Date:</strong> ${data.startDate}</p>` : ""}
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>We'll review your application within 48 hours</li>
            <li>If your qualifications match our needs, we'll contact you for an interview</li>
            <li>Successful candidates will be invited for a final interview</li>
            <li>We'll conduct reference and background checks for selected candidates</li>
          </ol>
          
          <p>We appreciate your interest in working with Home2Work Cleaning. We're looking for dedicated team members who share our commitment to quality service and professionalism.</p>
          
          <p>If you have any questions about your application or our hiring process, please don't hesitate to contact us:</p>
          <ul>
            <li>📞 <a href="tel:+447526229926">07526229926</a></li>
            <li>📧 <a href="mailto:Contact@home2workcleaning.com">Contact@home2workcleaning.com</a></li>
          </ul>
          
          <p>Thank you again for considering Home2Work Cleaning as your next career opportunity!</p>
          
          <p>Best regards,<br>
          <strong>The Home2Work Cleaning Team</strong></p>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-center; font-size: 12px;">
          Home2Work Cleaning | Professional Cleaning Services<br>
          📞 07526229926 | 📧 Contact@home2workcleaning.com
        </div>
      </div>
    `,
  }
}
