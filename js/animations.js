/* =====================================================
   Beijing Yuda Teng Sports Development Co., Ltd
   Animations Controller
   ===================================================== */

class AnimationController {
    constructor() {
        this.animations = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupTypingAnimations();
        this.setupCounterAnimations();
        this.setupStaggerAnimations();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.playAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }
    
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll-animate]');
        scrollElements.forEach(el => {
            this.observer.observe(el);
            this.animations.push({
                element: el,
                type: el.dataset.scrollAnimate,
                delay: parseInt(el.dataset.delay) || 0
            });
        });
    }
    
    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('[data-hover-animate]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.triggerHoverAnimation(el));
            el.addEventListener('mouseleave', () => this.resetHoverAnimation(el));
        });
    }
    
    setupTypingAnimations() {
        const typingElements = document.querySelectorAll('[data-typing]');
        typingElements.forEach(el => {
            this.observeElement(el, () => this.startTypingAnimation(el));
        });
    }
    
    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-counter]');
        counterElements.forEach(el => {
            this.observeElement(el, () => this.animateCounter(el));
        });
    }
    
    setupStaggerAnimations() {
        const staggerContainers = document.querySelectorAll('[data-stagger]');
        staggerContainers.forEach(container => {
            const items = container.querySelectorAll('[data-stagger-item]');
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * 100}ms`;
            });
            this.observeElement(container, () => {
                items.forEach(item => item.classList.add('animated'));
            });
        });
    }
    
    observeElement(element, callback) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(element);
    }
    
    playAnimation(element) {
        const animationType = element.dataset.scrollAnimate;
        const delay = parseInt(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animated');
            
            // Trigger specific animations based on type
            switch (animationType) {
                case 'fade-up':
                    element.style.animation = 'fadeInUp 0.6s ease forwards';
                    break;
                case 'fade-down':
                    element.style.animation = 'fadeInDown 0.6s ease forwards';
                    break;
                case 'fade-left':
                    element.style.animation = 'fadeInLeft 0.6s ease forwards';
                    break;
                case 'fade-right':
                    element.style.animation = 'fadeInRight 0.6s ease forwards';
                    break;
                case 'scale':
                    element.style.animation = 'scaleIn 0.6s ease forwards';
                    break;
                case 'rotate':
                    element.style.animation = 'rotateIn 0.6s ease forwards';
                    break;
            }
        }, delay);
    }
    
    triggerHoverAnimation(element) {
        const animationType = element.dataset.hoverAnimate;
        element.classList.add(`hover-${animationType}`);
    }
    
    resetHoverAnimation(element) {
        const animationType = element.dataset.hoverAnimate;
        element.classList.remove(`hover-${animationType}`);
    }
    
    startTypingAnimation(element) {
        const text = element.dataset.typing;
        const speed = parseInt(element.dataset.typingSpeed) || 50;
        element.textContent = '';
        element.classList.add('typing');
        
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
            }
        };
        type();
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.counterDuration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        element.classList.add('counting');
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.classList.remove('counting');
                element.classList.add('counted');
            }
        };
        
        updateCounter();
    }
    
    // Utility methods for manual triggering
    animateElement(element, animationType, duration = 600) {
        return new Promise(resolve => {
            element.style.animation = `${animationType} ${duration}ms ease forwards`;
            setTimeout(resolve, duration);
        });
    }
    
    animateSequence(elements, animationType, staggerDelay = 100) {
        return new Promise(resolve => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animation = `${animationType} 600ms ease forwards`;
                }, index * staggerDelay);
            });
            setTimeout(resolve, elements.length * staggerDelay + 600);
        });
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for global access
window.animationController = animationController;

/* Additional Animation Functions */

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Ripple Effect
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Tilt Effect for Cards
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.tilt-effect');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Section Reveal Animation
function initSectionReveal() {
    const sections = document.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => observer.observe(section));
}

// Image Parallax
function initImageParallax() {
    const parallaxImages = document.querySelectorAll('.parallax-image');
    
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrollPercent = (rect.top / window.innerHeight);
            const translateY = scrollPercent * 50;
            
            img.style.transform = `translateY(${translateY}px)`;
        });
    });
}

// Text Split Animation
function initTextSplit() {
    const splitTexts = document.querySelectorAll('.split-text');
    
    splitTexts.forEach(text => {
        const words = text.textContent.split(' ');
        text.innerHTML = words.map((word, i) => 
            `<span style="animation-delay: ${i * 50}ms">${word}</span>`
        ).join(' ');
    });
}

// Initialize all additional animations
document.addEventListener('DOMContentLoaded', () => {
    initMagneticButtons();
    initRippleEffect();
    initTiltEffect();
    initScrollProgress();
    initSectionReveal();
    initImageParallax();
    initTextSplit();
});
