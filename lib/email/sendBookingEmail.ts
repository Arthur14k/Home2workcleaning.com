import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendBookingEmail({
  service_type,
  first_name,
  last_name,
  email,
  phone,
  address,
  city,
  state,
  zip,
  property_size,
  number_of_rooms,
  cleaning_type,
  cleaning_frequency,
  preferred_date,
  preferred_time,
  special_instructions,
}: {
  service_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_size: string;
  number_of_rooms: string;
  cleaning_type: string;
  cleaning_frequency: string;
  preferred_date: string;
  preferred_time: string;
  special_instructions: string;
}) {
  const msg = {
    to: 'contact@home2workcleaning.com',
    from: 'contact@home2workcleaning.com',
    subject: 'New Booking Request',
    text: `
      Name: ${first_name} ${last_name}
      Email: ${email}
      Phone: ${phone}
      Service Type: ${service_type}
      Address: ${address}, ${city}, ${state}, ${zip}
      Property Size: ${property_size}
      Rooms: ${number_of_rooms}
      Cleaning Type: ${cleaning_type}
      Frequency: ${cleaning_frequency}
      Preferred Date: ${preferred_date}
      Preferred Time: ${preferred_time}
      Special Instructions: ${special_instructions}
    `,
  };

  await sgMail.send(msg);
}
