export function registerNavigationHandlers() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const digitalNumbers = document.querySelector('.digital-numbers');
    const scrollIndicator = document.getElementById('scroll-indicator');

    if (!mobileMenuBtn || !navMenu || !digitalNumbers) {
        return;
    }

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        digitalNumbers.style.zIndex = navMenu.classList.contains('active') ? '999' : '1001';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('active');
            digitalNumbers.style.zIndex = '1001';
        }
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            digitalNumbers.style.zIndex = '1001';
        });
    });

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const sectionsContainer = document.querySelector('.sections-container');
            if (sectionsContainer) {
                sectionsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}
