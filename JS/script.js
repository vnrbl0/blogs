// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initContactForm();
    initBlogFiltering();
    initAnimations();
    initNewsletterForm();
    initInteractiveElements();
    initSearchFunctionality();
    initAuthentication();
    initComments();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Also toggle nav actions for mobile
            const navActions = document.querySelector('.nav-actions');
            if (navActions) {
                navActions.classList.toggle('active');
            }
            
            // Animate hamburger icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const navActions = document.querySelector('.nav-actions');
                if (navActions) {
                    navActions.classList.remove('active');
                }
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            const navActions = document.querySelector('.nav-actions');
            if (!navMenu.contains(event.target) && 
                !navToggle.contains(event.target) && 
                (!navActions || !navActions.contains(event.target))) {
                navMenu.classList.remove('active');
                if (navActions) {
                    navActions.classList.remove('active');
                }
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Active navigation highlighting based on current page
    highlightActiveNavigation();
}

// Highlight active navigation
function highlightActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validate form
            if (validateContactForm(formObject)) {
                // Simulate form submission
                submitContactForm(formObject);
            }
        });
    }
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject === '') {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showFormStatus(errors.join(', '), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit contact form with email notification
async function submitContactForm(data) {
    const formStatus = document.getElementById('formStatus');
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    
    // Show loading state
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
    }
    
    try {
        // Send email notification
        const emailSent = await sendContactEmailNotification(data);
        
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset button
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitButton.disabled = false;
        }
        
        // Show success message
        if (emailSent) {
            showFormStatus('Thank you for your message! Your email has been sent and I\'ll get back to you within 24 hours.', 'success');
        } else {
            showFormStatus('Thank you for your message! Your form has been submitted successfully.', 'success');
        }
        
        // Reset form
        document.getElementById('contactForm').reset();
        
    } catch (error) {
        console.error('Error submitting contact form:', error);
        
        // Reset button
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitButton.disabled = false;
        }
        
        showFormStatus('Thank you for your message! Your form has been submitted successfully.', 'success');
        
        // Reset form anyway
        document.getElementById('contactForm').reset();
    }
}

// Show form status
function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
}

// Blog filtering functionality
function initBlogFiltering() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    const blogPosts = document.querySelectorAll('.blog-post, .ranking-item');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            
            // Update active link
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            filterPosts(category, blogPosts);
        });
    });
}

// Filter posts by category
function filterPosts(category, posts) {
    posts.forEach(post => {
        const postCategory = post.querySelector('.post-category');
        
        if (category === 'all') {
            post.style.display = 'block';
            fadeInElement(post);
        } else if (postCategory && postCategory.classList.contains(category)) {
            post.style.display = 'block';
            fadeInElement(post);
        } else {
            fadeOutElement(post);
        }
    });
}

// Animation utilities
function fadeInElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 10);
}

function fadeOutElement(element) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .post-card, .ranking-item, .contact-card, .faq-item, .expertise-item, .trending-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });
    
    // Add CSS for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                // Simulate newsletter subscription
                const button = form.querySelector('button');
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                        form.reset();
                    }, 2000);
                }, 1500);
            } else {
                // Show error for invalid email
                const input = form.querySelector('input[type="email"]');
                input.style.borderColor = '#dc3545';
                
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        });
    });
}

// Interactive elements functionality
function initInteractiveElements() {
    // Like and share buttons
    initPostActions();
    
    // Search functionality (if implemented)
    initSearch();
    
    // Theme toggle (if implemented)
    initThemeToggle();
    
    // Back to top button
    initBackToTop();
    
    // Reading progress bar (for blog posts)
    initReadingProgress();
    
    // Copy to clipboard for code blocks
    initCodeCopy();
}

