/**
 * DEVELOPER PORTFOLIO - SCRIPT FILE
 * Candidate: Abdelrhman Emad Marouf
 * Logic: Theme system, mobile responsive drawer, typing, reveals, progress bars, validation
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Theme Management (Light/Dark Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Get preferred theme from localStorage or system settings
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Fallback to system preference (default to dark if not set)
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return userPrefersDark ? 'dark' : 'light';
    };

    // Apply specific theme
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Initialize theme on page load
    const currentTheme = getSavedTheme();
    applyTheme(currentTheme);

    // Toggle button handler
    themeToggleBtn.addEventListener('click', () => {
        const nextTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    // ==========================================================================
    // 2. Mobile Responsive Menu
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu visibility
    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent background body scroll when mobile menu is open
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };

    // Hamburger button click event
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // ==========================================================================
    // 3. Scroll Dynamics (Navbar, Scroll Progress, Active Links)
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const sections = document.querySelectorAll('section');

    const handleScrollEffects = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // A. Navbar size shrink after 50px of scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // B. Scroll Progress Bar filling
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // C. Active Link highlighting based on scroll position
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky header
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const hrefAttr = link.getAttribute('href');
            if (hrefAttr === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollEffects);
    // Initial call to set states on page load
    handleScrollEffects();

    // ==========================================================================
    // 4. Hero Section Typewriter Animation
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    
    if (typewriterElement) {
        const wordsArray = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const runTypewriter = () => {
            const currentWord = wordsArray[wordIndex];
            
            if (isDeleting) {
                // Delete text character
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40; // Erase faster
            } else {
                // Write text character
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80; // Standard typing speed
            }

            // Word is completed
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1500; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                // Move to next word after erasing is complete
                isDeleting = false;
                wordIndex = (wordIndex + 1) % wordsArray.length;
                typeSpeed = 500; // Pause briefly before starting new word
            }

            setTimeout(runTypewriter, typeSpeed);
        };

        // Start typewriter
        setTimeout(runTypewriter, 1000);
    }

    // ==========================================================================
    // 5. Intersection Observer: Scroll Reveal Animation
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before element enters view
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve since we only want to reveal once
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // 6. Intersection Observer: Skill Progress Bars filling
    // ==========================================================================
    const progressLines = document.querySelectorAll('.progress-line');

    const progressObserverOptions = {
        threshold: 0.2
    };

    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetPercent = entry.target.getAttribute('data-percent');
                const fillSpan = entry.target.querySelector('span');
                if (fillSpan) {
                    fillSpan.style.width = targetPercent;
                }
                // Unobserve after animating
                observer.unobserve(entry.target);
            }
        });
    }, progressObserverOptions);

    progressLines.forEach(line => {
        progressObserver.observe(line);
    });

    // ==========================================================================
    // 7. Contact Form Handling & Custom Validation
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const successToast = document.getElementById('success-toast');

    if (contactForm) {
        
        // Email address regex validator
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Clear invalid classes on input interaction
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.parentElement;
                if (group.classList.contains('invalid')) {
                    group.classList.remove('invalid');
                }
            });
        });

        // Form Submission Event
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;

            // Validate inputs
            formInputs.forEach(input => {
                const value = input.value.trim();
                const group = input.parentElement;

                if (!value) {
                    group.classList.add('invalid');
                    isFormValid = false;
                } else if (input.getAttribute('type') === 'email' && !isValidEmail(value)) {
                    group.classList.add('invalid');
                    isFormValid = false;
                } else {
                    group.classList.remove('invalid');
                }
            });

            // If validation passes
            if (isFormValid) {
                const submitBtn = document.getElementById('submit-btn');
                const originalBtnText = submitBtn.querySelector('span').textContent;
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.querySelector('span').textContent = 'Sending...';

                // Simulate email delivery process
                setTimeout(() => {
                    // Activate success toast card inside Form wrapper
                    successToast.classList.add('active');

                    // Reset form and UI values
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.querySelector('span').textContent = originalBtnText;

                    // Automatically close the success toast after 4 seconds
                    setTimeout(() => {
                        successToast.classList.remove('active');
                    }, 4000);

                }, 1500);
            }
        });
    }

});
