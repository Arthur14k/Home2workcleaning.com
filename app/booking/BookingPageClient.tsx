"use client";

import { useState } from "react";

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      setSubmitStatus({
        type: "success",
        message: "Booking submitted successfully!",
      });

      event.currentTarget.reset();
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus.type && (
        <div
          className={`p-4 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Service Type */}
      <input type="hidden" name="serviceType" value="Residential" />

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name" required />
        <input name="lastName" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input name="phone" placeholder="Phone Number" required />
      </div>

      {/* Address */}
      <input name="address" placeholder="Property Address" required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="city" placeholder="City" required />
        <input name="postcode" placeholder="Postcode" required />
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="rooms" required>
          <option value="">Number of Rooms</option>
          <option value="1-2 rooms">1–2 rooms</option>
          <option value="3-4 rooms">3–4 rooms</option>
          <option value="5+ rooms">5+ rooms</option>
        </select>

        <select name="cleaningType" required>
          <option value="">Cleaning Type</option>
          <option value="Standard Cleaning">Standard Cleaning</option>
          <option value="Deep Cleaning">Deep Cleaning</option>
          <option value="End of Tenancy">End of Tenancy</option>
        </select>
      </div>

      <select name="frequency" required>
        <option value="">Frequency</option>
        <option value="One-off">One-off</option>
        <option value="Weekly">Weekly</option>
        <option value="Bi-weekly">Bi-weekly</option>
        <option value="Monthly">Monthly</option>
      </select>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="preferredDate"
          placeholder="DD/MM/YYYY"
          required
          pattern="\d{2}/\d{2}/\d{4}"
          title="Please enter date as DD/MM/YYYY"
        />

        <select name="preferredTime" required>
          <option value="">Preferred Time</option>
          <option value="08:00 AM - 10:00 AM">08:00 AM – 10:00 AM</option>
          <option value="10:00 AM - 12:00 PM">10:00 AM – 12:00 PM</option>
          <option value="12:00 PM - 02:00 PM">12:00 PM – 02:00 PM</option>
          <option value="02:00 PM - 04:00 PM">02:00 PM – 04:00 PM</option>
        </select>
      </div>

      {/* Special Instructions */}
      <textarea
        name="instructions"
        placeholder="Special instructions (optional)"
        rows={4}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
      </button>
    </form>
  );
}
