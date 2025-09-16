// Checkout Management System
class CheckoutManager {
    constructor() {
        this.selectedPaymentMethod = null;
        this.selectedProvider = null;
        this.orderTotal = 0;
        this.paystackHandler = null;
        this.initializeComponents();
    }
    
    initializeComponents() {
        this.loadOrderSummary();
        this.setupPaymentMethodSelection();
        this.setupProviderSelection();
        this.setupPaymentButton();
        this.setupFormValidation();
    }
    
    loadOrderSummary() {
        // Load cart items from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItemsContainer = document.getElementById('orderItems');
        let total = 0;
        
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
            return;
        }
        
        orderItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <small class="text-muted d-block">Qty: ${item.quantity}</small>
                </div>
                <div>GH₵ ${itemTotal.toFixed(2)}</div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });
        
        this.orderTotal = total;
        document.getElementById('orderTotal').textContent = total.toFixed(2);
        
        // Update payment button text
        this.updatePaymentButton();
    }
    
    setupPaymentMethodSelection() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        const mobileProviders = document.getElementById('mobileProviders');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove previous selections
                paymentMethods.forEach(m => m.classList.remove('selected'));
                
                // Select current method
                method.classList.add('selected');
                this.selectedPaymentMethod = method.dataset.method;
                
                // Show/hide mobile providers
                if (this.selectedPaymentMethod === 'mobile') {
                    mobileProviders.classList.add('show');
                    this.selectedProvider = null; // Reset provider selection
                } else {
                    mobileProviders.classList.remove('show');
                    this.selectedProvider = null;
                }
                
                this.updatePaymentButton();
            });
        });
    }
    
    setupProviderSelection() {
        const providers = document.querySelectorAll('.provider');
        
        providers.forEach(provider => {
            provider.addEventListener('click', () => {
                // Remove previous selections
                providers.forEach(p => p.classList.remove('selected'));
                
                // Select current provider
                provider.classList.add('selected');
                this.selectedProvider = provider.dataset.provider;
                
                this.updatePaymentButton();
            });
        });
    }
    
    setupPaymentButton() {
        const payButton = document.getElementById('payButton');
        
        payButton.addEventListener('click', () => {
            if (this.validateForm()) {
                this.processPayment();
            }
        });
    }
    
    updatePaymentButton() {
        const payButton = document.getElementById('payButton');
        const payButtonText = document.getElementById('payButtonText');
        
        if (!this.selectedPaymentMethod) {
            payButton.disabled = true;
            payButtonText.innerHTML = 'Select Payment Method';
        } else if (this.selectedPaymentMethod === 'mobile' && !this.selectedProvider) {
            payButton.disabled = true;
            payButtonText.innerHTML = 'Select Mobile Money Provider';
        } else {
            payButton.disabled = false;
            payButtonText.innerHTML = `Pay GH₵ ${this.orderTotal.toFixed(2)}`;
        }
    }
    
    setupFormValidation() {
        const form = document.getElementById('checkoutForm');
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (field.name === 'phone') {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }
    
    validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('input[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields correctly.');
        }
        
        return isValid;
    }
    
    processPayment() {
        const payButton = document.getElementById('payButton');
        const payButtonText = document.getElementById('payButtonText');
        const originalText = payButtonText.innerHTML;
        
        // Show loading state
        payButton.disabled = true;
        payButtonText.innerHTML = '<span class="loading-spinner"></span> Processing...';
        
        // Get form data
        const formData = new FormData(document.getElementById('checkoutForm'));
        const customerData = {
            customer_name: formData.get('customer_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('delivery_address'),
            notes: formData.get('notes')
        };
        
        if (this.selectedPaymentMethod === 'card') {
            this.processCardPayment(customerData);
        } else if (this.selectedPaymentMethod === 'mobile') {
            this.processMobileMoneyPayment(customerData);
        }
    }
    
    processCardPayment(customerData) {
        // Generate unique reference
        const reference = 'BR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const handler = PaystackPop.setup({
            key: 'pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', // Test public key
            email: customerData.email,
            amount: this.orderTotal * 100, // Convert to kobo
            currency: 'GHS',
            ref: reference,
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: customerData.customer_name
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: customerData.phone
                    }
                ]
            },
            callback: (response) => {
                this.verifyPayment(response.reference, customerData);
            },
            onClose: () => {
                // Reset button state
                const payButton = document.getElementById('payButton');
                const payButtonText = document.getElementById('payButtonText');
                payButton.disabled = false;
                payButtonText.innerHTML = `Pay GH₵ ${this.orderTotal.toFixed(2)}`;
            }
        });
        
        handler.openIframe();
    }
    
    processMobileMoneyPayment(customerData) {
        // For mobile money, we still use Paystack but specify the channel
        const reference = 'BR_MOMO_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const handler = PaystackPop.setup({
            key: 'pk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', // Test public key
            email: customerData.email,
            amount: this.orderTotal * 100,
            currency: 'GHS',
            ref: reference,
            channels: ['mobile_money'],
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: customerData.customer_name
                    },
                    {
                        display_name: "Phone",
                        variable_name: "phone",
                        value: customerData.phone
                    },
                    {
                        display_name: "Mobile Money Provider",
                        variable_name: "momo_provider",
                        value: this.selectedProvider
                    }
                ]
            },
            callback: (response) => {
                this.verifyPayment(response.reference, customerData);
            },
            onClose: () => {
                // Reset button state
                const payButton = document.getElementById('payButton');
                const payButtonText = document.getElementById('payButtonText');
                payButton.disabled = false;
                payButtonText.innerHTML = `Pay GH₵ ${this.orderTotal.toFixed(2)}`;
            }
        });
        
        handler.openIframe();
    }
    
    async verifyPayment(reference, customerData) {
        try {
            const response = await fetch('process_payment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reference: reference,
                    customer_data: customerData,
                    cart_items: JSON.parse(localStorage.getItem('cart') || '[]'),
                    total_amount: this.orderTotal,
                    payment_method: this.selectedPaymentMethod,
                    mobile_provider: this.selectedProvider
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Clear cart
                localStorage.removeItem('cart');
                
                // Show success modal
                document.getElementById('orderIdDisplay').textContent = result.order_id;
                $('#successModal').modal('show');
            } else {
                alert('Payment verification failed: ' + result.message);
                // Reset button state
                const payButton = document.getElementById('payButton');
                const payButtonText = document.getElementById('payButtonText');
                payButton.disabled = false;
                payButtonText.innerHTML = `Pay GH₵ ${this.orderTotal.toFixed(2)}`;
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            alert('There was an error verifying your payment. Please contact support.');
            
            // Reset button state
            const payButton = document.getElementById('payButton');
            const payButtonText = document.getElementById('payButtonText');
            payButton.disabled = false;
            payButtonText.innerHTML = `Pay GH₵ ${this.orderTotal.toFixed(2)}`;
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CheckoutManager();
    
    // Add custom CSS for webkit compatibility
    const style = document.createElement('style');
    style.textContent = `
        .payment-method.card i {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .payment-method.mobile i {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .empty-state i {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    `;
    document.head.appendChild(style);
});