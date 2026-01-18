"use client";

import { useState } from "react";

export default function BookingPageClient() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message?: string;
    missingFields?: string[];
  }>({ type: null });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: null });

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: result.error,
          missingFields: result.missingFields,
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Booking submitted successfully!",
      });

      form.reset();
    } catch (err) {
      console.error("❌ Client submit error:", err);
      setStatus({
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status.type === "error" && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {status.message}
          {status.missingFields && (
            <ul>
              {status.missingFields.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {status.type === "success" && (
        <div style={{ color: "green", marginBottom: 12 }}>
          {status.message}
        </div>
      )}

      {/* SERVICE TYPE */}
      <input type="hidden" name="serviceType" value="Residential" />

      {/* CONTACT */}
      <input name="firstName" placeholder="First Name" required />
      <input name="lastName" placeholder="Last Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" required />

      {/* PROPERTY */}
      <input name="address" placeholder="Address" required />
      <input name="city" placeholder="City" required />
      <input name="postcode" placeholder="Postcode" required />

      <select name="rooms" required>
        <option value="">Rooms</option>
        <option value="1-2 rooms">1–2 rooms</option>
        <option value="3-4 rooms">3–4 rooms</option>
        <option value="5+ rooms">5+ rooms</option>
      </select>

      {/* SERVICE DETAILS */}
      <select name="cleaningType" required>
        <option value="">Cleaning Type</option>
        <option value="Deep Cleaning">Deep Cleaning</option>
        <option value="Regular Cleaning">Regular Cleaning</option>
      </select>

      <select name="frequency" required>
        <option value="">Frequency</option>
        <option value="Weekly">Weekly</option>
        <option value="Bi-weekly">Bi-weekly</option>
        <option value="One-off">One-off</option>
      </select>

      {/* DATE — ISO submission, UK display handled by browser */}
      <input
        type="date"
        name="preferredDate"
        required
      />

      <select name="preferredTime" required>
        <option value="">Time</option>
        <option value="08:00 - 10:00">08:00 - 10:00</option>
        <option value="10:00 - 12:00">10:00 - 12:00</option>
        <option value="12:00 - 14:00">12:00 - 14:00</option>
      </select>

      <textarea name="notes" placeholder="Special instructions (optional)" />

      <button type="submit">Book My Cleaning Service</button>
    </form>
  );
}