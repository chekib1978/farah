// Navigation mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Gestion du menu
const header = document.querySelector('header');
const navLinksContainer = document.querySelector('.nav-links');

// Animation du header au scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        header.classList.remove('scrolled');
    } else {
        header.classList.add('scrolled');
        if (currentScroll > lastScroll && !header.classList.contains('scroll-up')) {
            header.classList.add('scroll-up');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-up')) {
            header.classList.remove('scroll-up');
        }
    }
    lastScroll = currentScroll;
});

// Animation du menu burger
burger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    burger.classList.toggle('toggle');
    
    // Animation des liens
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Animation des liens au survol
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// Animation du logo
const logo = document.querySelector('.logo');
logo.addEventListener('mouseenter', () => {
    logo.style.transform = 'scale(1.05)';
});

logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'scale(1)';
});

// Fermer le menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Votre message a été envoyé avec succès. Nous vous contacterons bientôt.');
    contactForm.reset();
});

// Animations au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Animation des éléments au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Animation du bouton de retour en haut
    const scrollTop = document.createElement('div');
    scrollTop.className = 'scroll-top';
    scrollTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animation des cartes de pathologies
    const pathologyCards = document.querySelectorAll('.pathology-card');
    pathologyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Animation des images
    const images = document.querySelectorAll('.cabinet-images img');
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            img.style.filter = 'grayscale(0%)';
        });
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.filter = 'grayscale(20%)';
        });
    });

    // Animation des liens sociaux
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) scale(1.2)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animation des titres
    const titles = document.querySelectorAll('h2');
    titles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.style.transform = 'scale(1.05)';
        });
        title.addEventListener('mouseleave', () => {
            title.style.transform = 'scale(1)';
        });
    });

    // Animation des listes
    const listItems = document.querySelectorAll('.pathology-card ul li');
    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
            item.style.color = '#3498db';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
            item.style.color = '';
        });
    });

    // Animation du formulaire
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#3498db';
            input.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.2)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'transparent';
            input.style.boxShadow = 'none';
        });
    });

    // Animation des sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'scale(1.01)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'scale(1)';
        });
    });

    // Animation du footer
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-5px)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateY(0)';
        });
    });
}); 