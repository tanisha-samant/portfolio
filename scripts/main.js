// Global Variables
let currentTheme = localStorage.getItem('theme') || 'light';

// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const header = document.querySelector('.header');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNavigation();
    initScrollEffects();
    initSmoothScrolling();
    // Initialize animations immediately
    setTimeout(() => {
        initAnimations();
        initIntersectionObserver();
    }, 100);
});

// Theme Management
function initTheme() {
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// Navigation Management
function initNavigation() {
    // Mobile menu toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('.nav-mobile .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!event.target.closest('.header')) {
                closeMobileMenu();
            }
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (mobileNav) {
        const isActive = mobileNav.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    if (mobileNav && mobileMenuToggle) {
        mobileNav.classList.add('active');
        mobileMenuToggle.classList.add('active');
        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenu() {
    if (mobileNav && mobileMenuToggle) {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Scroll Effects
function initScrollEffects() {
    window.addEventListener('scroll', debouncedScrollHandler);
}

// FIXED: Initialize animations properly
function initAnimations() {
    // Set initial animation states
    const sections = document.querySelectorAll('.section-animate');
    const cards = document.querySelectorAll('.card-animate');
    const techIcons = document.querySelectorAll('.tech-icon-animate');
    
    // Only hide elements if intersection observer is supported
    if ('IntersectionObserver' in window) {
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        techIcons.forEach(icon => {
            icon.style.opacity = '0';
            icon.style.transform = 'translateY(20px)';
        });
    }
    // If no intersection observer, elements stay visible
}

// Enhanced Intersection Observer with staggered animations
function initIntersectionObserver() {
    // Only run if intersection observer is supported
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported, keeping all content visible');
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Section observer with immediate animation
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Card observer with staggered animation
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger card animations
                const cards = entry.target.closest('section').querySelectorAll('.card-animate');
                const cardIndex = Array.from(cards).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, cardIndex * 100); // 100ms delay between cards
                
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Tech icon observer with staggered animation
    const techIconObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger tech icon animations
                const container = entry.target.closest('.tech-icons');
                if (container) {
                    const icons = container.querySelectorAll('.tech-icon-animate');
                    const iconIndex = Array.from(icons).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, iconIndex * 50); // 50ms delay between icons
                } else {
                    entry.target.classList.add('animate-in');
                }
                
                techIconObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const sections = document.querySelectorAll('.section-animate');
    const cards = document.querySelectorAll('.card-animate');
    const techIcons = document.querySelectorAll('.tech-icon-animate');
    
    sections.forEach(el => sectionObserver.observe(el));
    cards.forEach(el => cardObserver.observe(el));
    techIcons.forEach(el => techIconObserver.observe(el));
    
    // Add special animations for text elements
    const fadeElements = document.querySelectorAll('.fade-in-up, .scale-in, .slide-in-left, .slide-in-right');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(el => fadeObserver.observe(el));
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"], button[onclick*="scrollToSection"]');
    
    navLinks.forEach(link => {
        if (link.tagName === 'A') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    closeMobileMenu();
                }
            });
        }
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    // Close mobile menu first
    closeMobileMenu();
    
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = section.offsetTop - headerHeight;
        
        // Small delay to allow menu to close before scrolling
        setTimeout(() => {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }, 100);
    }
}

function openProject(url) {
    window.open(url, '_blank');
}

function downloadResume() {
    // Open resume in new tab for viewing (not downloading)
    const resumeUrl = 'https://drive.google.com/file/d/1YM8oCccXMnRC5G_Rs1P0ez9lM_DGatql/view';
    window.open(resumeUrl, '_blank');
    
    // Show toast notification
    showToast('Resume opened in new tab!', 'success');
}

