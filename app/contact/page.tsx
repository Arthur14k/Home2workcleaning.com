import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact Us - Home2work Cleaning | Get Your Free Quote Today",
  description:
    "Contact Home2work Cleaning for professional cleaning services. Call (555) 123-4567 or email us for a free quote. Serving the local area with reliable cleaning solutions.",
  keywords:
    "contact cleaning service, free cleaning quote, professional cleaners contact, cleaning service phone number",
}

import React from "react";

export default function ContactPage() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-cover bg-center text-white py-24 px-4"
          style={{
            backgroundImage: "url('/services-6195125.jpg')",
          }}
        >
          <div className="bg-black/50 p-8 rounded-lg text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h1>
            <p className="text-xl text-white">
              Discover our full range of residential and commercial cleaning
            </p>
          </div>
        </section>
      </div>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Ready to experience the Home2work difference? Contact us today to maintain a spotless space.
          </p>
        </div>
      </section>
    </>
  );
}

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                        <p className="text-gray-600 mb-2">Call us for immediate assistance</p>
                        <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700 font-medium">
                          (555) 123-4567
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600 mb-2">Send us a message anytime</p>
                        <a
                          href="mailto:Contact@home2workcleaning.com"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Contact@home2workcleaning.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                        <div className="text-gray-700 space-y-1">
                          <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                          <p>Saturday: 9:00 AM - 4:00 PM</p>
                          <p>Sunday: Closed</p>
                          <p className="text-sm text-gray-600 mt-2">Emergency services available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a service</option>
                      <option value="residential">Residential Cleaning</option>
                      <option value="commercial">Commercial Cleaning</option>
                      <option value="deep-cleaning">Deep Cleaning</option>
                      <option value="move-in-out">Move In/Out Cleaning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us about your cleaning needs, property size, preferred schedule, or any special requirements..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Send Message
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    * Required fields. We respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Areas</h2>
          <p className="text-lg text-gray-600 mb-8">
            We proudly serve the following areas with our professional cleaning services
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-gray-700">
            <div>Manchester</div>
            <div>Salford</div>
            <div>Oldham</div>
            <div>Bolton</div>
            <div>Bury</div>
            <div>Rochdale</div>
            <div>Stockport</div>
            <div>Tameside</div>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            Don't see your area listed? Contact us - we may still be able to serve you!
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
