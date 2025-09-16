-- Create database for B roll Bakes
CREATE DATABASE IF NOT EXISTS broll_bakes;
USE broll_bakes;

-- Table for contact form messages
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    delivery_address TEXT
);

-- Table for products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for blog posts
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, category, price, description, image_url) VALUES
('Crispy Samosas', 'pastries', 15.00, 'Fresh samosas made with authentic spices and premium ingredients', 'img/samosa.jpg'),
('Strawberry Cake', 'cakes', 45.00, 'Delicious strawberry cake with fresh cream', 'img/strawberry-cake.jpg'),
('Chocolate Cake', 'cakes', 40.00, 'Rich chocolate cake with chocolate ganache', 'img/chocolate-cake.jpg'),
('Vanilla Cake', 'cakes', 40.00, 'Classic vanilla cake with buttercream frosting', 'img/vanilla-cake.jpg'),
('Spring Rolls', 'pastries', 12.00, 'Crispy spring rolls with vegetables', 'img/spring-rolls.jpg'),
('Meat Pies', 'pastries', 18.00, 'Savory meat pies with seasoned beef filling', 'img/meat-pies.jpg'),
('Wedding Cake', 'wedding', 150.00, 'Custom wedding cakes for your special day', 'img/wedding-cake.jpg'),
('Fruit Tarts', 'tarts', 17.00, 'Fresh fruit tarts with pastry cream', 'img/fruit-tarts.jpg');

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, image_url) VALUES
('The Art of Perfect Pastry Making', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Discover the secrets behind our perfect pastries and the techniques that make them special.', 'img/c1.jpeg'),
('Our Signature Cakes: A Journey of Flavors', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Explore our range of signature cakes and the inspiration behind each unique flavor.', 'img/c2.jpeg'),
('Behind the Scenes: A Day at B roll Bakes', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'Take a peek behind the scenes and see how we create our delicious pastries and cakes daily.', 'img/c3.jpeg');