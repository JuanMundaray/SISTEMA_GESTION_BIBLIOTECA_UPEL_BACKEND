-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE SCHEMA IF NOT EXISTS upel_library;
-- 1. TABLE users (All university members)
CREATE TABLE upel_library.users (
    user_id SERIAL PRIMARY KEY,
    ci VARCHAR(9) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    user_type_id INT NOT NULL REFERENCES upel_library.user_types(type_id),
    registration_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 2. TABLE user_types
CREATE TABLE upel_library.user_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    can_reserve_spaces BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data users_types
INSERT INTO upel_library.user_types 
(type_name, description, can_reserve_spaces)
VALUES 
('student', 'Estudiante regular', FALSE),
('professor', 'Profesor/Investigador', TRUE),
('admin', 'Administrador del sistema', TRUE);

-- 2. TABLE books (Main catalog)
CREATE TABLE upel_library.books (
    book_id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    publisher VARCHAR(100),
    publication_year INT,
    category VARCHAR(50) NOT NULL, -- e.g., "Engineering", "Medicine"
    edition VARCHAR(20),
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    cover_url VARCHAR(255), -- Link to image/PDF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE copies (Physical instances of books)
CREATE TABLE upel_library.copies (
    copy_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES upel_library.books(book_id) ON DELETE CASCADE,
    barcode VARCHAR(50) UNIQUE NOT NULL, -- e.g., "LIB-2023-001"
    location VARCHAR(50) NOT NULL, -- e.g., "Shelf A2"
    status VARCHAR(20) CHECK (status IN ('available', 'checked_out', 'under_maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE checkouts (Loan transactions)
CREATE TABLE upel_library.checkouts (
    checkout_id SERIAL PRIMARY KEY,
    copy_id INT REFERENCES copies(copy_id),
    user_id INT REFERENCES users(user_id),
    checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLE holds (For unavailable books)
CREATE TABLE upel_library.holds (
    hold_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(book_id),
    user_id INT REFERENCES users(user_id),
    hold_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP, -- e.g., 48 hours later
    status VARCHAR(20) CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLE spaces (Study rooms/equipment)
CREATE TABLE upel_library.spaces (
    space_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "Study Room A"
    capacity INT NOT NULL,
    type VARCHAR(30) CHECK (type IN ('study_room', 'auditorium', 'cubicle')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLE space_reservations (Corrected typo from previous version)
CREATE TABLE upel_library.space_reservations (
    reservation_id SERIAL PRIMARY KEY,
    space_id INT REFERENCES upel_library.spaces(space_id),
    user_id INT REFERENCES upel_library.users(user_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLE fines
CREATE TABLE upel_library.fines (
    fine_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES upel_library.users(user_id),
    checkout_id INT REFERENCES upel_library.checkouts(checkout_id),
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(100) NOT NULL, -- e.g., "Damage", "Loss", "Late return"
    issue_date DATE DEFAULT CURRENT_DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLE digital_resources (e-books, articles)
CREATE TABLE upel_library.digital_resources (
    resource_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES upel_library.books(book_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    url VARCHAR(255) NOT NULL,
    type VARCHAR(30) CHECK (type IN ('ebook', 'article', 'thesis')),
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_users_ci ON upel_library.users(ci);
CREATE INDEX idx_users_email ON upel_library.users(email);
CREATE INDEX idx_books_title ON upel_library.books(title);
CREATE INDEX idx_books_author ON upel_library.books(author);
CREATE INDEX idx_checkouts_user ON upel_library.checkouts(user_id);
CREATE INDEX idx_checkouts_status ON upel_library.checkouts(status);
CREATE INDEX idx_copies_status ON upel_library.copies(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION generate_book_copy()
RETURNS TRIGGER AS $$
BEGIN
    NEW. = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
BEFORE UPDATE ON upel_library.users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_books_timestamp
BEFORE UPDATE ON upel_library.books
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_copies_timestamp
BEFORE UPDATE ON upel_library..copies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_checkouts_timestamp
BEFORE UPDATE ON upel_library.checkouts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_spaces_timestamp
BEFORE UPDATE ON upel_library.spaces
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_space_reservations_timestamp
BEFORE UPDATE ON upel_library.space_reservations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_fines_timestamp
BEFORE UPDATE ON upel_library.fines
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_digital_resources_timestamp
BEFORE UPDATE ON upel_library.digital_resources
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- View: upel_library.vw_checkouts_full
CREATE OR REPLACE VIEW upel_library.vw_checkouts_full AS
SELECT 
    c.checkout_id,
    c.copy_id,
    c.user_id,
    c.checkout_date,
    c.due_date,
    c.return_date,
    c.status,
    c.fine_amount,
    c.created_at,
    c.updated_at,
    u.ci AS user_ci,
    u.username AS user_username,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    u.email AS user_email,
    u.phone AS user_phone,
    u.user_type_id AS user_type_id,
    cp.barcode AS copy_barcode,
    cp.location AS copy_location,
    cp.status AS copy_status,
    cp.book_id AS copy_book_id,
    b.isbn AS book_isbn,
    b.title AS book_title,
    b.author AS book_author,
    b.publisher AS book_publisher,
    b.publication_year AS book_publication_year,
    b.category AS book_category,
    b.edition AS book_edition,
    b.description AS book_description,
    b.cover_url AS book_cover_url
FROM upel_library.checkouts c
JOIN upel_library.users u ON c.user_id = u.user_id
JOIN upel_library.copies cp ON c.copy_id = cp.copy_id
JOIN upel_library.books b ON cp.book_id = b.book_id;

-- View: upel_library.vw_copies_full
CREATE OR REPLACE VIEW upel_library.vw_copies_full AS
SELECT 
    cp.copy_id,
    cp.book_id,
    cp.barcode,
    cp.location,
    cp.status AS copy_status,
    cp.created_at AS copy_created_at,
    cp.updated_at AS copy_updated_at,
    b.isbn AS book_isbn,
    b.title AS book_title,
    b.author AS book_author,
    b.publisher AS book_publisher,
    b.publication_year AS book_publication_year,
    b.category AS book_category,
    b.edition AS book_edition,
    b.description AS book_description,
    b.cover_url AS book_cover_url
FROM upel_library.copies cp
JOIN upel_library.books b ON cp.book_id = b.book_id;