import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createJobApplicationNotificationEmail, createJobApplicationConfirmationEmail } from "@/lib/sendgrid"
import { supabase } from "@/lib/supabase"

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

    // Save to Supabase database (using your existing "applications" table)
    const { data: supabaseData, error: supabaseError } = await supabase
      .from("applications")
      .insert([
        {
          first_name: applicationData.firstName,
          last_name: applicationData.lastName,
          email: applicationData.email,
          phone: applicationData.phone,
          address: applicationData.address,
          position: applicationData.position,
          availability: applicationData.availability,
          start_date: applicationData.startDate || null,
          experience: applicationData.experience,
          transportation: applicationData.transportation,
          reference1: applicationData.reference1,
          reference2: applicationData.reference2,
          cover_letter: applicationData.coverLetter,
          background_check_consent: applicationData.backgroundCheck === "on",
          resume_filename: resumeInfo?.name || null,
          status: "pending",
        },
      ])
      .select()

    if (supabaseError) {
      console.error("Supabase application error:", supabaseError)
      // Continue with email sending even if database save fails
    } else {
      console.log("Job application saved to Supabase:", supabaseData)
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

    return NextResponse.json({
      success: true,
      message: "Thank you for your application! We will review it and contact you within 48 hours.",
      data: applicationData,
      supabaseId: supabaseData?.[0]?.id,
    })
  } catch (error) {
    console.error("Job application submission error:", error)
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again or contact us directly." },
      { status: 500 },
    )
  }
}
