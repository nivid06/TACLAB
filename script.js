// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
    }
    
    lastScroll = currentScroll;
});

// ===== COUNTER ANIMATION =====
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
            
            // Add fade-in animation
            if (entry.target.classList.contains('feature-card') ||
                entry.target.classList.contains('listing-card') ||
                entry.target.classList.contains('step') ||
                entry.target.classList.contains('team-member') ||
                entry.target.classList.contains('value-card') ||
                entry.target.classList.contains('testimonial-card')) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    // Stats counters
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
    
    // Cards and elements
    document.querySelectorAll('.feature-card, .listing-card, .step, .team-member, .value-card, .testimonial-card').forEach(element => {
        observer.observe(element);
    });
    
    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 200 * index);
    });
});

// ===== FILTER FUNCTIONALITY (Listing Page) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const listingCards = document.querySelectorAll('.listing-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter cards
        listingCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== BUTTON CLICK EFFECTS =====
document.querySelectorAll('.btn, .filter-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-cube');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== TYPING EFFECT FOR HERO (Optional Enhancement) =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && !sessionStorage.getItem('heroAnimated')) {
    const originalText = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';
    
    let charIndex = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalText;
    const text = tempDiv.textContent || tempDiv.innerText;
    
    const typeWriter = () => {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);
            const currentHTML = heroTitle.innerHTML;
            
            if (originalText.includes('<span') && charIndex === text.indexOf('Ideas')) {
                heroTitle.innerHTML = currentHTML + '<span class="gradient-text">' + char;
            } else if (charIndex === text.indexOf('Ideas') + 5) {
                heroTitle.innerHTML = currentHTML + char + '</span>';
            } else {
                heroTitle.innerHTML = currentHTML + char;
            }
            
            charIndex++;
            setTimeout(typeWriter, 50);
        } else {
            heroTitle.innerHTML = originalText;
            sessionStorage.setItem('heroAnimated', 'true');
        }
    };
    
    setTimeout(typeWriter, 500);
}

// ===== TOAST NOTIFICATION FOR BUTTONS =====
const createToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Add slide animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

// Add toast to service buttons
document.querySelectorAll('.listing-card .btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = button.closest('.listing-card').querySelector('h3').textContent;
        createToast(`🎉 Great choice! ${serviceName} added to your inquiry.`);
    });
});

// ===== MOBILE MENU TOGGLE =====
// Add hamburger menu for mobile
if (window.innerWidth <= 768) {
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar .container');
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.innerHTML = '☰';
    hamburger.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--dark);
    `;
    
    if (window.innerWidth <= 768) {
        hamburger.style.display = 'block';
        navbar.appendChild(hamburger);
        
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        createToast('🎮 Konami Code Activated! You are a true maker!');
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🖨️ Tac Lab loaded successfully! Turning imagination into reality.');

