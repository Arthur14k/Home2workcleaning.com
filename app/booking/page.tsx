'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BookingPage() {
  const [form, setForm] = useState({
    serviceType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    propertySize: '',
    numberOfRooms: '',
    cleaningType: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/send-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Something went wrong');
      alert('Booking submitted successfully!');
      setForm({
        serviceType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
        propertySize: '',
        numberOfRooms: '',
        cleaningType: '',
        message: '',
      });
    } catch (err) {
      alert('Failed to send booking. Please try again later.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Schedule Your Service</h1>
      <p className="text-muted-foreground mb-6">Fill out the details below to book your cleaning appointment</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="mb-2 block">Service Type *</Label>
          <RadioGroup
            name="serviceType"
            className="flex gap-4"
            value={form.serviceType}
            onValueChange={(val) => handleSelectChange('serviceType', val)}
          >
            <div className="border p-4 rounded-md w-full">
              <RadioGroupItem value="Residential" id="residential" />
              <Label htmlFor="residential" className="ml-2">
                Residential <span className="block text-sm text-muted-foreground">Home cleaning services</span>
              </Label>
            </div>
            <div className="border p-4 rounded-md w-full">
              <RadioGroupItem value="Commercial" id="commercial" />
              <Label htmlFor="commercial" className="ml-2">
                Commercial <span className="block text-sm text-muted-foreground">Office & business cleaning</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label>First Name *</Label>
              <Input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email Address *</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label>Property Address *</Label>
              <Input name="address" value={form.address} onChange={handleChange} required />
            </div>
            <div>
              <Label>City *</Label>
              <Input name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div>
              <Label>Postcode *</Label>
              <Input name="postcode" value={form.postcode} onChange={handleChange} required />
            </div>
            <div>
              <Label>Property Size (sq ft)</Label>
              <Input type="number" name="propertySize" value={form.propertySize} onChange={handleChange} />
            </div>
            <div>
              <Label>Number of Rooms</Label>
              <Select value={form.numberOfRooms} onValueChange={(val) => handleSelectChange('numberOfRooms', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rooms" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-4">Service Details</h2>
          <div className="mt-2">
            <Label>Cleaning Type *</Label>
            <Select value={form.cleaningType} onValueChange={(val) => handleSelectChange('cleaningType', val)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select cleaning type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Deep Clean">Deep Clean</SelectItem>
                <SelectItem value="Move In/Out">Move In/Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Additional Notes</Label>
          <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Any specific instructions?" />
        </div>

        <Button type="submit">Submit Booking</Button>
      </form>
    </div>
  );
}
