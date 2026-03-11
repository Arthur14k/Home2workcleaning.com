"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, ClipboardCheck, CheckCircle, Phone, Mail, Clock } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BookingPageClient() {
  const [submitStatus, setSubmitStatus] = useState({
    type: null as "success" | "error" | null,
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)

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
        form.reset()
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/booking-hero.jpg"
          alt="Professional cleaning service"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Book Your Cleaning</h1>
            <p className="text-lg md:text-xl opacity-90">Schedule your professional cleaning service today</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">1. Choose Service</h3>
              <p className="text-muted-foreground text-sm">Select your cleaning type and preferences</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ClipboardCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">2. Pick a Date</h3>
              <p className="text-muted-foreground text-sm">Select your preferred date and time slot</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">3. Confirm Booking</h3>
              <p className="text-muted-foreground text-sm">We'll confirm and send you the details</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Status Messages */}
          {submitStatus.type === "error" && (
            <div className="max-w-4xl mx-auto mb-6 p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
              {submitStatus.message}
            </div>
          )}

          {submitStatus.type === "success" && (
            <div className="max-w-4xl mx-auto mb-6 p-4 border border-green-500/50 bg-green-500/10 text-green-700 rounded-lg">
              {submitStatus.message}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form - Left Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Schedule Your Service</CardTitle>
                  <CardDescription>Fill out the details below to book your cleaning appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Type */}
                    <div>
                      <label className="block font-medium mb-3">Service Type *</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="service_type" value="Residential" required className="w-4 h-4 text-primary" />
                          <span>Residential</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="service_type" value="Commercial" required className="w-4 h-4 text-primary" />
                          <span>Commercial</span>
                        </label>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <input name="first_name" placeholder="First Name *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="last_name" placeholder="Last Name *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="email" type="email" placeholder="Email *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="phone" placeholder="Phone *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {/* Address */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <input name="address" placeholder="Address *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="city" placeholder="City *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="postcode" placeholder="Postcode *" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <input name="property_size" type="number" placeholder="Property size (sq ft)" className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>

                    {/* Property Details */}
                    <select name="rooms" required className="border border-input bg-background p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Number of rooms *</option>
                      <option value="1-2 rooms">1-2 rooms</option>
                      <option value="3-4 rooms">3-4 rooms</option>
                      <option value="5+ rooms">5+ rooms</option>
                    </select>

                    {/* Cleaning Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <select name="cleaning_type" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Cleaning type *</option>
                        <option value="Standard Cleaning">Standard Cleaning</option>
                        <option value="Deep Cleaning">Deep Cleaning</option>
                        <option value="End of Tenancy">End of Tenancy</option>
                      </select>
                      <select name="frequency" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Frequency *</option>
                        <option value="One-off">One-off</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="date" name="preferred_date" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                      <select name="preferred_time" required className="border border-input bg-background p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Preferred time *</option>
                        <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                        <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                        <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                        <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <textarea name="special_instructions" placeholder="Special instructions (optional)" rows={4} className="border border-input bg-background p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary" />

                    {/* Submit */}
                    <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                      {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* What to Expect */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Confirmation email within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Professional, vetted cleaning staff</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Eco-friendly cleaning products</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">100% satisfaction guarantee</p>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Call Us</p>
                      <p className="text-sm text-muted-foreground">0800 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email Us</p>
                      <p className="text-sm text-muted-foreground">info@home2work.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Working Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat: 8am - 6pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
