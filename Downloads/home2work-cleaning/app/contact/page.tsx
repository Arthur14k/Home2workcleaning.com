// app/contact/page.tsx
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/send-contact", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("Message sent!");
      setForm({ name: "", email: "", phone: "", service_type: "", message: "" });
    } else {
      setStatus("Failed to send message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 my-2 border" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 my-2 border" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 my-2 border" />
      <input name="service_type" value={form.service_type} onChange={handleChange} placeholder="Service Type" className="w-full p-2 my-2 border" />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" className="w-full p-2 my-2 border" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Send</button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  );
}