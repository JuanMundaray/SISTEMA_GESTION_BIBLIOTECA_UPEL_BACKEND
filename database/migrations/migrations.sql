-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE SCHEMA IF NOT EXISTS upel_library;
-- 1. TABLE users (All university members)
CREATE TABLE upel_library.users (
    id SERIAL PRIMARY KEY,
    ci VARCHAR(9) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'professor', 'admin')),
    registration_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 2. TABLE academic_programs (Faculties/degrees)
CREATE TABLE academic_programs (
    program_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Computer Science"
    faculty VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. JOIN TABLE: users_programs (Many-to-many relationship)
CREATE TABLE users_programs (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    program_id INT REFERENCES academic_programs(program_id),
    PRIMARY KEY (user_id, program_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE books (Main catalog)
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    publication_year INT,
    category VARCHAR(50) NOT NULL, -- e.g., "Engineering", "Medicine"
    edition VARCHAR(20),
    is_available BOOLEAN DEFAULT TRUE,
    cover_url VARCHAR(255), -- Link to image/PDF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE copies (Physical instances of books)
CREATE TABLE copies (
    copy_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(book_id) ON DELETE CASCADE,
    barcode VARCHAR(50) UNIQUE NOT NULL, -- e.g., "LIB-2023-001"
    location VARCHAR(50) NOT NULL, -- e.g., "Shelf A2"
    status VARCHAR(20) CHECK (status IN ('available', 'checked_out', 'under_maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLE checkouts (Loan transactions)
CREATE TABLE checkouts (
    checkout_id SERIAL PRIMARY KEY,
    copy_id INT REFERENCES copies(copy_id),
    user_id INT REFERENCES users(user_id),
    checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL, -- Calculated based on user_type
    return_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLE holds (For unavailable books)
CREATE TABLE holds (
    hold_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(book_id),
    user_id INT REFERENCES users(user_id),
    hold_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP, -- e.g., 48 hours later
    status VARCHAR(20) CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLE spaces (Study rooms/equipment)
CREATE TABLE spaces (
    space_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "Study Room A"
    capacity INT NOT NULL,
    type VARCHAR(30) CHECK (type IN ('study_room', 'auditorium', 'cubicle')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLE space_reservations (Corrected typo from previous version)
CREATE TABLE space_reservations (
    reservation_id SERIAL PRIMARY KEY,
    space_id INT REFERENCES spaces(space_id),
    user_id INT REFERENCES users(user_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TABLE fines
CREATE TABLE fines (
    fine_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    checkout_id INT REFERENCES checkouts(checkout_id),
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(100) NOT NULL, -- e.g., "Damage", "Loss", "Late return"
    issue_date DATE DEFAULT CURRENT_DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABLE digital_resources (e-books, articles)
CREATE TABLE digital_resources (
    resource_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    url VARCHAR(255) NOT NULL,
    type VARCHAR(30) CHECK (type IN ('ebook', 'article', 'thesis')),
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_users_email ON users(ci);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_checkouts_user ON checkouts(user_id);
CREATE INDEX idx_checkouts_status ON checkouts(status);
CREATE INDEX idx_copies_status ON copies(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_books_timestamp
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_copies_timestamp
BEFORE UPDATE ON copies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_checkouts_timestamp
BEFORE UPDATE ON checkouts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_spaces_timestamp
BEFORE UPDATE ON spaces
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_space_reservations_timestamp
BEFORE UPDATE ON space_reservations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_fines_timestamp
BEFORE UPDATE ON fines
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_digital_resources_timestamp
BEFORE UPDATE ON digital_resources
FOR EACH ROW EXECUTE FUNCTION update_timestamp();