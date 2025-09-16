// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.initializeEvents();
        this.updateCartDisplay();
    }

    initializeEvents() {
        // Cart toggle button
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }

        // Close cart button
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }

        // Cart overlay
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e));
        });
    }

    addToCart(event) {
        const button = event.target;
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const category = button.getAttribute('data-category');

        // Check if item already exists
        const existingItemIndex = this.items.findIndex(item => item.name === name);
        
        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: price,
                category: category,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddedToCartFeedback(button);
    }

    removeFromCart(index) {
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        // Update cart items display
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.items.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>GH₵ ${item.price.toFixed(2)} each</p>
                            <div class="quantity-controls">
                                <button onclick="cart.updateQuantity(${index}, ${item.quantity - 1})" class="qty-btn">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button onclick="cart.updateQuantity(${index}, ${item.quantity + 1})" class="qty-btn">+</button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-price">GH₵ ${(item.price * item.quantity).toFixed(2)}</div>
                            <button onclick="cart.removeFromCart(${index})" class="remove-item">×</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }

        // Update order summary if on order page
        this.updateOrderSummary(total);
    }

    updateOrderSummary(total) {
        const orderSummaryCartItems = document.querySelector('.order-summary .cart-items');
        const orderSummaryTotal = document.querySelector('.order-summary .total');

        if (orderSummaryCartItems) {
            if (this.items.length === 0) {
                orderSummaryCartItems.innerHTML = '<p>Your cart is empty</p>';
            } else {
                orderSummaryCartItems.innerHTML = this.items.map(item => `
                    <div class="summary-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
            }
        }

        if (orderSummaryTotal) {
            const deliveryFee = total >= 50 ? 0 : 5;
            const finalTotal = total + deliveryFee;
            orderSummaryTotal.innerHTML = `
                <div class="subtotal">Subtotal: GH₵ ${total.toFixed(2)}</div>
                <div class="delivery-fee">Delivery: GH₵ ${deliveryFee.toFixed(2)}</div>
                <div class="final-total"><strong>Total: GH₵ ${finalTotal.toFixed(2)}</strong></div>
            `;
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('show');
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('show');
        }
    }

    showAddedToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
});

// Add additional styles for cart quantity controls
const style = document.createElement('style');
style.textContent = `
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }
    
    .qty-btn {
        background: #ECA86B;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    }
    
    .qty-btn:hover {
        background: #d4956a;
    }
    
    .quantity {
        font-weight: bold;
        min-width: 20px;
        text-align: center;
    }
    
    .cart-item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
    }
    
    .remove-item {
        background: #dc3545;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
    
    .remove-item:hover {
        background: #c82333;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }
    
    .subtotal, .delivery-fee {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }
    
    .final-total {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-top: 2px solid #ECA86B;
        margin-top: 10px;
    }
`;
document.head.appendChild(style);