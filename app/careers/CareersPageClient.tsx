"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Clock, Shield, Heart, CheckCircle, Upload, Phone, Mail, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CareersPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: "error",
          message: "File size must be less than 5MB",
        })
        return
      }
      // Check file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        setSubmitStatus({
          type: "error",
          message: "Please upload a PDF, DOC, DOCX, or TXT file",
        })
        return
      }
      setSelectedFile(file)
      setSubmitStatus({ type: null, message: "" })
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const formData = new FormData(event.currentTarget)

      // Add the file if selected
      if (selectedFile) {
        formData.append("resume", selectedFile)
      }

      const response = await fetch("/api/careers", {
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
        setSelectedFile(null)
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

      {/* Hero Section */}
      <section
        className="relative py-24 px-4 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/careers-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Join Our Team</h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md max-w-3xl mx-auto">
            Be part of a growing company that values professionalism, reliability, and making a difference in our
            community
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Work With Home2Work Cleaning?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a team that values your contribution and supports your professional growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible Hours</h3>
                <p className="text-gray-600">Work schedules that fit your lifestyle and commitments</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Job Security</h3>
                <p className="text-gray-600">Stable employment with a growing, established company</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Great Team</h3>
                <p className="text-gray-600">Work alongside supportive, professional colleagues</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                <p className="text-gray-600">Make a real difference in people's homes and workplaces</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-lg text-gray-600">We're actively hiring for these positions</p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Residential Cleaner</CardTitle>
                <p className="text-gray-600">Full-time & Part-time positions available</p>
                <p className="text-lg font-semibold text-green-600">£13.50 per hour</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What you'll do:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Provide high-quality residential cleaning services</li>
                      <li>• Follow established cleaning protocols and standards</li>
                      <li>• Interact professionally with clients</li>
                      <li>• Work independently or as part of a team</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Previous cleaning experience preferred</li>
                      <li>• Reliable transportation</li>
                      <li>• Attention to detail</li>
                      <li>• Physical ability to perform cleaning tasks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Commercial Cleaner</CardTitle>
                <p className="text-gray-600">Evening and weekend shifts available</p>
                <p className="text-lg font-semibold text-green-600">£15.50 per hour</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What you'll do:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Clean offices, retail spaces, and commercial buildings</li>
                      <li>• Maintain restrooms and common areas</li>
                      <li>• Empty trash and recycling</li>
                      <li>• Follow safety and security protocols</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Ability to work evenings/weekends</li>
                      <li>• Reliable and punctual</li>
                      <li>• Background check required</li>
                      <li>• Professional appearance and demeanor</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Apply Today</h2>
            <p className="text-lg text-gray-600">
              Ready to join our team? Fill out the application below and we'll get back to you within 48 hours.
            </p>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Job Application</CardTitle>
              <p className="text-gray-600">Please provide your information and we'll contact you soon</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Personal Information</Label>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="Street address, City, Postcode" />
                  </div>
                </div>

                {/* Position & Availability */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Position & Availability</Label>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position Interested In *</Label>
                    <select
                      id="position"
                      name="position"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a position</option>
                      <option value="residential-cleaner">Residential Cleaner</option>
                      <option value="commercial-cleaner">Commercial Cleaner</option>
                      <option value="other">Other (please specify in message)</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability *</Label>
                      <select
                        id="availability"
                        name="availability"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select availability</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="weekends-only">Weekends only</option>
                        <option value="evenings">Evenings</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Available Start Date (DD/MM/YYYY)</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        style={{
                          colorScheme: "light",
                        }}
                        className="[&::-webkit-calendar-picker-indicator]:opacity-100"
                        lang="en-GB"
                        data-date-format="dd/mm/yyyy"
                      />
                      <p className="text-xs text-gray-500">Optional: When can you start working?</p>
                    </div>
                  </div>
                </div>

                {/* Experience & Transportation */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Experience & Transportation</Label>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Previous Cleaning Experience</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      placeholder="Describe your previous cleaning experience, including residential, commercial, or specialized cleaning..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportation">Transportation *</Label>
                    <select
                      id="transportation"
                      name="transportation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select transportation method</option>
                      <option value="own-vehicle">Own vehicle</option>
                      <option value="public-transport">Public transport</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* References */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">References</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference1">Reference 1 (Name & Phone)</Label>
                      <Input id="reference1" name="reference1" placeholder="Name and phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference2">Reference 2 (Name & Phone)</Label>
                      <Input id="reference2" name="reference2" placeholder="Name and phone number" />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Resume/CV</Label>
                  <div className="space-y-2">
                    <Label htmlFor="resume">Upload Resume (PDF, DOC, DOCX, TXT - Max 5MB)</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-green-600">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter / Why do you want to work with us?</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={5}
                    placeholder="Tell us why you're interested in working with Home2Work Cleaning and what you can bring to our team..."
                  />
                </div>

                {/* Background Check Consent */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="backgroundCheck" name="backgroundCheck" className="mt-1" required />
                    <Label htmlFor="backgroundCheck" className="text-sm">
                      I consent to a background check being performed as part of the employment process. *
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  * Required fields. We'll review your application and contact you within 48 hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values & Requirements</h2>
            <p className="text-lg text-gray-600">What we look for in our team members</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">What We Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Reliability:</strong> Showing up on time, every time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Attention to Detail:</strong> Taking pride in thorough, quality work
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Professionalism:</strong> Representing our company with integrity
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Teamwork:</strong> Supporting colleagues and working together
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Customer Service:</strong> Treating clients with respect and care
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Basic Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Must be 18 years or older</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Eligible to work in the UK</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reliable transportation to job sites</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Physical ability to perform cleaning tasks</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Pass background check and reference verification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Working With Us?</h2>
          <p className="text-xl mb-8">
            We're here to help! Contact us if you have any questions about our open positions or the application
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <a href="tel:+447526229926" className="hover:underline">
                07526229926
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <a href="mailto:Contact@home2workcleaning.com" className="hover:underline">
                Contact@home2workcleaning.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
