"use client"

import { useState } from "react"

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Controlled state ONLY where necessary
  const [serviceType, setServiceType] = useState<"Residential" | "Commercial">(
    "Residential"
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      // 🔒 Guarantee required values that may be visual-only
      formData.set("service_type", serviceType)

      const res = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Booking failed")
      }

      setSuccess(result.message)
      form.reset()
      setServiceType("Residential")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ================= SERVICE TYPE ================= */}
      <section>
        <h2>Service Type *</h2>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setServiceType("Residential")}
            className={serviceType === "Residential" ? "active" : ""}
          >
            Residential
          </button>

          <button
            type="button"
            onClick={() => setServiceType("Commercial")}
            className={serviceType === "Commercial" ? "active" : ""}
          >
            Commercial
          </button>
        </div>

        {/* REQUIRED hidden input */}
        <input type="hidden" name="service_type" value={serviceType} />
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section>
        <input name="first_name" placeholder="First Name *" required />
        <input name="last_name" placeholder="Last Name *" required />
        <input name="email" type="email" placeholder="Email *" required />
        <input name="phone" placeholder="Phone *" required />
      </section>

      {/* ================= PROPERTY DETAILS ================= */}
      <section>
        <input name="address" placeholder="Address *" required />
        <input name="city" placeholder="City *" required />
        <input name="zip_code" placeholder="Postcode *" required />

        <input
          name="property_size"
          type="number"
          placeholder="Property size (sq ft)"
        />

        <select name="rooms" required>
          <option value="">Number of rooms *</option>
          <option value="1-2 rooms">1–2 rooms</option>
          <option value="3-4 rooms">3–4 rooms</option>
          <option value="5+ rooms">5+ rooms</option>
        </select>
      </section>

      {/* ================= SERVICE DETAILS ================= */}
      <section>
        <select name="cleaning_type" required>
          <option value="">Cleaning type *</option>
          <option value="Regular Cleaning">Regular Cleaning</option>
          <option value="Deep Cleaning">Deep Cleaning</option>
          <option value="End of Tenancy">End of Tenancy</option>
        </select>

        <select name="frequency" required>
          <option value="">Frequency *</option>
          <option value="One-off">One-off</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-weekly">Bi-weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </section>

      {/* ================= DATE & TIME ================= */}
      <section className="flex gap-4">
        {/* ISO format submission (YYYY-MM-DD) */}
        <input
          type="date"
          name="preferred_date"
          required
        />

        <select name="preferred_time" required defaultValue="">
          <option value="">Preferred time *</option>
          <option value="8:00 AM - 10:00 AM">8:00 AM – 10:00 AM</option>
          <option value="10:00 AM - 12:00 PM">10:00 AM – 12:00 PM</option>
          <option value="12:00 PM - 2:00 PM">12:00 PM – 2:00 PM</option>
          <option value="2:00 PM - 4:00 PM">2:00 PM – 4:00 PM</option>
        </select>
      </section>

      {/* ================= NOTES ================= */}
      <section>
        <textarea
          name="special_instructions"
          placeholder="Special instructions (optional)"
        />
      </section>

      {/* ================= FEEDBACK ================= */}
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* ================= SUBMIT ================= */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
      </button>
    </form>
  )
}
