import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us - Home2Work Cleaning | Get Your Free Quote Today",
  description:
    "Get in touch with Home2Work Cleaning for professional cleaning services. Contact us for a free consultation and personalized cleaning quote.",
  keywords: "contact cleaning service, cleaning quote, professional cleaners contact, Home2Work Cleaning contact",
}

export default function ContactPage() {
  return <ContactPageClient />
}