// Post actions (like and share)
function initPostActions() {
    const likeButtons = document.querySelectorAll('.btn-like');
    const shareButtons = document.querySelectorAll('.btn-share');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const countSpan = this.querySelector('span') || this;
            
            // Toggle liked state
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('liked');
                
                // Increment count
                const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
                countSpan.innerHTML = countSpan.innerHTML.replace(/\d+/, currentCount + 1);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('liked');
                
                // Decrement count
                const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
                countSpan.innerHTML = countSpan.innerHTML.replace(/\d+/, currentCount - 1);
            }
        });
    });
    
    shareButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const url = window.location.href;
            const title = document.title;
            
            if (navigator.share) {
                try {
                    await navigator.share({ title, url });
                } catch (error) {
                    fallbackShare(url, title);
                }
            } else {
                fallbackShare(url, title);
            }
        });
    });
}

// Fallback share functionality
function fallbackShare(url, title) {
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copied to clipboard!');
    });
}

// Simple search functionality
function initSearch() {
    const searchInput = document.querySelector('#search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const query = this.value.toLowerCase().trim();
                searchContent(query);
            }, 300);
        });
    }
}

// Search content
function searchContent(query) {
    const searchableElements = document.querySelectorAll('.post-card, .blog-post, .ranking-item');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        
        if (query === '' || text.includes(query)) {
            element.style.display = 'block';
            fadeInElement(element);
        } else {
            fadeOutElement(element);
        }
    });
}

// Theme toggle functionality (placeholder)
function initThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Theme toggle functionality can be implemented here
            // For now, just show a toast
            showToast('Theme toggle coming soon!');
        });
    }
}

// Back to top button
function initBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-gold);
            color: var(--primary-black);
            border: none;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }
        
        .back-to-top:hover {
            background: var(--tertiary-gold);
            transform: translateY(-2px);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 1rem;
                right: 1rem;
                width: 2.5rem;
                height: 2.5rem;
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(backToTop);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Reading progress bar
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-gold), var(--tertiary-gold));
            z-index: 1001;
            transform-origin: left;
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
        progressBar.style.width = '100%';
    });
}

// Copy to clipboard for code blocks
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.className = 'copy-code-btn';
        copyButton.setAttribute('aria-label', 'Copy code');
        
        // Position button
        block.style.position = 'relative';
        copyButton.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--tertiary-black);
            color: var(--primary-gold);
            border: 1px solid var(--primary-gold);
            border-radius: 0.25rem;
            padding: 0.5rem;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s ease;
        `;
        
        copyButton.addEventListener('mouseover', function() {
            this.style.opacity = '1';
            this.style.background = 'var(--primary-gold)';
            this.style.color = 'var(--primary-black)';
        });
        
        copyButton.addEventListener('mouseout', function() {
            this.style.opacity = '0.7';
            this.style.background = 'var(--tertiary-black)';
            this.style.color = 'var(--primary-gold)';
        });
        
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                this.innerHTML = '<i class="fas fa-check"></i>';
                showToast('Code copied to clipboard!');
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }).catch(() => {
                showToast('Failed to copy code');
            });
        });
        
        block.appendChild(copyButton);
    });
}

// Toast notification system
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--primary-gold);
            color: var(--primary-black);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            z-index: 1002;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }
        
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        @media (max-width: 768px) {
            .toast {
                top: 1rem;
                right: 1rem;
                left: 1rem;
                text-align: center;
            }
        }
    `;
    
    // Add to head if not exists
    if (!document.querySelector('style[data-toast]')) {
        style.setAttribute('data-toast', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.log('Image failed to load:', e.target.src);
    }
}, true);

