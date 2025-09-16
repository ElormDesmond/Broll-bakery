# Quick Setup Commands for Kali Linux

# Make the install script executable
chmod +x install.sh

# Method 1: Run the automated installation script
./install.sh

# OR Method 2: Manual installation step by step

# 1. Install packages
sudo apt update
sudo apt install apache2 mariadb-server php php-mysql php-mbstring

# 2. Start services  
sudo systemctl start apache2 mariadb
sudo systemctl enable apache2 mariadb

# 3. Secure MariaDB (set root password)
sudo mysql_secure_installation

# 4. Create database (enter root password when prompted)
sudo mysql -u root -p
# Then run these SQL commands:
# CREATE DATABASE broll_bakes;
# CREATE USER 'broll_user'@'localhost' IDENTIFIED BY 'broll_password123';
# GRANT ALL PRIVILEGES ON broll_bakes.* TO 'broll_user'@'localhost';
# FLUSH PRIVILEGES;
# EXIT;

# 5. Import database schema
mysql -u broll_user -pbroll_password123 broll_bakes < database/schema.sql

# 6. Copy to web directory
sudo cp -r . /var/www/html/broll-bakes/
sudo chown -R www-data:www-data /var/www/html/broll-bakes/
sudo chmod -R 755 /var/www/html/broll-bakes/

# 7. Enable PHP modules
sudo phpenmod mysqli
sudo systemctl restart apache2

# 8. Test the installation
# Visit: http://localhost/broll-bakes/