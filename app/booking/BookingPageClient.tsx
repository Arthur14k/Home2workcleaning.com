"use client"

import { useState } from "react"

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData(event.currentTarget)

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        })
        event.currentTarget.reset()
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong.",
        })
      }
    } catch (error) {
      console.error("Booking form submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {submitStatus && (
        <div
          style={{
            marginBottom: "1rem",
            color: submitStatus.type === "error" ? "red" : "green",
          }}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Service Type */}
      <input type="radio" name="serviceType" value="Residential" defaultChecked />
      <input type="radio" name="serviceType" value="Commercial" />

      {/* Contact Info */}
      <input name="firstName" required />
      <input name="lastName" required />
      <input name="email" type="email" required />
      <input name="phone" required />

      {/* Property Details */}
      <input name="address" required />
      <input name="city" required />
      <input name="postcode" required />
      <input name="propertySize" type="number" />
      <select name="rooms">
        <option value="1-2 rooms">1-2 rooms</option>
        <option value="3-4 rooms">3-4 rooms</option>
      </select>

      {/* Service Details */}
      <select name="cleaningType" required>
        <option value="Deep Cleaning">Deep Cleaning</option>
        <option value="Regular Cleaning">Regular Cleaning</option>
      </select>

      <select name="frequency">
        <option value="Weekly">Weekly</option>
        <option value="Bi-weekly">Bi-weekly</option>
      </select>

      {/* Date & Time */}
      <input type="date" name="preferredDate" required />
      <select name="preferredTime" required>
        <option value="10:00 AM - 12:00 PM">
          10:00 AM - 12:00 PM
        </option>
      </select>

      {/* Instructions */}
      <textarea name="instructions" />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
      </button>
    </form>
  )
}