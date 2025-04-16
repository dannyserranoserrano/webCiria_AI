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
    const slideButtons = [
        document.getElementById('slide0'),
        document.getElementById('slide1'),
        document.getElementById('slide2')
    ];
    let currentSlide = 0;
    function updateSlides(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        slideButtons.forEach((button, i) => {
            button.classList.toggle('bg-white', i === index);
            button.classList.toggle('bg-white/50', i !== index);
        });
        currentSlide = index;
    }
    slideButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            updateSlides(index);
        });
    });
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        updateSlides(currentSlide);
    }, 5000);
});