// Accessibility improvements
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    
    const skipStyle = document.createElement('style');
    skipStyle.textContent = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-gold);
            color: var(--primary-black);
            padding: 8px;
            text-decoration: none;
            border-radius: 0 0 4px 4px;
            z-index: 1003;
            font-weight: 600;
        }
        
        .skip-link:focus {
            top: 0;
        }
    `;
    document.head.appendChild(skipStyle);
    document.body.prepend(skipLink);
    
    // Add main content ID
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main-content';
    }
}

// Initialize accessibility features
initAccessibility();

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    
    if (!searchInput || !searchDropdown) return;
    
    let searchTimeout;
    let isSearchOpen = false;
    
    // Blog posts data for search
    const blogPosts = [
        {
            title: "The Art of SQL Injection: Detection and Prevention",
            excerpt: "SQL injection remains one of the most critical security vulnerabilities in web applications. Despite being well-documented for over two decades, it continues to plague applications worldwide.",
            category: "Security",
            url: "sql-injection-prevention.html",
            date: "January 15, 2024",
            readTime: "8 min read"
        },
        {
            title: "Building Secure APIs: A Developer's Checklist",
            excerpt: "APIs are the backbone of modern applications, serving as bridges between different services and systems. However, they're also prime targets for attackers.",
            category: "Development",
            url: "secure-api-checklist.html",
            date: "January 10, 2024",
            readTime: "6 min read"
        },
        {
            title: "My First Bug Bounty: Lessons Learned",
            excerpt: "Breaking into bug bounty hunting can be intimidating, especially when the field seems dominated by experienced researchers. Here's my complete journey from zero knowledge to my first successful submission.",
            category: "Bug Hunting",
            url: "first-bug-bounty.html",
            date: "January 5, 2024",
            readTime: "10 min read"
        },
        {
            title: "Modern JavaScript Security: Avoiding Common Pitfalls",
            excerpt: "JavaScript has evolved tremendously over the past decade, but with new features and capabilities come new security considerations.",
            category: "Development",
            url: "javascript-security.html",
            date: "December 28, 2023",
            readTime: "7 min read"
        },
        {
            title: "Advanced XSS Techniques: Beyond the Basics",
            excerpt: "Once you've mastered basic XSS detection, it's time to explore advanced techniques that can bypass modern protections and discover hidden vulnerabilities.",
            category: "Bug Hunting",
            url: "#",
            date: "December 20, 2023",
            readTime: "12 min read"
        },
        {
            title: "Container Security: Docker Best Practices",
            excerpt: "Containers have revolutionized application deployment, but they've also introduced new security challenges. Learn how to secure your Docker containers from development to production.",
            category: "Security",
            url: "#",
            date: "December 15, 2023",
            readTime: "9 min read"
        }
    ];
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            hideSearchDropdown();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            hideSearchDropdown();
        }
    });
    
    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideSearchDropdown();
            this.blur();
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            navigateSearchResults(event.key === 'ArrowDown' ? 1 : -1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const selectedResult = searchDropdown.querySelector('.search-result.selected');
            if (selectedResult) {
                const link = selectedResult.querySelector('a') || selectedResult;
                if (link.href) {
                    window.location.href = link.href;
                }
            }
        }
    });
    
    function performSearch(query) {
        const results = blogPosts.filter(post => {
            const searchableText = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
            return searchableText.includes(query);
        });
        
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchDropdown.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No posts found for "${escapeHtml(query)}"</p>
                </div>
            `;
        } else {
            searchDropdown.innerHTML = results.map(post => `
                <div class="search-result" onclick="window.location.href='${post.url}'">
                    <div class="search-result-title">${highlightText(post.title, query)}</div>
                    <div class="search-result-excerpt">${highlightText(post.excerpt.substring(0, 120) + '...', query)}</div>
                    <div class="search-result-meta">
                        <span class="search-result-category">${post.category}</span>
                        <span>${post.date}</span>
                        <span>${post.readTime}</span>
                    </div>
                </div>
            `).join('');
        }
        
        showSearchDropdown();
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function showSearchDropdown() {
        searchDropdown.classList.add('active');
        isSearchOpen = true;
    }
    
    function hideSearchDropdown() {
        searchDropdown.classList.remove('active');
        isSearchOpen = false;
        // Remove selection from results
        const selected = searchDropdown.querySelector('.search-result.selected');
        if (selected) selected.classList.remove('selected');
    }
    
    function navigateSearchResults(direction) {
        const results = searchDropdown.querySelectorAll('.search-result');
        if (results.length === 0) return;
        
        const selected = searchDropdown.querySelector('.search-result.selected');
        let newIndex = 0;
        
        if (selected) {
            const currentIndex = Array.from(results).indexOf(selected);
            newIndex = currentIndex + direction;
            selected.classList.remove('selected');
        }
        
        // Wrap around
        if (newIndex < 0) newIndex = results.length - 1;
        if (newIndex >= results.length) newIndex = 0;
        
        results[newIndex].classList.add('selected');
    }
}

