"use client"

import { useState } from "react"

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData(event.currentTarget)

      // Convert UK date input to ISO (YYYY-MM-DD)
      const ukDate = formData.get("preferred_date")?.toString()
      if (ukDate) {
        // already YYYY-MM-DD from <input type="date">
        formData.set("preferred_date", ukDate)
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitStatus({
          type: "error",
          message: result.message || "Booking failed. Please try again.",
        })
        return
      }

      setSubmitStatus({
        type: "success",
        message: result.message,
      })

      event.currentTarget.reset()
    } catch (error) {
      console.error("Booking submit error:", error)
      setSubmitStatus({
        type: "error",
        message: "Unable to submit booking. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* YOUR EXISTING FORM UI STAYS AS-IS */}
      {/* Just ensure input names match the API exactly */}

      {submitStatus && (
        <div
          className={
            submitStatus.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {submitStatus.message}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
      </button>
    </form>
  )
}
