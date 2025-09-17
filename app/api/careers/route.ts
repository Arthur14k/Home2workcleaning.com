import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createJobApplicationNotificationEmail, createJobApplicationConfirmationEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form data - matching the careers form fields
    const applicationData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      position: formData.get("position") as string,
      availability: formData.get("availability") as string,
      startDate: formData.get("startDate") as string,
      experience: formData.get("experience") as string,
      transportation: formData.get("transportation") as string,
      reference1: formData.get("reference1") as string,
      reference2: formData.get("reference2") as string,
      coverLetter: formData.get("coverLetter") as string,
      backgroundCheck: formData.get("backgroundCheck") as string,
    }

    // Handle file upload
    const resumeFile = formData.get("resume") as File | null
    let resumeInfo = null

    if (resumeFile && resumeFile.size > 0) {
      resumeInfo = {
        name: resumeFile.name,
        size: resumeFile.size,
        type: resumeFile.type,
      }
      // Note: In a production environment, you'd want to store this file
      // in a cloud storage service like AWS S3, Google Cloud Storage, etc.
      // For now, we'll just include the file info in the email
    }

    // Basic validation
    if (
      !applicationData.firstName ||
      !applicationData.lastName ||
      !applicationData.email ||
      !applicationData.phone ||
      !applicationData.position ||
      !applicationData.availability ||
      !applicationData.transportation ||
      !applicationData.backgroundCheck
    ) {
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    // Send notification email to business
    const businessNotification = createJobApplicationNotificationEmail(applicationData, resumeInfo)
    const businessEmailResult = await sendEmail(businessNotification)

    // Send confirmation email to applicant
    const applicantConfirmation = createJobApplicationConfirmationEmail(applicationData)
    const applicantEmailResult = await sendEmail(applicantConfirmation)

    // Log the submission
    console.log("Job application submission:", applicationData)
    console.log("Business email sent:", businessEmailResult.success)
    console.log("Applicant email sent:", applicantEmailResult.success)

    // Return success even if emails fail (but log the issues)
    if (!businessEmailResult.success) {
      console.error("Failed to send business notification email:", businessEmailResult.error)
    }

    if (!applicantEmailResult.success) {
      console.error("Failed to send applicant confirmation email:", applicantEmailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your application! We will review it and contact you within 48 hours.",
      data: applicationData,
    })
  } catch (error) {
    console.error("Job application submission error:", error)
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 },
    )
  }
}
