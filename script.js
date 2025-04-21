document.addEventListener('DOMContentLoaded', function () {
    // Modal and smooth scroll functionality
    const exploreButton = document.getElementById('exploreButton');
    const welcomeModal = document.getElementById('welcomeModal');
    const closeModal = document.getElementById('closeModal');
    const goToDestacados = document.getElementById('goToDestacados');
    const goToActividades = document.getElementById('goToActividades');
    function smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    exploreButton.addEventListener('click', () => {
        welcomeModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    closeModal.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    goToDestacados.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        smoothScrollTo('destacados');
    });
    goToActividades.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        smoothScrollTo('actividades');
    });
    welcomeModal.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
    // Checkbox functionality
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const icon = this.nextElementSibling;
            if (this.checked) {
                icon.classList.add('bg-primary');
                icon.classList.add('border-primary');
            } else {
                icon.classList.remove('bg-primary');
                icon.classList.remove('border-primary');
            }
        });
    });
    // Activity filtering functionality
    const activityFilters = document.getElementById('activity-filters');
    const activitiesGrid = document.getElementById('activities-grid');
    function filterActivities(category) {
        const activities = activitiesGrid.querySelectorAll('.activity-card');
        activities.forEach(activity => {
            const activityCategory = activity.querySelector('[class*="text-"][class*="-800"]').textContent;
            if (category === 'all' || activityCategory === category) {
                activity.style.display = 'block';
            } else {
                activity.style.display = 'none';
            }
        });
    }
    function updateFilterButtons(selectedFilter) {
        const buttons = activityFilters.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.getAttribute('data-filter') === selectedFilter) {
                button.className = 'bg-primary text-white px-6 py-3 rounded-button font-medium shadow-sm whitespace-nowrap';
            } else {
                button.className = 'bg-white text-gray-700 px-6 py-3 rounded-button font-medium shadow-sm hover:bg-gray-100 transition-colors whitespace-nowrap';
            }
        });
    }
    activityFilters.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const selectedFilter = e.target.getAttribute('data-filter');
            filterActivities(selectedFilter);
            updateFilterButtons(selectedFilter);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Carousel functionality
    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const slideButtons = [
        document.getElementById('slide0'),
        document.getElementById('slide1'),
        document.getElementById('slide2')
    ];
    
    let currentSlide = 0;
    const totalSlides = 3;

    function updateSlides(index) {
        // Handle circular navigation
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        // Update carousel position
        carousel.style.transform = `translateX(-${index * 100}%)`;
        
        // Update indicator buttons
        slideButtons.forEach((button, i) => {
            if (i === index) {
                button.classList.remove('bg-white/50');
                button.classList.add('bg-white');
            } else {
                button.classList.remove('bg-white');
                button.classList.add('bg-white/50');
            }
        });
        
        currentSlide = index;
    }

    // Navigation button event listeners
    prevButton.addEventListener('click', () => {
        updateSlides(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        updateSlides(currentSlide + 1);
    });

    // Indicator button event listeners
    slideButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            updateSlides(index);
        });
    });

    // Auto-advance slides every 5 seconds
    setInterval(() => {
        updateSlides(currentSlide + 1);
    }, 5000);
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;

    if (!menuButton || !mobileMenu) {
        console.error('Menu elements not found!');
        return;
    }

    menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        isMenuOpen = !isMenuOpen;
        console.log('Menu button clicked, isMenuOpen:', isMenuOpen);
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            menuButton.querySelector('i').className = 'ri-close-line text-white ri-2x';
        } else {
            mobileMenu.classList.add('hidden');
            menuButton.querySelector('i').className = 'ri-menu-line text-white ri-2x';
        }
    });

    // Close menu when clicking links
    const mobileLinks = mobileMenu.getElementsByTagName('a');
    Array.from(mobileLinks).forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            menuButton.querySelector('i').className = 'ri-menu-line text-white ri-2x';
        });
    });
});