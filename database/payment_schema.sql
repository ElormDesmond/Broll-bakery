-- Add payment-related columns to orders table
ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash',
ADD COLUMN payment_reference VARCHAR(255) NULL,
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
ADD COLUMN mobile_provider VARCHAR(50) NULL;

-- Create payment_logs table for transaction tracking
CREATE TABLE IF NOT EXISTS payment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_reference VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    provider_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payment_reference (payment_reference),
    INDEX idx_order_id (order_id)
);

-- Create payment_methods table for configuration
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(100) NOT NULL,
    method_code VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default payment methods
INSERT INTO payment_methods (method_name, method_code, is_active, configuration) VALUES
('Card Payment (Paystack)', 'card', TRUE, '{"provider": "paystack", "supports": ["visa", "mastercard", "verve"]}'),
('MTN Mobile Money', 'mtn_momo', TRUE, '{"provider": "paystack", "network": "mtn"}'),
('Telecel Cash', 'telecel_cash', TRUE, '{"provider": "paystack", "network": "telecel"}'),
('AirtelTigo Money', 'airteltigo_money', TRUE, '{"provider": "paystack", "network": "airteltigo"}'),
('Cash on Delivery', 'cash', TRUE, '{"provider": "manual"}');

-- Create payment_config table for API keys and settings
CREATE TABLE IF NOT EXISTS payment_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default payment configuration (Note: Replace with your actual keys)
INSERT INTO payment_config (config_key, config_value, is_encrypted) VALUES
('paystack_public_key', 'pk_test_your_public_key_here', FALSE),
('paystack_secret_key', 'sk_test_your_secret_key_here', TRUE),
('payment_currency', 'GHS', FALSE),
('minimum_order_amount', '5.00', FALSE),
('delivery_fee', '10.00', FALSE),
('free_delivery_threshold', '50.00', FALSE);

-- Update existing orders to have default payment status
UPDATE orders SET payment_status = 'pending' WHERE payment_status IS NULL;
UPDATE orders SET payment_method = 'cash' WHERE payment_method IS NULL;