"use client"

import { useState } from "react"

type SubmitStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string }

export default function BookingPageClient() {
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    notes: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus({ type: "loading" })

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      let data: any = null
      try {
        data = await response.json()
      } catch {
        // API failed to return JSON
      }

      if (!response.ok) {
        throw new Error(
          data?.message || "Booking could not be completed. Please try again."
        )
      }

      setStatus({
        type: "success",
        message: data?.message || "Booking received successfully.",
      })

      // Optional: reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        service: "",
        date: "",
        notes: "",
      })
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err?.message ||
          "Unable to submit booking. Please check your connection and try again.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} required />
      <input name="email" value={formData.email} onChange={handleChange} required />
      <input name="phone" value={formData.phone} onChange={handleChange} />
      <input name="address" value={formData.address} onChange={handleChange} />
      <input name="service" value={formData.service} onChange={handleChange} />
      <input type="date" name="date" value={formData.date} onChange={handleChange} />
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <button type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Submitting..." : "Book Now"}
      </button>

      {status.type === "success" && (
        <p className="text-green-600">{status.message}</p>
      )}

      {status.type === "error" && (
        <p className="text-red-600">{status.message}</p>
      )}
    </form>
  )
}