// Authentication Functionality
function initAuthentication() {
    // Only initialize on login page
    if (!document.getElementById('loginForm')) return;
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const successMessage = document.getElementById('successMessage');
    
    // Form switching
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const showForgotPasswordBtn = document.getElementById('showForgotPassword');
    const backToLoginBtn = document.getElementById('backToLogin');
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('signup');
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    if (showForgotPasswordBtn) {
        showForgotPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('forgot');
        });
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    // Password toggle functionality
    initPasswordToggles();
    
    // Form submissions
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
    
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }
    
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }
    
    if (forgotPasswordFormElement) {
        forgotPasswordFormElement.addEventListener('submit', handleForgotPassword);
    }
    
    // Social login handlers
    initSocialLogin();
    
    function switchForm(formType) {
        // Hide all forms
        [loginForm, signupForm, forgotPasswordForm, successMessage].forEach(form => {
            if (form) form.classList.add('hidden');
        });
        
        // Show selected form
        switch(formType) {
            case 'login':
                if (loginForm) loginForm.classList.remove('hidden');
                break;
            case 'signup':
                if (signupForm) signupForm.classList.remove('hidden');
                break;
            case 'forgot':
                if (forgotPasswordForm) forgotPasswordForm.classList.remove('hidden');
                break;
            case 'success':
                if (successMessage) successMessage.classList.remove('hidden');
                break;
        }
    }
    
    function initPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Simulate successful login
            document.getElementById('successText').textContent = 
                `Welcome back! You have successfully signed in as ${email}.`;
            switchForm('success');
            
            // Store user session (in real app, this would be handled by backend)
            localStorage.setItem('userSession', JSON.stringify({
                email: email,
                loginTime: new Date().toISOString(),
                remember: remember
            }));
            
        }, 2000);
    }
    
    function handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const terms = formData.get('terms');
        
        // Validation
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 3000);
            return;
        }
        
        if (!validatePassword(password)) {
            showToast('Password does not meet requirements', 3000);
            return;
        }
        
        if (!terms) {
            showToast('You must accept the Terms of Service', 3000);
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Simulate successful signup
            document.getElementById('successText').textContent = 
                `Welcome to VNR, ${firstName}! Your account has been created successfully.`;
            switchForm('success');
            
            // Store user session
            localStorage.setItem('userSession', JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                loginTime: new Date().toISOString()
            }));
            
        }, 2500);
    }
    
    function handleForgotPassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            document.getElementById('successText').textContent = 
                `Password reset link has been sent to ${email}. Please check your inbox and follow the instructions.`;
            switchForm('success');
            
        }, 2000);
    }
    
    function validatePassword(password) {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return minLength && hasUppercase && hasNumber && hasSpecial;
    }
    
    function initSocialLogin() {
        // Google login
        const googleBtns = document.querySelectorAll('.google-btn');
        googleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Google authentication would be implemented here', 3000);
                // In real app: window.location.href = '/auth/google';
            });
        });
        
        // GitHub login
        const githubBtns = document.querySelectorAll('.github-btn');
        githubBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('GitHub authentication would be implemented here', 3000);
                // In real app: window.location.href = '/auth/github';
            });
        });
        
        // Twitter/X login
        const twitterBtns = document.querySelectorAll('.twitter-btn');
        twitterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('X (Twitter) authentication would be implemented here', 3000);
                // In real app: window.location.href = '/auth/twitter';
            });
        });
    }
}

// Comments System
function initComments() {
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('commentsList');
    const commentsCount = document.getElementById('commentsCount');
    
    if (!commentForm || !commentsContainer) return;
    
    // Load existing comments for this post
    loadComments();
    
    // Handle comment form submission
    commentForm.addEventListener('submit', handleCommentSubmission);
    
    // Auto-generate avatar initials
    const nameInput = document.getElementById('commentName');
    const avatarElement = document.querySelector('.comment-avatar');
    
    if (nameInput && avatarElement) {
        nameInput.addEventListener('input', function() {
            const name = this.value.trim();
            avatarElement.textContent = generateInitials(name);
        });
    }
}

function handleCommentSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const commentData = {
        id: generateCommentId(),
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        likes: 0,
        postId: getCurrentPostId()
    };
    
    // Validate form
    if (!validateComment(commentData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.comment-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Save comment
        saveComment(commentData);
        
        // Add comment to display
        addCommentToDOM(commentData);
        
        // Update comments count
        updateCommentsCount();
        
        // Send email notification
        sendCommentEmailNotification(commentData);
        
        // Reset form
        e.target.reset();
        
        // Reset avatar
        const avatarElement = document.querySelector('.comment-avatar');
        if (avatarElement) {
            avatarElement.textContent = '?';
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showToast('Comment posted successfully!', 3000);
        
        // Scroll to new comment
        setTimeout(() => {
            const newComment = document.querySelector(`[data-comment-id="${commentData.id}"]`);
            if (newComment) {
                newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newComment.classList.add('highlight');
                setTimeout(() => newComment.classList.remove('highlight'), 2000);
            }
        }, 100);
        
    }, 1500);
}

function validateComment(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Comment must be at least 10 characters long');
    }
    
    if (data.message && data.message.length > 1000) {
        errors.push('Comment must be less than 1000 characters');
    }
    
    if (errors.length > 0) {
        showToast(errors[0], 4000);
        return false;
    }
    
    return true;
}

function loadComments() {
    const postId = getCurrentPostId();
    const comments = getCommentsForPost(postId);
    const commentsContainer = document.getElementById('commentsList');
    const commentsEmpty = document.querySelector('.comments-empty');
    
    if (comments.length === 0) {
        if (commentsEmpty) commentsEmpty.style.display = 'block';
        commentsContainer.innerHTML = '';
    } else {
        if (commentsEmpty) commentsEmpty.style.display = 'none';
        commentsContainer.innerHTML = '';
        comments.forEach(comment => addCommentToDOM(comment));
    }
    
    updateCommentsCount();
}

