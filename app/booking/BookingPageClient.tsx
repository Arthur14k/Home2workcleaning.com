"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, Clock, CheckCircle2, Phone, Mail, Home, Building2, X } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Promo codes configuration
const PROMO_CODES: { [key: string]: { discount: number; type: "fixed" | "percent"; description: string } } = {
  "FIRSTCLEAN": { discount: 10, type: "fixed", description: "First-time customer discount" },
}

// Pricing configuration
const PRICING = {
  cleaningType: {
    "Standard Cleaning": 90,
    "Deep Cleaning": 180,
    "End of Tenancy": 220,
    "Move In/Out": 200,
  },
  // Frequency discounts (only apply to Standard and Deep Cleaning)
  frequencyPrices: {
    "Standard Cleaning": {
      "One-time service": 90,
      "Monthly": 85,
      "Fortnightly": 83,
      "Weekly": 81,
    },
    "Deep Cleaning": {
      "One-time service": 180,
      "Monthly": 171,
      "Fortnightly": 166,
      "Weekly": 162,
    },
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

// Payment details
const PAYMENT_DETAILS = {
  paypal: "https://paypal.me/Home2WorkCleaning",
  bank: {
    accountName: "Home2Work Cleaning",
    sortCode: "07-09-76",
    accountNumber: "07775894",
  },
}

interface BookingConfirmation {
  bookingRef: string
  firstName: string
  cleaningType: string
  preferredDate: string
  preferredTime: string
  address: string
  totalPrice: number
  serviceType: string
}

interface BookingPageClientProps {
  recaptchaSiteKey: string
}

export default function BookingPageClient({ recaptchaSiteKey }: BookingPageClientProps) {
  const [submitStatus, setSubmitStatus] = useState({
    type: null as "success" | "error" | null,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState("")
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null)
  
  // Residential form state
  const [cleaningType, setCleaningType] = useState("")
  const [rooms, setRooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [frequency, setFrequency] = useState("One-time service")
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [ownEquipment, setOwnEquipment] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null)
  const [promoError, setPromoError] = useState("")
  
  // Commercial form state
  const [businessType, setBusinessType] = useState("")
  const [floors, setFloors] = useState("")
  
  // reCAPTCHA state
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  
  const onRecaptchaChange = useCallback((token: string | null) => {
    setRecaptchaToken(token)
  }, [])

  // Calculate total price for residential
  const priceBreakdown = useMemo(() => {
    if (serviceType !== "Residential") return null
    
    const items: { label: string; price: number; discount?: string }[] = []
    let total = 0

    if (cleaningType && PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]) {
      // Check if frequency discount applies (only for Standard and Deep Cleaning)
      const frequencyPrices = PRICING.frequencyPrices[cleaningType as keyof typeof PRICING.frequencyPrices]
      let price: number
      let discountLabel: string | undefined
      
      if (frequencyPrices && frequency !== "One-time service") {
        price = frequencyPrices[frequency as keyof typeof frequencyPrices] || PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]
        const originalPrice = PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]
        const discountPercent = Math.round((1 - price / originalPrice) * 100)
        discountLabel = `${discountPercent}% ${frequency} discount`
      } else {
        price = PRICING.cleaningType[cleaningType as keyof typeof PRICING.cleaningType]
      }
      
      items.push({ label: cleaningType, price, discount: discountLabel })
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

    // Apply own equipment discount (Standard Cleaning only)
    if (cleaningType === "Standard Cleaning" && ownEquipment === "Yes") {
      items.push({ label: "Own Equipment Discount", price: -10 })
      total -= 10
    }

    return { items, total }
  }, [serviceType, cleaningType, rooms, bathrooms, frequency, selectedAddons, ownEquipment])

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    )
  }

  const removeAddon = (addon: string) => {
    setSelectedAddons((prev) => prev.filter((a) => a !== addon))
  }

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase().trim()
    if (!code) {
      setPromoError("Please enter a promo code")
      return
    }
    
    const promo = PROMO_CODES[code]
    if (promo) {
      setAppliedPromo({ code, discount: promo.discount, description: promo.description })
      setPromoError("")
    } else {
      setPromoError("Invalid promo code")
      setAppliedPromo(null)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
    setPromoError("")
  }

  // Calculate final total with promo discount
  const finalTotal = useMemo(() => {
    if (!priceBreakdown) return 0
    let total = priceBreakdown.total
    if (appliedPromo) {
      total = Math.max(0, total - appliedPromo.discount)
    }
    return total
  }, [priceBreakdown, appliedPromo])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setSubmitStatus({ type: "error", message: "Please complete the reCAPTCHA verification." })
      return
    }
    
    setIsSubmitting(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      
      // Add reCAPTCHA token
      formData.set("recaptchaToken", recaptchaToken)
      
      // Add calculated total for residential
      if (serviceType === "Residential" && priceBreakdown) {
        formData.set("totalPrice", finalTotal.toString())
        formData.set("addons", selectedAddons.join(", "))
        if (appliedPromo) {
          formData.set("promoCode", appliedPromo.code)
          formData.set("promoDiscount", appliedPromo.discount.toString())
        }
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // For residential bookings, show payment confirmation
        if (serviceType === "Residential" && priceBreakdown) {
          const bookingRef = `H2W-${Date.now().toString(36).toUpperCase()}`
          setBookingConfirmation({
            bookingRef,
            firstName: formData.get("firstName") as string,
            cleaningType: formData.get("cleaningType") as string,
            preferredDate: formData.get("preferredDate") as string,
            preferredTime: formData.get("preferredTime") as string,
            address: `${formData.get("address")}, ${formData.get("city")}, ${formData.get("postcode")}`,
            totalPrice: finalTotal,
            serviceType: "Residential",
          })
        } else {
          // For commercial, just show success message
          setSubmitStatus({ type: "success", message: result.message })
        }
        form.reset()
        setServiceType("")
        setCleaningType("")
        setRooms("")
        setBathrooms("")
        setFrequency("One-time service")
        setSelectedAddons([])
        setOwnEquipment("")
        setPromoCode("")
        setAppliedPromo(null)
        setPromoError("")
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

      {/* Payment Confirmation Screen */}
      {bookingConfirmation && (
        <section className="py-12 flex-1">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">Booking Confirmed!</CardTitle>
                <p className="text-muted-foreground">Thank you, {bookingConfirmation.firstName}. Your booking has been received.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-medium">{bookingConfirmation.bookingRef}</span>
                    <span className="text-muted-foreground">Service:</span>
                    <span>{bookingConfirmation.cleaningType}</span>
                    <span className="text-muted-foreground">Date:</span>
                    <span>{bookingConfirmation.preferredDate}</span>
                    <span className="text-muted-foreground">Time:</span>
                    <span>{bookingConfirmation.preferredTime}</span>
                    <span className="text-muted-foreground">Address:</span>
                    <span>{bookingConfirmation.address}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-green-700">£{bookingConfirmation.totalPrice}</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">Choose Your Payment Method</h3>
                  
                  {/* PayPal Option */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">PP</span>
                      </div>
                      <span className="font-semibold">Pay with PayPal</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Quick and secure payment via PayPal</p>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <a 
                        href={`${PAYMENT_DETAILS.paypal}/${bookingConfirmation.totalPrice}GBP`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pay £{bookingConfirmation.totalPrice} with PayPal
                      </a>
                    </Button>
                  </div>

                  {/* Bank Transfer Option */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">Bank Transfer</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Transfer directly to our bank account</p>
                    <div className="bg-gray-50 rounded p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-medium">{PAYMENT_DETAILS.bank.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sort Code:</span>
                        <span className="font-medium">{PAYMENT_DETAILS.bank.sortCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-medium">{PAYMENT_DETAILS.bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-medium text-blue-600">{bookingConfirmation.bookingRef}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Please use your booking reference as the payment reference
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-blue-800 mb-1">Important:</p>
                  <p className="text-blue-700">
                    Your booking will be confirmed once payment is received. A confirmation email has been sent to your email address.
                  </p>
                </div>

                {/* Book Another */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setBookingConfirmation(null)}
                >
                  Book Another Cleaning
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* How It Works */}
      {!bookingConfirmation && (
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
      )}

      {/* Main Content */}
      {!bookingConfirmation && (
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
                                onChange={(e) => {
                                  setCleaningType(e.target.value)
                                  if (e.target.value !== "Standard Cleaning") {
                                    setSelectedAddons([])
                                    setOwnEquipment("")
                                  }
                                }}
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
                              <select 
                                name="frequency" 
                                required 
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="One-time service">One-time service</option>
                                <option value="Weekly">Weekly (10% off)</option>
                                <option value="Fortnightly">Fortnightly (8% off)</option>
                                <option value="Monthly">Monthly (5% off)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Add-ons Section - Only for Standard Cleaning */}
                        {cleaningType === "Standard Cleaning" && (
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
                        )}
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
                              <option value="Fortnightly">Fortnightly</option>
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
                              ) : cleaningType === "Deep Cleaning" ? (
                                <>
                                  <option value="8:00 AM - 12:00 PM">8:00 AM - 12:00 PM</option>
                                  <option value="12:00 PM - 16:00 PM">12:00 PM - 16:00 PM</option>
                                  <option value="16:00 PM - 20:00 PM">16:00 PM - 20:00 PM</option>
                                </>
                              ) : cleaningType === "End of Tenancy" || cleaningType === "Move In/Out" ? (
                                <>
                                  <option value="8:00 AM - 13:00 PM">8:00 AM - 13:00 PM</option>
                                  <option value="13:00 PM - 18:00 PM">13:00 PM - 18:00 PM</option>
                                </>
                              ) : (
                                <>
                                  <option value="8:00 AM - 11:00 AM">8:00 AM - 11:00 AM</option>
                                  <option value="11:00 AM - 14:00 PM">11:00 AM - 14:00 PM</option>
                                  <option value="14:00 PM - 17:00 PM">14:00 PM - 17:00 PM</option>
                                  <option value="17:00 PM - 20:00 PM">17:00 PM - 20:00 PM</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Own Equipment Question - Standard Cleaning Only */}
                    {serviceType === "Residential" && cleaningType === "Standard Cleaning" && (
                      <div>
                        <label className="block text-sm font-semibold mb-1">Will You Be Providing Your Own Cleaning Equipment?</label>
                        <p className="text-xs text-gray-500 mb-2">Select &quot;Yes&quot; to receive a £10 discount on your service</p>
                        <select 
                          name="ownEquipment" 
                          value={ownEquipment}
                          onChange={(e) => setOwnEquipment(e.target.value)}
                          required 
                          className="w-full border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes - I will provide my own equipment (£10 discount)</option>
                          <option value="No">No - Please bring cleaning equipment</option>
                        </select>
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

                    {/* Promo Code - Residential Only */}
                    {serviceType === "Residential" && (
                      <div>
                        <label className="block text-sm font-semibold mb-1">Promo Code</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter promo code"
                            disabled={!!appliedPromo}
                            className="flex-1 border border-input bg-background p-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                          {appliedPromo ? (
                            <Button type="button" variant="outline" onClick={removePromoCode}>
                              Remove
                            </Button>
                          ) : (
                            <Button type="button" variant="outline" onClick={applyPromoCode}>
                              Apply
                            </Button>
                          )}
                        </div>
                        {promoError && (
                          <p className="text-sm text-red-500 mt-1">{promoError}</p>
                        )}
                        {appliedPromo && (
                          <p className="text-sm text-green-600 mt-1">
                            {appliedPromo.description} - £{appliedPromo.discount} off applied!
                          </p>
                        )}
                      </div>
                    )}

                    {/* Order Summary - Residential Only */}
                    {serviceType === "Residential" && priceBreakdown && priceBreakdown.total > 0 && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          {priceBreakdown.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start text-sm">
                              <span className="flex flex-col">
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
                                {item.discount && (
                                  <span className="text-xs text-green-600">{item.discount}</span>
                                )}
                              </span>
                              <span>£{item.price}</span>
                            </div>
                          ))}
                          {appliedPromo && (
                            <div className="flex justify-between items-center text-sm text-green-600">
                              <span>Promo: {appliedPromo.code}</span>
                              <span>-£{appliedPromo.discount}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span className="text-lg text-blue-600">£{finalTotal}</span>
                          </div>
                        </div>
                        <input type="hidden" name="totalPrice" value={finalTotal} />
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

                    {/* reCAPTCHA */}
                    {serviceType && (
                      <div className="flex justify-center">
                        <ReCAPTCHA
                          sitekey={recaptchaSiteKey}
                          onChange={onRecaptchaChange}
                        />
                      </div>
                    )}

                    {/* Submit */}
                    {serviceType && (
                      <>
                        <Button type="submit" disabled={isSubmitting || !recaptchaToken} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
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
      )}

      <Footer />
    </div>
  )
}
