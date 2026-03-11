"use client"

import { useState } from "react"

export default function BookingPageClient() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
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
      console.error("Booking submission error:", error)

      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {submitStatus.type === "error" && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          {submitStatus.message}
        </div>
      )}

      {submitStatus.type === "success" && (
        <div className="mb-6 p-4 border border-green-300 bg-green-50 text-green-700 rounded">
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SERVICE TYPE */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Service Type *</h2>

          <label className="mr-6">
            <input
              type="radio"
              name="service_type"
              value="Residential"
              required
              className="mr-2"
            />
            Residential
          </label>

          <label>
            <input
              type="radio"
              name="service_type"
              value="Commercial"
              required
              className="mr-2"
            />
            Commercial
          </label>
        </div>

        {/* CONTACT INFO */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="first_name"
            placeholder="First Name *"
            required
            className="border p-3 rounded"
          />

          <input
            name="last_name"
            placeholder="Last Name *"
            required
            className="border p-3 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email *"
            required
            className="border p-3 rounded"
          />

          <input
            name="phone"
            placeholder="Phone *"
            required
            className="border p-3 rounded"
          />

        </div>

        {/* ADDRESS */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="address"
            placeholder="Address *"
            required
            className="border p-3 rounded"
          />

          <input
            name="city"
            placeholder="City *"
            required
            className="border p-3 rounded"
          />

          <input
            name="postcode"
            placeholder="Postcode *"
            required
            className="border p-3 rounded"
          />

          <input
            name="property_size"
            type="number"
            placeholder="Property size (sq ft)"
            className="border p-3 rounded"
          />

        </div>

        {/* PROPERTY DETAILS */}
        <div>

          <select
            name="rooms"
            required
            className="border p-3 rounded w-full"
          >
            <option value="">Number of rooms *</option>
            <option>1-2 rooms</option>
            <option>3-4 rooms</option>
            <option>5+ rooms</option>
          </select>

        </div>

        {/* CLEANING DETAILS */}
        <div className="grid md:grid-cols-2 gap-4">

          <select
            name="cleaning_type"
            required
            className="border p-3 rounded"
          >
            <option value="">Cleaning type *</option>
            <option>Standard Cleaning</option>
            <option>Deep Cleaning</option>
            <option>End of Tenancy</option>
          </select>

          <select
            name="frequency"
            required
            className="border p-3 rounded"
          >
            <option value="">Frequency *</option>
            <option>One-off</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>

        </div>

        {/* DATE + TIME */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="date"
            name="preferred_date"
            required
            className="border p-3 rounded"
          />

          <select
            name="preferred_time"
            required
            className="border p-3 rounded"
          >
            <option value="">Preferred time *</option>

            <option value="8:00 AM - 10:00 AM">
              8:00 AM - 10:00 AM
            </option>

            <option value="10:00 AM - 12:00 PM">
              10:00 AM - 12:00 PM
            </option>

            <option value="12:00 PM - 2:00 PM">
              12:00 PM - 2:00 PM
            </option>

            <option value="2:00 PM - 4:00 PM">
              2:00 PM - 4:00 PM
            </option>

            <option value="4:00 PM - 6:00 PM">
              4:00 PM - 6:00 PM
            </option>

          </select>

        </div>

        {/* NOTES */}
        <div>
          <textarea
            name="special_instructions"
            placeholder="Special instructions (optional)"
            rows={4}
            className="border p-3 rounded w-full"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
        </button>

      </form>
    </div>
  )
}
