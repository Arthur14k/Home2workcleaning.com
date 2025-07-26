import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Customer Testimonials - Home2work Cleaning | What Our Clients Say",
  description:
    "Read what our satisfied customers say about Home2work Cleaning services. Real reviews from residential and commercial clients who trust us with their cleaning needs.",
  keywords:
    "cleaning service reviews, customer testimonials, cleaning company feedback, satisfied customers, professional cleaning reviews",
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Background Image */}
      <section
        className="relative py-24 px-4 bg-no-repeat"
        style={{
          backgroundImage: "url('/images/testimonials-hero.jpg')",
          backgroundSize: "contain", // Ensures the entire image is visible
          backgroundPosition: "center", // Centers the image
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">What Our Customers Say</h1>
          <p className="text-xl text-white mb-8 drop-shadow-md">
            Don't just take our word for it - hear from our satisfied customers about their experience with Home2work
            Cleaning
          </p>
        </div>
      </section>

      {/* Testimonials Coming Soon */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <Quote className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Customer Reviews Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're a growing business committed to providing exceptional cleaning services. As we serve more customers,
              their testimonials and reviews will be featured here to help you learn about the quality and reliability
              of our services.
            </p>
          </div>

          {/* What Customers Can Expect */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
                <p className="text-gray-600">Professional cleaning that exceeds expectations every time</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable Team</h3>
                <p className="text-gray-600">Punctual, trustworthy staff who treat your space with respect</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-semibold mb-2">Great Value</h3>
                <p className="text-gray-600">Competitive pricing for premium cleaning services</p>
              </CardContent>
            </Card>
          </div>

          {/* Review Invitation */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Be Our First Reviewer!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Experience our exceptional cleaning services and help us build our reputation by sharing your feedback.
                Your review will help other customers make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/booking">Book Your First Service</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Ask Questions First</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Review Process */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Collect Reviews</h2>
            <p className="text-lg text-gray-600">We believe in transparency and authentic customer feedback</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Service Completion</h3>
                <p className="text-gray-600">
                  After each cleaning service, we follow up with our customers to ensure satisfaction
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feedback Request</h3>
                <p className="text-gray-600">
                  We invite satisfied customers to share their experience and provide honest reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Reviews</h3>
                <p className="text-gray-600">Only genuine, verified customer reviews are featured on our website</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Customers Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">Our Commitment to Excellence</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Licensed, bonded, and fully insured</li>
                <li>• Background-checked and trained staff</li>
                <li>• Eco-friendly cleaning products</li>
                <li>• 100% satisfaction guarantee</li>
                <li>• Flexible scheduling options</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">What Sets Us Apart</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Personalized cleaning plans</li>
                <li>• Consistent, reliable service</li>
                <li>• Competitive and transparent pricing</li>
                <li>• Responsive customer support</li>
                <li>• Attention to detail in every job</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Service?</h2>
          <p className="text-xl mb-8">
            Join our growing list of satisfied customers and see why Home2work Cleaning is the right choice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Book Your Service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-blue-600 border-white hover:bg-white bg-transparent"
            >
              <Link href="/contact">Get Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
