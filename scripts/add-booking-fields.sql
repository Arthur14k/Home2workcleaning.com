-- Add new columns for enhanced booking form
-- Residential fields
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS bathrooms varchar;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS addons text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price decimal(10,2);

-- Commercial fields
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS business_type varchar;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS floors varchar;
