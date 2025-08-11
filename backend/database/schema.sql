-- Database schema for Bill Splitting App

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip members (many-to-many relationship)
CREATE TABLE IF NOT EXISTS trip_members (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, user_id)
);

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    split_type VARCHAR(20) DEFAULT 'equal', -- 'equal', 'percentage', 'custom'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bill splits (who owes what for each bill)
CREATE TABLE IF NOT EXISTS bill_splits (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bill_id, user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_trip_id ON bills(trip_id);
CREATE INDEX IF NOT EXISTS idx_bills_paid_by ON bills(paid_by);
CREATE INDEX IF NOT EXISTS idx_bill_splits_bill_id ON bill_splits(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_splits_user_id ON bill_splits(user_id); 