CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    passport_number TEXT, -- Optional
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--ariliness

CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    iata_code TEXT UNIQUE NOT NULL, -- e.g., AI, 6E, UK
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

----airports
CREATE TABLE IF NOT EXISTS airports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,         -- e.g., DEL, BOM, BLR
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

---flights
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_id INTEGER NOT NULL,
    source_airport_id INTEGER NOT NULL,
    destination_airport_id INTEGER NOT NULL,
    aircraft_type TEXT,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    base_price REAL NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    FOREIGN KEY (source_airport_id) REFERENCES airports(id),
    FOREIGN KEY (destination_airport_id) REFERENCES airports(id)
);



CREATE TABLE IF NOT EXISTS hotel_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    room_type TEXT NOT NULL,
    price_per_night REAL NOT NULL,
    max_occupancy INTEGER NOT NULL,
    total_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    amenities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);



--hotels
CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    star_rating INTEGER,
    amenities TEXT, -- JSON string array (e.g., '["WiFi","Pool"]')
    check_in_time TEXT,
    check_out_time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--holiday_package
CREATE TABLE IF NOT EXISTS holiday_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration TEXT NOT NULL, -- e.g., "5 Days / 4 Nights"
    destinations TEXT NOT NULL, -- JSON string array of cities
    inclusions TEXT, -- JSON string
    highlights TEXT, -- JSON string
    price_per_person REAL NOT NULL,
    group_size_limit INTEGER,
    images TEXT, -- JSON string array of URLs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--flight_bookings
CREATE TABLE IF NOT EXISTS flight_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    flight_id INTEGER NOT NULL,
    booking_reference TEXT UNIQUE NOT NULL,
    journey_date TEXT NOT NULL,
    travel_class TEXT NOT NULL, -- economy/business/first
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

--hotel_bookings
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    booking_reference TEXT UNIQUE NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    rooms INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_id) REFERENCES hotel_rooms(id)
);

--package_bookings
CREATE TABLE IF NOT EXISTS package_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    booking_reference TEXT UNIQUE NOT NULL,
    travel_date TEXT NOT NULL,
    travelers_count INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES holiday_packages(id)
);

--passengers
CREATE TABLE IF NOT EXISTS passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    booking_type TEXT NOT NULL, -- flight/package
    title TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    passport_number TEXT,
    
    FOREIGN KEY (booking_id) REFERENCES flight_bookings(id)
    -- or package_bookings(id) depending on type (you’ll filter by booking_type in logic)
);

--payments
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_type TEXT NOT NULL, -- flight/hotel/package
    booking_id INTEGER NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL, -- card, UPI, etc.
    status TEXT DEFAULT 'pending',
    payment_date TEXT DEFAULT CURRENT_TIMESTAMP
);

