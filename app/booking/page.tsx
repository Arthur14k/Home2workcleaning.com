import BookingPageClient from "./BookingPageClient"

export default function BookingPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Book a Cleaning</h1>

      <BookingPageClient />
    </main>
  )
}
