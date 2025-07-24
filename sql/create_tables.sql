-- SQL script to create all necessary tables for the Edubridge application
-- This script should be executed in the Supabase SQL Editor

-- Create profiles table
-- Stores user profile information linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    course_of_study TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can do all on profiles" 
ON profiles FOR ALL 
USING (auth.role() = 'service_role');

-- Create categories table
-- Stores book categories/subjects
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name)
);

-- Create RLS policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view categories
CREATE POLICY "Anyone can view categories" 
ON categories FOR SELECT 
USING (true);

-- Allow service role to manage categories
CREATE POLICY "Service role can do all on categories" 
ON categories FOR ALL 
USING (auth.role() = 'service_role');

-- Create books table
-- Stores textbook listings
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    edition TEXT,
    publisher TEXT,
    publication_year TEXT,
    category_id UUID REFERENCES categories(id),
    selling_price DECIMAL(10, 2) NOT NULL,
    condition_rating TEXT NOT NULL,
    description TEXT,
    availability_status TEXT NOT NULL DEFAULT 'Available',
    seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for books
CREATE INDEX IF NOT EXISTS books_seller_id_idx ON books(seller_id);
CREATE INDEX IF NOT EXISTS books_category_id_idx ON books(category_id);
CREATE INDEX IF NOT EXISTS books_availability_status_idx ON books(availability_status);

-- Create RLS policies for books
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view available books
CREATE POLICY "Anyone can view available books" 
ON books FOR SELECT 
USING (true);

-- Allow users to manage their own book listings
CREATE POLICY "Users can insert their own books" 
ON books FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = seller_id));

CREATE POLICY "Users can update their own books" 
ON books FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = seller_id));

CREATE POLICY "Users can delete their own books" 
ON books FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = seller_id));

-- Allow service role to manage all books
CREATE POLICY "Service role can do all on books" 
ON books FOR ALL 
USING (auth.role() = 'service_role');

-- Create cart table
-- Stores items in a user's shopping cart
CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create indexes for cart
CREATE INDEX IF NOT EXISTS cart_user_id_idx ON cart(user_id);

-- Create RLS policies for cart
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own cart
CREATE POLICY "Users can view their own cart" 
ON cart FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = cart.user_id));

CREATE POLICY "Users can insert into their own cart" 
ON cart FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can delete from their own cart" 
ON cart FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

-- Allow service role to manage all cart items
CREATE POLICY "Service role can do all on cart" 
ON cart FOR ALL 
USING (auth.role() = 'service_role');

-- Create purchases table
-- Stores completed purchases
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed'
);

-- Create indexes for purchases
CREATE INDEX IF NOT EXISTS purchases_buyer_id_idx ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS purchases_book_id_idx ON purchases(book_id);

-- Create RLS policies for purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own purchases
CREATE POLICY "Users can view their own purchases" 
ON purchases FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = buyer_id));

-- Allow users to insert their own purchases
CREATE POLICY "Users can insert their own purchases" 
ON purchases FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = buyer_id));

-- Allow service role to manage all purchases
CREATE POLICY "Service role can do all on purchases" 
ON purchases FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update book availability status after purchase
CREATE OR REPLACE FUNCTION update_book_status_after_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET availability_status = 'Sold'
    WHERE id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update book status after purchase
CREATE TRIGGER after_purchase_insert
AFTER INSERT ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_book_status_after_purchase();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();