// Enhanced email functionality for better compatibility
function openEmailClient() {
    try {
        const subject = encodeURIComponent('Hello from your portfolio');
        const body = encodeURIComponent('Hi Tanisha,\n\nI visited your portfolio and would like to connect.\n\nBest regards,');
        const emailUrl = `mailto:tanishasamant24@gmail.com?subject=${subject}&body=${body}`;
        
        // Try creating a link element and clicking it for better compatibility
        const link = document.createElement('a');
        link.href = emailUrl;
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success toast
        showToast('Opening email client...', 'success');
    } catch (error) {
        // Fallback to simple mailto
        window.location.href = 'mailto:tanishasamant24@gmail.com';
        showToast('Opening email client...', 'success');
    }
}

// Enhanced Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6b7280'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        animation: slideIn 0.3s ease-out forwards;
        position: relative;
        z-index: 1001;
        font-size: 14px;
        font-weight: 500;
    `;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // ESC key closes mobile menu
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Enter or Space on buttons
    if ((event.key === 'Enter' || event.key === ' ') && event.target.tagName === 'BUTTON') {
        event.preventDefault();
        event.target.click();
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(function() {
    const scrollY = window.scrollY;
    
    if (header) {
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 10);

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('btn-primary')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('btn-primary')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Enhanced social link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // Could show user-friendly error message here
});

// Copy to clipboard utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!', 'success');
    }, function(err) {
        showToast('Failed to copy', 'error');
    });
}

// Add loading state management
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
    } else {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Enhanced scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    let scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollY > 500) {
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scrollTopBtn';
            scrollTopBtn.innerHTML = '↑';
            scrollTopBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: var(--color-primary);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 20px;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
            `;
            scrollTopBtn.onclick = scrollToTop;
            document.body.appendChild(scrollTopBtn);
        }
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.transform = 'translateY(0)';
    } else if (scrollTopBtn) {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(20px)';
    }
});

// Ensure content is visible on page load
window.addEventListener('load', function() {
    // Force visibility of all sections if animations aren't working
    setTimeout(() => {
        const hiddenElements = document.querySelectorAll('.section-animate, .card-animate, .tech-icon-animate');
        hiddenElements.forEach(element => {
            if (window.getComputedStyle(element).opacity === '0') {
                element.classList.add('animate-in');
            }
        });
    }, 500);
});

// Add manual animation trigger for sections that might be missed
function triggerAnimation(element) {
    if (element && !element.classList.contains('animate-in')) {
        element.classList.add('animate-in');
    }
}

// Manual fallback: Show content after 1 second if still hidden
setTimeout(() => {
    const sections = document.querySelectorAll('.section-animate');
    const cards = document.querySelectorAll('.card-animate');
    const techIcons = document.querySelectorAll('.tech-icon-animate');
    
    sections.forEach(element => {
        if (window.getComputedStyle(element).opacity === '0') {
            element.classList.add('animate-in');
        }
    });
    
    cards.forEach(element => {
        if (window.getComputedStyle(element).opacity === '0') {
            element.classList.add('animate-in');
        }
    });
    
    techIcons.forEach(element => {
        if (window.getComputedStyle(element).opacity === '0') {
            element.classList.add('animate-in');
        }
    });
}, 1000);

// Add a function to manually trigger animations for debugging
function showAllAnimations() {
    const allAnimatedElements = document.querySelectorAll('.section-animate, .card-animate, .tech-icon-animate');
    allAnimatedElements.forEach(element => {
        element.classList.add('animate-in');
    });
}

// Call showAllAnimations if user scrolls past hero section and animations haven't triggered
let hasTriggeredFallback = false;
window.addEventListener('scroll', function() {
    if (!hasTriggeredFallback && window.scrollY > window.innerHeight * 0.5) {
        const hiddenElements = document.querySelectorAll('.section-animate:not(.animate-in), .card-animate:not(.animate-in), .tech-icon-animate:not(.animate-in)');
        if (hiddenElements.length > 0) {
            console.log('Triggering fallback animations');
            showAllAnimations();
            hasTriggeredFallback = true;
        }
    }
});
