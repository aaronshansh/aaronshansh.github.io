// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initStickyHeader();
    initMobileMenu();
    initCustomCursor();
    initTextTypeAnimation();
    initScrollReveal();
    initProjectFilters();
    initContactForm();
    
    updateActiveNavLink(); // Set initial active link on page load
});

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Check if touch device
    if ('ontouchstart' in document.documentElement) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        return;
    }
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Cursor effects on hover
    const links = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .social-icon');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.5)';
            cursorFollower.style.opacity = '0.5';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.opacity = '1';
        });
    });
}

// Text Type Animation
function initTextTypeAnimation() {
    const TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };
    
    TxtRotate.prototype.tick = function() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.el.innerHTML = '<span class="wrap">' + this.txt + '|</span>';
        
        const that = this;
        let delta = 200 - Math.random() * 100;
        
        if (this.isDeleting) { delta /= 2; }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }
        
        setTimeout(function() {
            that.tick();
        }, delta);
    };
    
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    
    // INJECT CSS
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid var(--color-primary); }";
    document.body.appendChild(css);
}

// Scroll Reveal Animation
function initScrollReveal() {
    const scrollElements = document.querySelectorAll("[data-aos]");
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add("aos-animate");
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    // Add animation classes to elements
    scrollElements.forEach((el) => {
        el.classList.add("aos-init");
    });
    
    // Initial check
    handleScrollAnimation();
    
    // Add scroll event
    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
}

// Project Filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and add it to the clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to a server
            // For now, let's just log it
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Function to update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]'); // Ensure sections have an ID
    const navLinks = document.querySelectorAll('nav ul li a');
    const pathName = window.location.pathname;
    const currentPageFile = pathName.substring(pathName.lastIndexOf('/') + 1) || 'index.html';
    let currentSectionId = '';
    const headerOffset = 150; // Adjust this offset as needed (e.g., header height)

    // Determine current section for hash links
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - headerOffset && pageYOffset < sectionTop + sectionHeight - headerOffset) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // If on index.html and at the top, 'home' is the current section
    if (currentPageFile === 'index.html' && pageYOffset < headerOffset) {
        currentSectionId = 'home';
    }

    let hashLinkActivated = false;
    navLinks.forEach(link => {
        link.classList.remove('active'); // Clear active from all links first
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        // Activate based on current section ID (for hash links like #about)
        if (linkHref.startsWith('#') && linkHref.substring(1) === currentSectionId) {
            link.classList.add('active');
            hashLinkActivated = true;
        }
    });

    // If no hash link was activated by scroll (e.g., on awards.html, or index.html but no section matched)
    // Activate the link that matches the current page file.
    if (!hashLinkActivated) {
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;

            const linkFilePart = linkHref.split('#')[0]; // Get "awards.html" from "awards.html" or "index.html" from "index.html#about"
            let linkFileName = linkFilePart.substring(linkFilePart.lastIndexOf('/') + 1);
            if (linkFileName === '' && (linkFilePart === '/' || linkFilePart === './' || linkFilePart === 'index.html' || linkFilePart === '')) {
                linkFileName = 'index.html';
            }
            
            if (linkFileName === currentPageFile) {
                 // For index.html, ensure it's the main "Home" link or #home section is active
                if (currentPageFile === 'index.html') {
                    if (currentSectionId === 'home' && (linkHref === '#home' || linkHref === 'index.html' || linkHref === './' || linkHref === '/')) {
                        link.classList.add('active');
                    } else if (linkHref === 'index.html' && currentSectionId !== 'home' && !document.querySelector('nav ul li a[href="#' + currentSectionId + '"].active')) {
                        // Fallback for index.html if no specific section is active but we are on index page
                        // This case might need refinement based on exact desired behavior for index.html's own link
                    }
                } else { // For other pages like awards.html
                    link.classList.add('active');
                }
            }
        });
    }
     // Final check for index.html home link if nothing else is active and at top
    if (currentPageFile === 'index.html' && !document.querySelector('nav ul li a.active') && pageYOffset < headerOffset) {
        const homeLink = document.querySelector('nav ul li a[href="#home"], nav ul li a[href="index.html"], nav ul li a[href="./"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

// Active navigation menu based on scroll position
window.addEventListener('scroll', updateActiveNavLink);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
}); 