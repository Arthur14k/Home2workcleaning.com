import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield, Clock, Users, Sparkles, Home } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Home2work Cleaning - Professional Cleaning Services | Commercial & Residential",
  description:
    "Professional cleaning services for homes and businesses. Reliable, eco-friendly cleaning solutions with experienced staff. Book your cleaning service today.",
  keywords:
    "cleaning services, residential cleaning, commercial cleaning, professional cleaners, eco-friendly cleaning",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Homepage Hero Section with Background Image */}
<section
  className="relative bg-cover bg-center text-white py-32 px-4"
  style={{ backgroundImage: "url('/images/home-intro.jpg')" }}
>
  <div className="absolute inset-0 bg-black opacity-40" />
  <div className="relative z-10 text-center">
    <h1 className="text-5xl font-bold mb-4">Professional Cleaning Services</h1>
    <p className="text-xl">From homes to workplaces, we make every space shine</p>
  </div>
</section>

      {/* Hero Section */}
<section
  className="relative bg-cover bg-center text-white py-24 px-4"
 style={{ backgroundImage: "url('/Homepage-6195278.jpg')" }}
>
  <div className="bg-black/50 p-8 rounded-lg text-center max-w-6xl mx-auto">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
      Professional Cleaning Services You Can Trust
    </h1>
    <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
      From your home to your workplace, we deliver exceptional cleaning services with attention to detail and eco-friendly solutions.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
        <Link href="/booking">Book Now</Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href="/services">Our Services</Link>
      </Button>
    </div>
  </div>
</section>

      {/* Brand Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Home2work Cleaning?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional cleaning services that exceed your expectations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trusted & Insured</h3>
                <p className="text-gray-600">Fully licensed, bonded, and insured for your peace of mind</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                <p className="text-gray-600">
                  Safe, non-toxic cleaning products that protect your family and environment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Reliable Service</h3>
                <p className="text-gray-600">Consistent, punctual service that fits your schedule</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Experienced Team</h3>
                <p className="text-gray-600">Professional, trained staff dedicated to quality results</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Cleaning Services</h2>
            <p className="text-lg text-gray-600">Comprehensive cleaning solutions for every need</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <Home className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Residential Cleaning</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Regular house cleaning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Deep cleaning services
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Move-in/move-out cleaning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Post-construction cleanup
                  </li>
                </ul>
                <Button asChild variant="outline">
                  <Link href="/services">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Commercial Cleaning</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Office cleaning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Retail space maintenance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Medical facility cleaning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Janitorial services
                  </li>
                </ul>
                <Button asChild variant="outline">
                  <Link href="/services">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for a Spotless Space?</h2>
          <p className="text-xl mb-8">Get your free quote today and experience the Home2work difference</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Schedule Service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-blue-600 border-white hover:bg-white bg-transparent"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
