import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Customer Testimonials - Home2Work Cleaning | What Our Clients Say",
  description:
    "Read what our satisfied customers say about Home2Work Cleaning services. Real reviews from residential and commercial clients who trust us with their cleaning needs.",
  keywords:
    "cleaning service reviews, customer testimonials, cleaning company feedback, satisfied customers, professional cleaning reviews",
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Background Image */}
      <section
        className="relative py-24 px-4 bg-no-repeat min-h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/testimonials-hero.jpg')",
          backgroundSize: "cover", // Ensures the image covers the entire area
          backgroundPosition: "center", // Centers the image
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">What Our Customers Say</h1>
          <p className="text-xl text-white mb-8 drop-shadow-md">
            Don't just take our word for it - hear from our satisfied customers about their experience with Home2Work
            Cleaning
          </p>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-lg font-semibold text-gray-700">Google Reviews</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from our valued customers</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Review 1 - Arthy Rich */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Arthy Rich</h3>
                    <p className="text-sm text-gray-500">Google Review</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-gray-700 leading-relaxed mb-4">
                  I booked the standard cleaning service as recommended by a friend and I was very pleased with the work they did. The team was very professional and left my home spotless. I too would recommend them.
                </p>
                {/* Customer Photos */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <img 
                    src="https://lh3.googleusercontent.com/grass-cs/ANxoTn0m4IcshjY7pr1Y_artEc8_dSUeE3UlNdMdwuFIOnMCNzW_a1QrtKO1_HqkEBA1chIbby020IebDs-64nLDoXe6e0t4d348iuzQhbnNWUYp7Zl3WPhKv62r2yL432du_kRGZfXn6uqOJHFT" 
                    alt="Cleaning result - staircase" 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <img 
                    src="https://lh3.googleusercontent.com/grass-cs/ANxoTn0dyV1BqE4ZZiXvSIa6WWnmQ1Z8gmU234Q3dWimkeG_h_8gefO8cVqf06kV4NuIp36-CcwN98QEb623L0MN0ozsLNDzKHiJXd52HlVxYg3lG1rr7O5yZ_aReIUmC6ss-lh0irxlE2vnwuq8" 
                    alt="Cleaning result - storage area" 
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <img 
                    src="https://lh3.googleusercontent.com/grass-cs/ANxoTn1JglTQkWStiRHQkqK93dKZ97fDC4JxLnq9QlXxGx7vRy_2fWWe4UMD-hzrt4ySeSgjxShLAxgie_5sioZ4W21xuRxyUHYgkDxoUxZCDbiq-PhPXhCONiJVWV0HCo66MejCwC6sUr7PaGXL" 
                    alt="Cleaning result - room" 
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Review 2 - Sam Okerenta */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sam Okerenta</h3>
                    <p className="text-sm text-gray-500">Local Guide - Google Review</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-gray-700 leading-relaxed">
                  Timely and reliable service. Saved me a lot of time too
                </p>
              </CardContent>
            </Card>

            {/* Review 3 - Guy King */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    G
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Guy King</h3>
                    <p className="text-sm text-gray-500">Google Review</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-blue-200 mb-2" />
                <p className="text-gray-700 leading-relaxed">
                  Thank you for the Service, I was satisfied with the results and the staff was professional. I would definitely book again
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Leave a Review CTA */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Had a Great Experience?</h3>
              <p className="text-lg text-gray-600 mb-6">
                We&apos;d love to hear from you! Leave us a review on Google and help others discover our services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/booking">Book Your Service</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://g.page/r/CdXEOqPVDTKnEB0/review" target="_blank" rel="noopener noreferrer">Leave a Google Review</a>
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
            Join our growing list of satisfied customers and see why Home2Work Cleaning is the right choice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Book Your Service</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
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
