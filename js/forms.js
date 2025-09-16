// Enhanced Contact Form Handler with better error handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactMessage');
    
    // Check for URL parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('contact') === 'success') {
        showMessage('Thank you for your message! We will get back to you soon.', 'success');
    } else if (urlParams.get('contact') === 'error') {
        const errorMsg = urlParams.get('msg') || 'There was an error sending your message.';
        showMessage(errorMsg, 'error');
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Enhanced fetch with better error handling
            fetch('process_contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage(data.message, 'success');
                    contactForm.reset();
                    
                    // Add confetti effect for success
                    if (typeof confetti !== 'undefined') {
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Contact form error:', error);
                showMessage('Sorry, there was a connection error. Please try again or contact us directly.', 'error');
            })
            .finally(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
        });
    }
    
    function showMessage(message, type) {
        if (contactMessage) {
            contactMessage.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
            `;
            contactMessage.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
            contactMessage.style.display = 'block';
            
            // Smooth scroll to message
            contactMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Auto hide after 8 seconds for success, 10 for errors
            const hideTimeout = type === 'success' ? 8000 : 10000;
            setTimeout(() => {
                contactMessage.style.opacity = '0';
                setTimeout(() => {
                    contactMessage.style.display = 'none';
                    contactMessage.style.opacity = '1';
                }, 500);
            }, hideTimeout);
        }
    }
});

// Order Form Handler (frontend-only)
class OrderManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.updateCartDisplay();
        this.saveCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) this.removeFromCart(productId);
            else {
                this.updateCartDisplay();
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `\n                    <div class="cart-item">\n                        <h5>${item.name}</h5>\n                        <p>GH₵ ${item.price.toFixed(2)} x ${item.quantity}</p>\n                        <div class="quantity-controls">\n                            <button onclick="orderManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>\n                            <span>${item.quantity}</span>\n                            <button onclick="orderManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>\n                        </div>\n                        <button onclick="orderManager.removeFromCart(${item.id})" class="remove-item">Remove</button>\n                    </div>\n                `).join('');
            }
        }
        if (cartTotal) cartTotal.textContent = this.getTotal().toFixed(2);
    }

    saveCart() { localStorage.setItem('cart', JSON.stringify(this.cart)); }

    showCartNotification() { /* ...existing code... */ }

    // Submit order by opening WhatsApp with order summary (frontend-only)
    submitOrder(customerData = {}) {
        if (this.cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        let text = 'Order from B roll Bakes:%0A';
        this.cart.forEach(item => {
            text += `• ${item.name} x${item.quantity} - GH₵ ${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        text += `%0ATotal: GH₵ ${this.getTotal().toFixed(2)}%0A`;
        if (customerData.name) text += `%0AName: ${customerData.name}`;
        if (customerData.phone) text += `%0APhone: ${customerData.phone}`;
        if (customerData.address) text += `%0AAddress: ${customerData.address}`;
        const phone = '233555123456';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');

        // Clear cart after initiating contact
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize order manager
const orderManager = new OrderManager();

// Disable remote product loading — use static HTML product listings instead
async function loadProducts() {
    // No backend. Products are loaded from static HTML.
    return [];
}