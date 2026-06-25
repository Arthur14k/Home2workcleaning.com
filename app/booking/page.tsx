import type { Metadata } from "next"
import BookingPageClient from "./BookingPageClient"

export const metadata: Metadata = {
  title: "Book Your Service - Home2Work Cleaning | Schedule Professional Cleaning",
  description:
    "Book your professional cleaning service with Home2Work Cleaning. Easy online booking for residential and commercial cleaning services. Get confirmation within 2 hours.",
  keywords: "book cleaning service, schedule cleaning, professional cleaners booking, Home2Work Cleaning appointment",
}

export default function BookingPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
  return <BookingPageClient recaptchaSiteKey={recaptchaSiteKey} />
}
