"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, CheckCircle2, Phone, Mail, Home, Building2, X } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Pricing configuration
const PRICING = {
  cleaningType: {
    "Standard Cleaning": 70,
    "Deep Cleaning": 130,
    "End of Tenancy": 170,
    "Move In/Out": 155,
  },
  rooms: {
    "1-2 rooms": 0,
    "3-4 rooms": 25,
    "5+ rooms": 45,
  },
  bathrooms: {
    "1": 0,
    "2": 20,
    "3": 25,
    "4": 30,
    "5+": 65,
  },
  addons: {
    "Oven Clean": 15,
    "Fridge Clean": 10,
    "Inside Cabinet": 5,
    "Interior Windows": 15,
    "Carpet Clean": 40,
  },
}

export default function BookingPageClient() {
  const [submitStatus, setSubmitStatus] = useState({
    type: null as "success" | "error" | null,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState("")
  
  // Residential form state
  const [cleaningType, setCleaningType] = useState("")
  const [rooms, setRooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  
  // Commercial form state
  const [businessType, setBusinessType] = useState("")
  const [floors, setFloors] = useState("")

  // Calculate total price for residential
  const priceBreakdown = useMemo(() => {
    if (serviceType !== "Residential") return null
    
    const items: { label: string; price: number }[] = []
    let total = 0

    if (cleaningType && PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]) {
      const price = PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]
      items.push({ label: cleaningType, price })
      total += price
    }

    if (rooms && PRICING.rooms[rooms as keyof typeof PRICING.rooms]) {
      const price = PRICING.rooms[rooms as keyof typeof PRICING.rooms]
      if (price > 0) {
        items.push({ label: `Rooms (${rooms})`, price })
        total += price
      }
    }

    if (bathrooms && PRICING.bathrooms[bathrooms as keyof typeof PRICING.bathrooms]) {
      const price = PRICING.bathrooms[bathrooms as keyof typeof PRICING.bathrooms]
      if (price > 0) {
        items.push({ label: `Bathrooms (${bathrooms})`, price })
        total += price
      }
    }

    selectedAddons.forEach((addon) => {
      const price = PRICING.addons[addon as keyof typeof PRICING.addons]
      if (price) {
        items.push({ label: addon, price })
        total += price
      }
    })

    return { items, total }
  }, [serviceType, cleaningType, rooms, bathrooms, selectedAddons])

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    )
  }

  const removeAddon = (addon: string) => {
    setSelectedAddons((prev) => prev.filter((a) => a !== addon))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      
      // Add calculated total for residential
      if (serviceType === "Residential" && priceBreakdown) {
        formData.set("totalPrice", priceBreakdown.total.toString())
        formData.set("addons", selectedAddons.join(", "))
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message })
        form.reset()
        setServiceType("")
        setCleaningType("")
        setRooms("")
        setBathrooms("")
        setSelectedAddons([])
        setBusinessType("")
        setFloors("")
      } else {
        setSubmitStatus({ type: "error", message: result.message || "Something went wrong." })
      }
    } catch (error) {
      console.error("Booking submission error:", error)
      setSubmitStatus({ type: "error", message: "Network error. Please check your connection." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/booking-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Book Your Cleaning</h1>
          <p className="text-lg opacity-90">Schedule your professional cleaning service today</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">1. Choose Service</h3>
              <p className="text-muted-foreground text-sm">Select your cleaning type and preferences</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="font-semibold mb-1">2. Pick Date & Time</h3>
              <p className="text-muted-foreground text-sm">Select your preferred schedule</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">3. Confirm Booking</h3>
              <p className="text-muted-foreground text-sm">Get instant confirmation and reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Form - Left Column */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold">Schedule Your Service</CardTitle>
                  <p className="text-sm text-muted-foreground">Fill out the details below to book your cleaning appointment</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Service Type *</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label 
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            serviceType === "Residential" 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-input hover:border-blue-300"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="serviceType" 
                            value="Residential" 
                            required 
                            className="sr-only"
                            onChange={(e) => setServiceType(e.target.value)}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            serviceType === "Residential" ? "border-blue-500" : "border-gray-300"
                          }`}>
                            {serviceType === "Residential" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <Home className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">Residential</p>
                            <p className="text-xs text-muted-foreground">Home cleaning services</p>
                          </div>
                        </label>
                        <label 
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            serviceType === "Commercial" 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-input hover:border-blue-300"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="serviceType" 
                            value="Commercial" 
                            required 
                            className="sr-only"
                            onChange={(e) => setServiceType(e.target.value)}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            serviceType === "Commercial" ? "border-blue-500" : "border-gray-300"
                          }`}>
                            {serviceType === "Commercial" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            )}
                          </div>
                          <Building2 className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-sm">Commercial</p>
                            <p className="text-xs text-muted-foreground">Office & business cleaning</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Contact Information - Same for both */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">First Name *</label>
                          <input name="firstName" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Last Name *</label>
                          <input name="lastName" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Email Address *</label>
                          <input name="email" type="email" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Phone Number *</label>
                          <input name="phone" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* Property Details - Same for both */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Property Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Property Address *</label>
                          <input name="address" placeholder="123 Main Street" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">City *</label>
                            <input name="city" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Postcode *</label>
                            <input name="postcode" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Property Size (sq ft)</label>
                          <input name="propertySize" type="number" placeholder="e.g., 2000" className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* RESIDENTIAL Service Details */}
                    {serviceType === "Residential" && (
                      <>
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Service Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm mb-1">Cleaning Type *</label>
                              <select 
                                name="cleaningType" 
                                required 
                                value={cleaningType}
                                onChange={(e) => setCleaningType(e.target.value)}
                                className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select cleaning type</option>
                                <option value="Standard Cleaning">Standard Cleaning</option>
                                <option value="Deep Cleaning">Deep Cleaning</option>
                                <option value="End of Tenancy">End of Tenancy</option>
                                <option value="Move In/Out">Move In/Out</option>
                              </select>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm mb-1">Number of Rooms *</label>
                                <select 
                                  name="rooms" 
                                  required 
                                  value={rooms}
                                  onChange={(e) => setRooms(e.target.value)}
                                  className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select rooms</option>
                                  <option value="1-2 rooms">1-2 rooms</option>
                                  <option value="3-4 rooms">3-4 rooms</option>
                                  <option value="5+ rooms">5+ rooms</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm mb-1">Number of Bathrooms *</label>
                                <select 
                                  name="bathrooms" 
                                  required 
                                  value={bathrooms}
                                  onChange={(e) => setBathrooms(e.target.value)}
                                  className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select bathrooms</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5+">5+</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Frequency</label>
                              <select name="frequency" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="One-time service">One-time service</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-weekly">Bi-weekly</option>
                                <option value="Monthly">Monthly</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Add-ons Section */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">Add-ons (Optional)</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.keys(PRICING.addons).map((addon) => (
                              <label
                                key={addon}
                                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                                  selectedAddons.includes(addon)
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-input hover:border-blue-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedAddons.includes(addon)}
                                  onChange={() => toggleAddon(addon)}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm">{addon}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* COMMERCIAL Service Details */}
                    {serviceType === "Commercial" && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Service Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm mb-1">Business Type *</label>
                            <select 
                              name="businessType" 
                              required 
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select business type</option>
                              <option value="Office">Office</option>
                              <option value="Retail Store">Retail Store</option>
                              <option value="Restaurant/Cafe">Restaurant/Cafe</option>
                              <option value="Gym">Gym</option>
                              <option value="Warehouse">Warehouse</option>
                            </select>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm mb-1">Number of Offices/Rooms *</label>
                              <select 
                                name="rooms" 
                                required 
                                value={rooms}
                                onChange={(e) => setRooms(e.target.value)}
                                className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="1-2 rooms">1-2</option>
                                <option value="3-4 rooms">3-4</option>
                                <option value="5+ rooms">5+</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Number of Floors *</label>
                              <select 
                                name="floors" 
                                required 
                                value={floors}
                                onChange={(e) => setFloors(e.target.value)}
                                className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm mb-1">Number of Bathrooms *</label>
                              <select 
                                name="bathrooms" 
                                required 
                                value={bathrooms}
                                onChange={(e) => setBathrooms(e.target.value)}
                                className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5+">5+</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Frequency</label>
                            <select name="frequency" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="One-time service">One-time service</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-weekly">Bi-weekly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          </div>
                        </div>
                        {/* Hidden field for cleaningType - commercial uses businessType */}
                        <input type="hidden" name="cleaningType" value={businessType || "Commercial Cleaning"} />
                      </div>
                    )}

                    {/* Preferred Date & Time - Same for both */}
                    {serviceType && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Preferred Date & Time</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">Preferred Date * (DD/MM/YYYY)</label>
                            <input type="date" name="preferredDate" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <p className="text-xs text-muted-foreground mt-1">Please select your preferred service date</p>
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Preferred Time *</label>
                            <select name="preferredTime" required className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Select time</option>
                              {serviceType === "Commercial" ? (
                                <>
                                  <option value="5:00 AM - 8:00 AM">5:00 AM - 8:00 AM</option>
                                  <option value="8:00 AM - 11:00 AM">8:00 AM - 11:00 AM</option>
                                  <option value="14:00 PM - 17:00 PM">14:00 PM - 17:00 PM</option>
                                  <option value="17:00 PM - 20:00 PM">17:00 PM - 20:00 PM</option>
                                  <option value="20:00 PM - 23:00 PM">20:00 PM - 23:00 PM</option>
                                </>
                              ) : (
                                <>
                                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Instructions - Same for both */}
                    {serviceType && (
                      <div>
                        <label className="block text-sm font-semibold mb-1">Special Instructions or Requests</label>
                        <textarea 
                          name="specialInstructions" 
                          placeholder="Any specific areas of focus, access instructions, pet information, or special requirements..." 
                          rows={4} 
                          className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    )}

                    {/* Order Summary - Residential Only */}
                    {serviceType === "Residential" && priceBreakdown && priceBreakdown.total > 0 && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          {priceBreakdown.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-2">
                                {item.label}
                                {selectedAddons.includes(item.label) && (
                                  <button
                                    type="button"
                                    onClick={() => removeAddon(item.label)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </span>
                              <span>£{item.price}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg text-blue-600">£{priceBreakdown.total}</span>
                          </div>
                        </div>
                        <input type="hidden" name="totalPrice" value={priceBreakdown.total} />
                        <input type="hidden" name="addons" value={selectedAddons.join(", ")} />
                      </div>
                    )}

                    {/* Commercial Quote Message */}
                    {serviceType === "Commercial" && (
                      <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                        <p className="text-sm text-blue-800">
                          Based on your details, we'll provide a tailored quote within 2 hours.
                        </p>
                      </div>
                    )}

                    {/* Status Messages */}
                    {submitStatus.type === "error" && (
                      <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg text-sm">
                        {submitStatus.message}
                      </div>
                    )}
                    {submitStatus.type === "success" && (
                      <div className="p-4 border border-green-500/50 bg-green-500/10 text-green-700 rounded-lg text-sm">
                        {submitStatus.message}
                      </div>
                    )}

                    {/* Submit */}
                    {serviceType && (
                      <>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                          {isSubmitting 
                            ? "Submitting..." 
                            : serviceType === "Commercial" 
                              ? "Request a Quote" 
                              : "Book My Cleaning Service"
                          }
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          * Required fields. You'll receive a confirmation email within 2 hours.
                        </p>
                      </>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* What to Expect */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold">What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Quick Confirmation</p>
                      <p className="text-xs text-muted-foreground">You'll receive confirmation within 2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Professional Team</p>
                      <p className="text-xs text-muted-foreground">Trained, insured, and background-checked staff</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Eco-Friendly Products</p>
                      <p className="text-xs text-muted-foreground">Safe, non-toxic cleaning supplies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Satisfaction Guarantee</p>
                      <p className="text-xs text-muted-foreground">100% satisfaction or we'll make it right</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold">Need Help?</CardTitle>
                  <p className="text-xs text-muted-foreground">Have questions about our services or need a custom quote?</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="tel:07526229926" className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">07526229926</span>
                  </a>
                  <a href="mailto:Contact@home2workcleaning.com" className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Contact@home2workcleaning.com</span>
                  </a>
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
