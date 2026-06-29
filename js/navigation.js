/* =====================================================
   Beijing Yuda Teng Sports Development Co., Ltd
   Navigation Controller
   ===================================================== */

class NavigationController {
    constructor() {
        this.navbar = null;
        this.menu = null;
        this.toggle = null;
        this.overlay = null;
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        this.init();
    }
    
    init() {
        this.navbar = document.querySelector('.navbar');
        this.menu = document.querySelector('.navbar-menu');
        this.toggle = document.querySelector('.navbar-toggle');
        this.overlay = document.querySelector('.mobile-menu-overlay');
        
        if (!this.navbar) return;
        
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupKeyboardNavigation();
        this.setupDropdownMenus();
        this.highlightActiveLink();
    }
    
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        this.handleScroll(); // Initial call
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > this.lastScrollY && currentScrollY > 500) {
            this.navbar.classList.add('hidden');
        } else {
            this.navbar.classList.remove('hidden');
        }
        
        this.lastScrollY = currentScrollY;
    }
    
    setupMobileMenu() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMenu());
        }
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }
    
    openMenu() {
        this.isMenuOpen = true;
        this.toggle.classList.add('active');
        this.menu.classList.add('active');
        this.menu.setAttribute('aria-hidden', 'false');
        
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
        
        document.body.classList.add('scroll-locked');
        
        // Focus first menu item
        const firstLink = this.menu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.toggle.classList.remove('active');
        this.menu.classList.remove('active');
        this.menu.setAttribute('aria-hidden', 'true');
        
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        
        document.body.classList.remove('scroll-locked');
    }
    
    setupKeyboardNavigation() {
        const menuLinks = this.menu?.querySelectorAll('a');
        
        if (!menuLinks) return;
        
        menuLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % menuLinks.length;
                        menuLinks[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + menuLinks.length) % menuLinks.length;
                        menuLinks[prevIndex].focus();
                        break;
                    case 'Escape':
                        this.closeMenu();
                        this.toggle.focus();
                        break;
                }
            });
        });
    }
    
    setupDropdownMenus() {
        const hasDropdown = this.menu?.querySelector('.has-dropdown');
        
        if (!hasDropdown) return;
        
        hasDropdown.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.dropdown');
            
            if (!link || !dropdown) return;
            
            // Desktop hover behavior
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 991) {
                    dropdown.classList.add('active');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 991) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Mobile click behavior
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
    }
    
    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const menuLinks = this.menu?.querySelectorAll('a');
        
        if (!menuLinks) return;
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Check if current page matches link
            if (currentPath.includes(href) && href !== './' && href !== 'index.html') {
                link.classList.add('active');
            } else if ((currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/')) && 
                       (href === 'index.html' || href === './' || href === '/')) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navigation controller
const navigationController = new NavigationController();

// Export for global access
window.navigationController = navigationController;

/* Breadcrumb Navigation */
function updateBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    
    // Build breadcrumb items based on URL
    let html = '<li><a href="/">Home</a></li>';
    let currentPath = '';
    
    segments.forEach((segment, index) => {
        currentPath += '/' + segment;
        const isLast = index === segments.length - 1;
        
        // Format segment name
        let name = segment
            .replace('.html', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        
        if (isLast) {
            html += `<li>${name}</li>`;
        } else {
            html += `<li><a href="${currentPath}">${name}</a></li>`;
        }
    });
    
    breadcrumb.innerHTML = html;
}

// Initialize breadcrumb
document.addEventListener('DOMContentLoaded', updateBreadcrumb);

/* Smooth Scroll for Anchor Links */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Initialize smooth scroll
document.addEventListener('DOMContentLoaded', initSmoothScroll);

/* Page Transition Effects */
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip external links and anchors
            if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            
            // Add fade out animation
            document.body.classList.add('page-transition-out');
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', initPageTransitions);

/* Preload Next Page */
function initPreload() {
    const links = document.querySelectorAll('a[href$=".html"]');
    const preloadedPages = new Set();
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            
            if (href && !preloadedPages.has(href)) {
                const prefetch = document.createElement('link');
                prefetch.rel = 'prefetch';
                prefetch.href = href;
                document.head.appendChild(prefetch);
                preloadedPages.add(href);
            }
        });
    });
}

// Initialize preload
document.addEventListener('DOMContentLoaded', initPreload);
