// Dark Mode functionality
class DarkModeToggle {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.initializeEvents();
        this.applyTheme();
    }

    initializeEvents() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
        this.updateToggleIcon();
    }

    applyTheme() {
        const body = document.body;
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // Modern animated sun/moon SVG with better contrast
            darkModeToggle.innerHTML = this.isDarkMode
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#ffd700"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/>
                  </svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#666" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`;
        }
    }
}

// Go Up Button
function addGoUpButton() {
    if (document.getElementById('goUpBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'goUpBtn';
    btn.className = 'go-up-btn';
    btn.title = 'Go to Top';
    btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 20V8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M8 14l6-6 6 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 200 ? 'flex' : 'none';
    });
}

// Initialize dark mode and go up button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.darkMode = new DarkModeToggle();
    addGoUpButton();
});

// Additional dark mode styles for better visibility and accessibility
const darkModeStyles = document.createElement('style');
darkModeStyles.textContent = `
    /* Override any remaining light sections */
    body.dark-mode * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    /* Ensure all white backgrounds are replaced */
    body.dark-mode .bg-light,
    body.dark-mode .bg-white {
        background: #3a3a3a !important;
        color: #f5f5f5 !important;
    }
    
    /* Text contrast improvements */
    body.dark-mode .text-dark {
        color: #f5f5f5 !important;
    }
    
    body.dark-mode .text-secondary {
        color: #e0e0e0 !important;
    }
    
    /* Button improvements for color blindness */
    body.dark-mode .btn-primary {
        background: #ff8a50 !important;
        border-color: #ff8a50 !important;
        color: #1a1a1a !important;
    }
    
    body.dark-mode .btn-success {
        background: #4caf50 !important;
        border-color: #4caf50 !important;
        color: #fff !important;
    }
    
    body.dark-mode .btn-warning {
        background: #ffd700 !important;
        border-color: #ffd700 !important;
        color: #1a1a1a !important;
    }
    
    body.dark-mode .btn-danger {
        background: #f44336 !important;
        border-color: #f44336 !important;
        color: #fff !important;
    }
    
    /* Improved visibility for form labels */
    body.dark-mode label {
        color: #ffd700 !important;
        font-weight: 600;
    }
    
    /* Better contrast for placeholder text */
    body.dark-mode ::placeholder {
        color: #bbb !important;
        opacity: 1;
    }
    
    /* Dropdown menus */
    body.dark-mode .dropdown-menu {
        background: #3a3a3a !important;
        border: 1px solid #555 !important;
    }
    
    body.dark-mode .dropdown-item {
        color: #f5f5f5 !important;
    }
    
    body.dark-mode .dropdown-item:hover {
        background: #555 !important;
        color: #ffd700 !important;
    }
    
    /* Alert improvements */
    body.dark-mode .alert {
        border: 1px solid #555 !important;
    }
    
    body.dark-mode .alert-success {
        background: #2d5a2d !important;
        color: #4caf50 !important;
        border-color: #4caf50 !important;
    }
    
    body.dark-mode .alert-warning {
        background: #5a5a2d !important;
        color: #ffd700 !important;
        border-color: #ffd700 !important;
    }
    
    body.dark-mode .alert-danger {
        background: #5a2d2d !important;
        color: #f44336 !important;
        border-color: #f44336 !important;
    }
    
    body.dark-mode .alert-info {
        background: #2d4a5a !important;
        color: #66b3ff !important;
        border-color: #66b3ff !important;
    }
`;
document.head.appendChild(darkModeStyles);