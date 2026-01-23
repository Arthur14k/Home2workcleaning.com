import type { Metadata } from "next"
import Image from "next/image"
import BookingPageClient from "./BookingPageClient"

export const metadata: Metadata = {
  title: "Book Your Service - Home2Work Cleaning | Schedule Professional Cleaning",
  description:
    "Book your professional cleaning service with Home2Work Cleaning. Easy online booking for residential and commercial cleaning services. Get confirmation within 2 hours.",
  keywords:
    "book cleaning service, schedule cleaning, professional cleaners booking, Home2Work Cleaning appointment",
}

export default function BookingPage() {
  return (
    <main className="w-full">
      {/* HERO SECTION */}
      <section className="relative bg-[#0A2540] text-white py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Your Cleaning Service
            </h1>
            <p className="text-lg text-gray-200">
              Professional, reliable cleaning for homes and businesses.
              Book online in minutes and get confirmation within 2 hours.
            </p>
          </div>

          <div className="hidden md:block">
            <Image
              src="/booking-hero.jpg"
              alt="Professional cleaning service"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Book Online</h3>
              <p className="text-gray-600">
                Choose your service, date and time using our simple booking form.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. We Confirm</h3>
              <p className="text-gray-600">
                We review your request and confirm your booking within 2 hours.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. We Clean</h3>
              <p className="text-gray-600">
                Our professional cleaners arrive fully equipped and ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What To Expect
          </h2>

          <ul className="max-w-3xl mx-auto space-y-4 text-gray-700">
            <li>✔ Trusted, background-checked cleaners</li>
            <li>✔ Eco-friendly cleaning products available</li>
            <li>✔ Flexible scheduling</li>
            <li>✔ No long-term contracts</li>
          </ul>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <BookingPageClient />
        </div>
      </section>

      {/* NEED HELP */}
      <section className="py-16 bg-[#0A2540] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="mb-6">
            Have questions or special requirements? We’re happy to help.
          </p>
          <p className="font-semibold">
            📧 contact@home2workcleaning.com <br />
            📞 020 0000 0000
          </p>
        </div>
      </section>
    </main>
  )
}
