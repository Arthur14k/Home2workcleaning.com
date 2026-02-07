"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Home, Building, CheckCircle, Phone, Mail, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { format } from "date-fns"

export default function BookingPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Get today's date in UK format for minimum date
  const today = format(new Date(), "yyyy-MM-dd")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

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
        // Reset form
        event.currentTarget.reset()
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Background Image */}
      <section
        className="relative py-24 px-4 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/booking-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Book Your Cleaning Service</h1>
          <p className="text-xl text-white mb-8 drop-shadow-md">
            Schedule your professional cleaning service in just a few simple steps
          </p>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Process Steps */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Choose Service</h3>
                <p className="text-gray-600">Select your cleaning type and preferences</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Pick Date & Time</h3>
                <p className="text-gray-600">Select your preferred schedule</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Confirm Booking</h3>
                <p className="text-gray-600">Get instant confirmation and reminders</p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus.type && (
            <div
              className={`mb-8 p-4 rounded-lg flex items-center space-x-3 ${
                submitStatus.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p>{submitStatus.message}</p>
            </div>
          )}

          {/* Booking Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Schedule Your Service</CardTitle>
                  <p className="text-gray-600">Fill out the details below to book your cleaning appointment</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Type */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Service Type *</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="serviceType"
                                value="residential"
                                id="residential"
                                className="text-blue-600"
                                required
                              />
                              <Home className="h-6 w-6 text-blue-600" />
                              <div>
                                <Label htmlFor="residential" className="font-medium cursor-pointer">
                                  Residential
                                </Label>
                                <p className="text-sm text-gray-600">Home cleaning services</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:border-green-500 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="serviceType"
                                value="commercial"
                                id="commercial"
                                className="text-green-600"
                                required
                              />
                              <Building className="h-6 w-6 text-green-600" />
                              <div>
                                <Label htmlFor="commercial" className="font-medium cursor-pointer">
                                  Commercial
                                </Label>
                                <p className="text-sm text-gray-600">Office & business cleaning</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Contact Information</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bookingFirstName">First Name *</Label>
                          <Input id="bookingFirstName" name="firstName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookingLastName">Last Name *</Label>
                          <Input id="bookingLastName" name="lastName" required />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bookingEmail">Email Address *</Label>
                          <Input id="bookingEmail" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookingPhone">Phone Number *</Label>
                          <Input id="bookingPhone" name="phone" type="tel" required />
                        </div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Property Details</Label>
                      <div className="space-y-2">
                        <Label htmlFor="address">Property Address *</Label>
                        <Input id="address" name="address" placeholder="123 Main Street" required />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input id="city" name="city" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postCode">posttcode *</Label>
                          <Input id="postCode" name="postCode" required />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="propertySize">Property Size (sq ft)</Label>
                          <Input id="propertySize" name="propertySize" type="number" placeholder="e.g., 2000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rooms">Number of Rooms</Label>
                          <select
                            id="rooms"
                            name="rooms"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select rooms</option>
                            <option value="1-2">1-2 rooms</option>
                            <option value="3-4">3-4 rooms</option>
                            <option value="5-6">5-6 rooms</option>
                            <option value="7+">7+ rooms</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Service Details</Label>
                      <div className="space-y-2">
                        <Label htmlFor="cleaningType">Cleaning Type *</Label>
                        <select
                          id="cleaningType"
                          name="cleaningType"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select cleaning type</option>
                          <option value="regular">Regular Cleaning</option>
                          <option value="deep">Deep Cleaning</option>
                          <option value="move-in-out">Move In/Out Cleaning</option>
                          <option value="post-construction">Post-Construction</option>
                          <option value="one-time">One-Time Cleaning</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <select
                          id="frequency"
                          name="frequency"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="one-time">One-time service</option>
                          <option value="weekly">Weekly</option>
                          <option value="bi-weekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Preferred Date & Time</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">Preferred Date * (DD/MM/YYYY)</Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            required
                            min={today}
                            style={{
                              colorScheme: "light",
                            }}
                            className="[&::-webkit-calendar-picker-indicator]:opacity-100"
                            lang="en-GB"
                            data-date-format="dd/mm/yyyy"
                          />
                          <p className="text-xs text-gray-500">Please select your preferred service date</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">Preferred Time *</Label>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select time</option>
                            <option value="8:00-10:00">8:00 AM - 10:00 AM</option>
                            <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                            <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                            <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                            <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions or Requests</Label>
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={4}
                        placeholder="Any specific areas of focus, access instructions, pet information, or special requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Book My Cleaning Service"}
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                      * Required fields. You'll receive a confirmation email within 2 hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary & Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Quick Confirmation</p>
                      <p className="text-sm text-gray-600">You'll receive confirmation within 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Professional Team</p>
                      <p className="text-sm text-gray-600">Trained, insured, and background-checked staff</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Eco-Friendly Products</p>
                      <p className="text-sm text-gray-600">Safe, non-toxic cleaning supplies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Satisfaction Guarantee</p>
                      <p className="text-sm text-gray-600">100% satisfaction or we'll make it right</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Have questions about our services or need a custom quote?</p>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href="tel:+447526229926" className="text-blue-600 hover:text-blue-700">
                        07526229926
                      </a>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href="mailto:Contact@home2workcleaning.com" className="text-blue-600 hover:text-blue-700">
                        Contact@home2workcleaning.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
