import React from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Building, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Our Services - Home2work Cleaning | Residential & Commercial Cleaning",
  description:
    "Comprehensive cleaning services including residential house cleaning, commercial office cleaning, deep cleaning, and specialized cleaning solutions.",
  keywords: "house cleaning, office cleaning, deep cleaning, commercial cleaning services, residential cleaning",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white py-24 px-4"
        style={{ backgroundImage: "url('/services-6195125.jpg')" }}
      >
        <div className="bg-black/50 p-8 rounded-lg text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-white">
            Discover our full range of residential and commercial cleaning
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Residential Services */}
            <Card className="border-2 border-blue-100">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Residential Cleaning</CardTitle>
                <p className="text-gray-600 mt-2">Professional home cleaning services for busy families</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Regular House Cleaning</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Weekly, bi-weekly, or monthly service</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Kitchen and bathroom deep cleaning</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Dusting, vacuuming, and mopping</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Trash removal and bed making</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Deep Cleaning Services</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Detailed cleaning of all surfaces</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Inside appliances and cabinets</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Baseboards and window sills</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Light fixtures and ceiling fans</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Specialized Services</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Move-in/move-out cleaning</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Post-construction cleanup</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Holiday and event preparation</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>One-time cleaning services</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Commercial Services */}
            <Card className="border-2 border-green-100">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">Commercial Cleaning</CardTitle>
                <p className="text-gray-600 mt-2">Professional workplace cleaning for businesses of all sizes</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Office Cleaning</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Daily, weekly, or monthly service</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Workstation and common area cleaning</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Restroom sanitization</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Floor care and maintenance</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Retail & Medical</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Retail space maintenance</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Medical facility cleaning</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Specialized sanitization protocols</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Compliance with health standards</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Janitorial Services</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Complete facility maintenance</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Supply restocking</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Waste management</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" /><span>Emergency cleaning services</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Contact us today for a free consultation and customized cleaning plan</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Book Service</Link>
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
  );
}
