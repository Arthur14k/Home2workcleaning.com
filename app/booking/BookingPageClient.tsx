"use client"

import { useState } from "react"

type SubmitStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

      // 🔑 Convert UK date display → ISO (YYYY-MM-DD)
      const ukDate = formData.get("preferred_date")?.toString()
      if (ukDate && ukDate.includes("/")) {
        const [dd, mm, yyyy] = ukDate.split("/")
        formData.set("preferred_date", `${yyyy}-${mm}-${dd}`)
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Booking failed")
      }

      setSubmitStatus({
        type: "success",
        message: result.message,
      })

      form.reset()
    } catch (error) {
      console.error("Booking submission error:", error)
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SERVICE TYPE */}
      <fieldset>
        <legend className="font-semibold">Service Type *</legend>
        <div className="flex gap-4 mt-2">
          <label>
            <input
              type="radio"
              name="service_type"
              value="Residential"
              required
              defaultChecked
            />{" "}
            Residential
          </label>
          <label>
            <input
              type="radio"
              name="service_type"
              value="Commercial"
              required
            />{" "}
            Commercial
          </label>
        </div>
      </fieldset>

      {/* CONTACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="first_name" placeholder="First Name *" required />
        <input name="last_name" placeholder="Last Name *" required />
        <input type="email" name="email" placeholder="Email *" required />
        <input name="phone" placeholder="Phone *" required />
      </div>

      {/* PROPERTY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="address" placeholder="Address *" required />
        <input name="city" placeholder="City *" required />
        <input name="zip_code" placeholder="Postcode *" required />
        <input
          type="number"
          name="property_size"
          placeholder="Property size (sq ft)"
        />
      </div>

      {/* SERVICE DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="rooms" required>
          <option value="">Number of rooms *</option>
          <option value="1-2">1–2 rooms</option>
          <option value="3-4">3–4 rooms</option>
          <option value="5+">5+ rooms</option>
        </select>

        <select name="cleaning_type" required>
          <option value="">Cleaning type *</option>
          <option value="Deep Cleaning">Deep Cleaning</option>
          <option value="Regular Cleaning">Regular Cleaning</option>
          <option value="End of Tenancy">End of Tenancy</option>
        </select>

        <select name="frequency" required>
          <option value="">Frequency *</option>
          <option value="One-off">One-off</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-weekly">Bi-weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      {/* DATE & TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="preferred_date"
          placeholder="DD/MM/YYYY"
          pattern="\d{2}/\d{2}/\d{4}"
          required
        />

        <select name="preferred_time" required>
          <option value="">Preferred time *</option>
          <option value="08:00 - 10:00">08:00 – 10:00</option>
          <option value="10:00 - 12:00">10:00 – 12:00</option>
          <option value="12:00 - 14:00">12:00 – 14:00</option>
          <option value="14:00 - 16:00">14:00 – 16:00</option>
        </select>
      </div>

      {/* SPECIAL INSTRUCTIONS */}
      <textarea
        name="special_instructions"
        placeholder="Special instructions (optional)"
      />

      {/* STATUS MESSAGE */}
      {submitStatus && (
        <p
          className={
            submitStatus.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {submitStatus.message}
        </p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
      </button>
    </form>
  )
}
