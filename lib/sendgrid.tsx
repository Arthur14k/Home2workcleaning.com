// lib/sendgrid.ts

import * as sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Function to send booking confirmation email
export const sendBookingConfirmationEmail = async (to: string, bookingDetails: any) => {
  const msg = {
    to,
    from: "no-reply@example.com",
    subject: "Booking Confirmation",
    text: `Thank you for booking with us. Your booking details are: ${JSON.stringify(bookingDetails)}`,
    html: `<strong>Thank you for booking with us. Your booking details are:</strong> <pre>${JSON.stringify(bookingDetails, null, 2)}</pre>`,
  }

  try {
    await sgMail.send(msg)
    console.log("Booking confirmation email sent")
  } catch (error) {
    console.error("Error sending booking confirmation email", error)
  }
}

// Function to send contact form email
export const sendContactFormEmail = async (to: string, contactDetails: any) => {
  const msg = {
    to,
    from: "no-reply@example.com",
    subject: "Contact Form Submission",
    text: `You have received a new contact form submission: ${JSON.stringify(contactDetails)}`,
    html: `<strong>You have received a new contact form submission:</strong> <pre>${JSON.stringify(contactDetails, null, 2)}</pre>`,
  }

  try {
    await sgMail.send(msg)
    console.log("Contact form email sent")
  } catch (error) {
    console.error("Error sending contact form email", error)
  }
}

// /** rest of code here **/
