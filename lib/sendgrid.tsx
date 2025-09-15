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
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
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
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Home2Work Cleaning | Professional Cleaning Services<br>
          📞 07526229926 | 📧 Contact@home2workcleaning.com
        </div>
      </div>
    `,
  }
}