function addCommentToDOM(comment) {
    const commentsContainer = document.getElementById('commentsList');
    const commentsEmpty = document.querySelector('.comments-empty');
    
    if (commentsEmpty) commentsEmpty.style.display = 'none';
    
    const commentElement = createCommentElement(comment);
    commentsContainer.insertBefore(commentElement, commentsContainer.firstChild);
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.setAttribute('data-comment-id', comment.id);
    
    const timeAgo = getTimeAgo(comment.timestamp);
    const initials = generateInitials(comment.name);
    const isLiked = isCommentLiked(comment.id);
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="comment-author-info">
                <div class="comment-author-avatar">${initials}</div>
                <div class="comment-author-details">
                    <h4>${escapeHtml(comment.name)}</h4>
                    <div class="comment-date">${timeAgo}</div>
                </div>
            </div>
            <div class="comment-actions">
                <button class="comment-like ${isLiked ? 'liked' : ''}" data-comment-id="${comment.id}">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                    <span class="like-count">${comment.likes}</span>
                </button>
                <button class="comment-reply" data-comment-id="${comment.id}">
                    <i class="fas fa-reply"></i>
                    Reply
                </button>
            </div>
        </div>
        <div class="comment-content">
            <p>${escapeHtml(comment.message).replace(/\n/g, '<br>')}</p>
        </div>
    `;
    
    // Add event listeners
    const likeBtn = commentDiv.querySelector('.comment-like');
    const replyBtn = commentDiv.querySelector('.comment-reply');
    
    likeBtn.addEventListener('click', () => handleCommentLike(comment.id));
    replyBtn.addEventListener('click', () => handleCommentReply(comment.id));
    
    return commentDiv;
}

function handleCommentLike(commentId) {
    const comment = getCommentById(commentId);
    if (!comment) return;
    
    const isCurrentlyLiked = isCommentLiked(commentId);
    const likeBtn = document.querySelector(`[data-comment-id="${commentId}"] .comment-like`);
    const likeCount = likeBtn.querySelector('.like-count');
    const heartIcon = likeBtn.querySelector('i');
    
    if (isCurrentlyLiked) {
        // Unlike
        comment.likes = Math.max(0, comment.likes - 1);
        likeBtn.classList.remove('liked');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        removeLike(commentId);
    } else {
        // Like
        comment.likes += 1;
        likeBtn.classList.add('liked');
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        addLike(commentId);
    }
    
    likeCount.textContent = comment.likes;
    updateComment(comment);
    
    // Animation
    likeBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        likeBtn.style.transform = 'scale(1)';
    }, 150);
}

function handleCommentReply(commentId) {
    const comment = getCommentById(commentId);
    if (!comment) return;
    
    // Scroll to comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.scrollIntoView({ behavior: 'smooth' });
        
        // Focus on message field and add reply prefix
        const messageField = document.getElementById('commentMessage');
        if (messageField) {
            setTimeout(() => {
                messageField.focus();
                messageField.value = `@${comment.name} `;
                messageField.setSelectionRange(messageField.value.length, messageField.value.length);
            }, 500);
        }
    }
}

function updateCommentsCount() {
    const postId = getCurrentPostId();
    const comments = getCommentsForPost(postId);
    const countElement = document.getElementById('commentsCount');
    
    if (countElement) {
        countElement.textContent = comments.length;
    }
}

// Utility Functions
function getCurrentPostId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
}

function generateCommentId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substr(0, 2);
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return commentTime.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Local Storage Functions
function saveComment(comment) {
    const comments = getAllComments();
    comments.push(comment);
    localStorage.setItem('blogComments', JSON.stringify(comments));
}

function getAllComments() {
    const comments = localStorage.getItem('blogComments');
    return comments ? JSON.parse(comments) : [];
}

function getCommentsForPost(postId) {
    return getAllComments().filter(comment => comment.postId === postId)
                          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getCommentById(commentId) {
    return getAllComments().find(comment => comment.id === commentId);
}

function updateComment(updatedComment) {
    const comments = getAllComments();
    const index = comments.findIndex(comment => comment.id === updatedComment.id);
    if (index !== -1) {
        comments[index] = updatedComment;
        localStorage.setItem('blogComments', JSON.stringify(comments));
    }
}

function addLike(commentId) {
    const likedComments = getLikedComments();
    if (!likedComments.includes(commentId)) {
        likedComments.push(commentId);
        localStorage.setItem('likedComments', JSON.stringify(likedComments));
    }
}

function removeLike(commentId) {
    const likedComments = getLikedComments();
    const index = likedComments.indexOf(commentId);
    if (index !== -1) {
        likedComments.splice(index, 1);
        localStorage.setItem('likedComments', JSON.stringify(likedComments));
    }
}

function getLikedComments() {
    const liked = localStorage.getItem('likedComments');
    return liked ? JSON.parse(liked) : [];
}

function isCommentLiked(commentId) {
    return getLikedComments().includes(commentId);
}

// Toast notification function
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-gold);
        color: var(--primary-black);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Add highlight effect CSS
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .comment-item.highlight {
        background: rgba(212, 175, 55, 0.1);
        border-color: var(--primary-gold);
        transform: scale(1.02);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(highlightStyle);

// Email notification functions
async function sendCommentEmailNotification(commentData) {
    try {
        if (window.emailNotificationService) {
            const postTitle = document.querySelector('h1')?.textContent || 'VNR Blog Post';
            const result = await window.emailNotificationService.sendCommentNotification(
                commentData, 
                postTitle, 
                window.location.href
            );
            
            if (result.success) {
                console.log('Comment email notification sent successfully');
            } else {
                console.warn('Failed to send comment email notification:', result.error);
            }
        } else {
            console.warn('Email notification service not available');
        }
    } catch (error) {
        console.error('Error sending comment email notification:', error);
    }
}

async function sendContactEmailNotification(contactData) {
    try {
        if (window.emailNotificationService) {
            const result = await window.emailNotificationService.sendContactNotification(contactData);
            
            if (result.success) {
                console.log('Contact email notification sent successfully');
                return true;
            } else {
                console.warn('Failed to send contact email notification:', result.error);
                return false;
            }
        } else {
            console.warn('Email notification service not available');
            return false;
        }
    } catch (error) {
        console.error('Error sending contact email notification:', error);
        return false;
    }
}

console.log('VNR Blog - JavaScript initialized successfully!');
