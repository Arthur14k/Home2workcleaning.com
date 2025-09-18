import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, createJobApplicationNotificationEmail, createJobApplicationConfirmationEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Careers API called")

    const formData = await request.formData()
    console.log("📝 Form data received")

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

    console.log("📋 Application data:", applicationData)

    // Handle file upload
    const resumeFile = formData.get("resume") as File | null
    let resumeInfo = null

    if (resumeFile && resumeFile.size > 0) {
      resumeInfo = {
        name: resumeFile.name,
        size: resumeFile.size,
        type: resumeFile.type,
      }
      console.log("📎 Resume file:", resumeInfo)
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
      console.log("❌ Validation failed")
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 })
    }

    console.log("✅ Validation passed")

    // Try Supabase save
    let supabaseResult = null
    try {
      console.log("💾 Attempting Supabase save...")

      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

        const tableName = "applications"
        console.log("📊 Using table:", tableName)

        const { data, error } = await supabase
          .from(tableName)
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

        console.log("📥 Supabase insert result:", { data, error }) // ← ✅ Added log here

        if (error) {
          console.error("❌ Supabase error:", error)
        } else {
          console.log("✅ Supabase save successful:", data)
          supabaseResult = data
        }
      } else {
        console.log("⚠️ Supabase environment variables not found, skipping database save")
      }
    } catch (supabaseError) {
      console.error("❌ Supabase connection failed:", supabaseError)
    }

    // Send emails
    console.log("📧 Sending emails...")

    try {
      const businessNotification = createJobApplicationNotificationEmail(applicationData, resumeInfo)
      const businessEmailResult = await sendEmail(businessNotification)
      console.log("📧 Business email result:", businessEmailResult)

      const applicantConfirmation = createJobApplicationConfirmationEmail(applicationData)
      const applicantEmailResult = await sendEmail(applicantConfirmation)
      console.log("📧 Applicant email result:", applicantEmailResult)

      console.log("✅ All processing complete")

      return NextResponse.json({
        success: true,
        message: "Thank you for your application! We will review it and contact you within 48 hours.",
        data: applicationData,
        supabaseId: supabaseResult?.[0]?.id || null,
        emailsSent: {
          business: businessEmailResult.success,
          customer: applicantEmailResult.success,
        },
      })
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError)
      return NextResponse.json(
        {
          success: false,
          message: "There was an issue sending confirmation emails. Please contact us directly.",
          error: emailError,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Job application submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or contact us directly.",
        error: error,
      },
      { status: 500 },
    )
  }
}
