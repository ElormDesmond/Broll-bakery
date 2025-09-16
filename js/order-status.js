// Order Status Tracking System
class OrderStatusTracker {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const searchForm = document.getElementById('orderSearchForm');
        if (!searchForm) return;
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchOrder();
        });
    }
    
    async searchOrder() {
        const orderReference = document.getElementById('orderReference') ? document.getElementById('orderReference').value.trim() : '';
        const errorDisplay = document.getElementById('errorDisplay');
        if (!orderReference) {
            if (errorDisplay) { errorDisplay.style.display = 'block'; document.getElementById('errorMessage').textContent = 'Order tracking is disabled for this frontend-only site.'; }
            return;
        }

        // Tracking/lookup disabled — instruct user to contact owner
        if (errorDisplay) {
            errorDisplay.style.display = 'block';
            document.getElementById('errorMessage').textContent = 'Order tracking is not available. Please contact the owner on the phone/WhatsApp listed on the site.';
        }
    }
    
    // ...existing methods like displayOrderItems/updateTimeline are no-ops when tracking is disabled...
}

// Initialize tracker safely
try { new OrderStatusTracker(); } catch (e) { console.warn('OrderStatusTracker not initialized:', e); }

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new OrderStatusTracker();
    
    // Check if order ID is provided in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    if (orderId) {
        document.getElementById('orderReference').value = orderId;
        // Auto-search if order ID is provided
        setTimeout(() => {
            document.getElementById('orderSearchForm').dispatchEvent(new Event('submit'));
        }, 500);
    }
});