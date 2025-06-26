-- ------------------------
-- Airports
-- ------------------------
INSERT INTO airports (code, name, city, country) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'India'),
('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India'),
('BLR', 'Kempegowda International Airport', 'Bangalore', 'India'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'India'),
('MAA', 'Chennai International Airport', 'Chennai', 'India'),
('CCU', 'Netaji Subhas Chandra Bose International Airport', 'Kolkata', 'India'),
('PNQ', 'Pune International Airport', 'Pune', 'India'),
('GOI', 'Goa International Airport', 'Goa', 'India'),
('JAI', 'Jaipur International Airport', 'Jaipur', 'India'),
('AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad', 'India');

-- ------------------------
-- Airlines
-- ------------------------
INSERT INTO airlines (name, iata_code, country) VALUES
('Air India', 'AI', 'India'),
('IndiGo', '6E', 'India'),
('Vistara', 'UK', 'India');

-- ------------------------
-- Flights
-- ------------------------
INSERT INTO flights (flight_number, airline_id, source_airport_id, destination_airport_id, aircraft_type, departure_time, arrival_time, base_price, total_seats, available_seats) VALUES
('AI101', 1, 1, 2, 'Airbus A320', '2024-07-01T06:00:00', '2024-07-01T08:00:00', 5500, 180, 180),
('AI102', 1, 2, 1, 'Airbus A320', '2024-07-01T18:00:00', '2024-07-01T20:00:00', 5500, 180, 180),
('6E301', 2, 3, 4, 'Airbus A321', '2024-07-02T09:30:00', '2024-07-02T11:00:00', 4500, 180, 180),
('6E302', 2, 4, 3, 'Airbus A321', '2024-07-02T17:00:00', '2024-07-02T18:30:00', 4500, 180, 180),
('UK501', 3, 5, 6, 'Boeing 737', '2024-07-03T06:15:00', '2024-07-03T08:45:00', 6000, 160, 160),
('UK502', 3, 6, 5, 'Boeing 737', '2024-07-03T19:00:00', '2024-07-03T21:30:00', 6000, 160, 160),
('6E303', 2, 7, 8, 'Airbus A320', '2024-07-04T10:00:00', '2024-07-04T12:00:00', 4000, 180, 180),
('AI103', 1, 9, 10, 'Boeing 737', '2024-07-05T15:00:00', '2024-07-05T17:30:00', 6200, 160, 160),
('6E304', 2, 1, 3, 'Airbus A321', '2024-07-06T08:00:00', '2024-07-06T10:00:00', 4800, 180, 180),
('UK503', 3, 2, 4, 'Boeing 737', '2024-07-06T14:00:00', '2024-07-06T16:00:00', 5200, 160, 160);

-- ------------------------
-- Hotels
-- ------------------------
INSERT INTO hotels (name, city, country, star_rating, amenities, check_in_time, check_out_time) VALUES
('Taj Palace', 'New Delhi', 'India', 5, '["WiFi", "Pool", "Gym", "Spa"]', '14:00', '12:00'),
('The Oberoi', 'Mumbai', 'India', 5, '["WiFi", "Spa", "Gym", "Breakfast"]', '14:00', '12:00'),
('Le Meridien', 'Bangalore', 'India', 4, '["WiFi", "Pool", "Restaurant"]', '14:00', '12:00'),
('ITC Grand Chola', 'Chennai', 'India', 5, '["WiFi", "Spa", "Bar"]', '13:00', '11:00'),
('Vivanta', 'Goa', 'India', 4, '["WiFi", "Pool", "Beach Access"]', '15:00', '12:00');

-- ------------------------
-- Hotel Rooms
-- ------------------------
INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, max_occupancy, total_rooms, available_rooms, amenities) VALUES
(1, 'Single', 5000, 1, 10, 10, '["WiFi", "TV"]'),
(1, 'Double', 7500, 2, 15, 15, '["WiFi", "TV", "Mini Bar"]'),
(2, 'Suite', 12000, 3, 5, 5, '["WiFi", "Jacuzzi", "Butler Service"]'),
(3, 'Double', 6500, 2, 12, 12, '["WiFi", "TV"]'),
(3, 'Suite', 10000, 3, 8, 8, '["WiFi", "TV", "Living Area"]'),
(4, 'Single', 4000, 1, 10, 10, '["WiFi"]'),
(4, 'Double', 7000, 2, 14, 14, '["WiFi", "Mini Bar"]'),
(5, 'Suite', 9500, 3, 7, 7, '["WiFi", "Beach View", "TV"]'),
(5, 'Double', 6000, 2, 10, 10, '["WiFi", "TV", "Pool View"]'),
(2, 'Single', 5500, 1, 6, 6, '["WiFi"]');

-- ------------------------
-- Holiday Packages
-- ------------------------
INSERT INTO holiday_packages (name, duration, destinations, inclusions, highlights, price_per_person, group_size_limit, images) VALUES
('Golden Triangle Tour', '5 Days / 4 Nights', '["Delhi", "Agra", "Jaipur"]', '["Accommodation", "Daily Breakfast", "Sightseeing", "Transfers"]', '["Taj Mahal", "Amber Fort", "India Gate"]', 25000, 10, '["img1.jpg", "img2.jpg"]'),
('Goa Beach Escape', '4 Days / 3 Nights', '["Goa"]', '["Hotel", "Breakfast", "Beach Activities"]', '["Baga Beach", "Dolphin Watching"]', 18000, 8, '["goa1.jpg", "goa2.jpg"]'),
('South India Delight', '6 Days / 5 Nights', '["Chennai", "Mahabalipuram", "Pondicherry"]', '["Stay", "Meals", "Transport"]', '["Temples", "Beaches", "Auroville"]', 22000, 12, '["south1.jpg", "south2.jpg"]');
