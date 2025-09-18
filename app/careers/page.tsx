import type { Metadata } from "next"
import CareersPageClient from "./CareersPageClient"

export const metadata: Metadata = {
  title: "Join Our Team - Home2Work Cleaning | Career Opportunities",
  description:
    "Join the Home2Work Cleaning team! We're hiring professional cleaners and supervisors. Competitive pay, flexible schedules, and a supportive work environment.",
  keywords:
    "cleaning jobs, cleaner positions, Home2Work Cleaning careers, cleaning service employment, Manchester cleaning jobs",
}

export default function CareersPage() {
  return <CareersPageClient />
}
