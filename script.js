// Cargar datos desde datos.json
let legalTexts = {};
let infoData = {};
let galleryData = {};

// Cargar datos desde datos.json
fetch('datos.json')
    .then(response => response.json())
    .then(data => {
        legalTexts = data.legalTexts;
        infoData = data.infoData;
        galleryData = data.galleryData;

        // Crear slides de Lugares Destacados dinámicamente
        const destacados = data.destacados || [];
        const carousel = document.getElementById('carousel');
        const indicatorsContainer = document.getElementById('carouselIndicators');
        if (carousel && destacados.length) {
            carousel.innerHTML = destacados.map(destacado => `
                <div class="min-w-full flex-shrink-0 destacado-slide">
                  <div class="relative h-[500px] cursor-pointer">
                    <img src="${destacado.img}" alt="${destacado.alt}" class="w-full h-full object-cover object-top">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10">
                      <h3 class="text-3xl font-bold text-white mb-2">${destacado.title}</h3>
                      <p class="text-white text-lg mb-4">${destacado.desc}</p>
                    </div>
                  </div>
                </div>
            `).join('');

            // Indicadores dinámicos
            indicatorsContainer.innerHTML = destacados.map((_, i) =>
                `<button id="slide${i}" class="w-3 h-3 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}"></button>`
            ).join('');
        }

        // Modal para Lugares Destacados
        setTimeout(() => {
            document.querySelectorAll('#carousel .destacado-slide').forEach((slide) => {
                slide.addEventListener('click', function () {
                    const img = slide.querySelector('img');
                    const title = slide.querySelector('h3');
                    const desc = slide.querySelector('p');
                    const modal = document.getElementById('destacadoFullModal');
                    const modalImg = document.getElementById('destacadoFullModalImg');
                    const modalTitle = document.getElementById('destacadoFullModalTitle');
                    const modalDesc = document.getElementById('destacadoFullModalDesc');

                    modalImg.src = img.src;
                    modalImg.alt = img.alt || '';
                    modalTitle.textContent = title ? title.textContent : '';
                    modalDesc.textContent = desc ? desc.textContent : '';
                    modal.classList.remove('hidden');
                });
            });

            // Carousel functionality dinámica
            let currentSlide = 0;
            const totalSlides = destacados.length;
            const slideButtons = Array.from(indicatorsContainer.querySelectorAll('button'));
            const prevButton = document.getElementById('prevSlide');
            const nextButton = document.getElementById('nextSlide');

            function updateSlides(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                carousel.style.transform = `translateX(-${index * 100}%)`;
                slideButtons.forEach((button, i) => {
                    button.className = `w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`;
                });
                currentSlide = index;
            }

            slideButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    updateSlides(index);
                });
            });

            prevButton?.addEventListener('click', () => {
                updateSlides(currentSlide - 1);
            });

            nextButton?.addEventListener('click', () => {
                updateSlides(currentSlide + 1);
            });

            setInterval(() => {
                updateSlides(currentSlide + 1);
            }, 5000);

            updateSlides(0); // Inicializa el carrusel
        }, 300);
    })
    .catch(err => {
        console.error('Error cargando datos.json:', err);
    });

// Funcionalidad del modal de bienvenida y desplazamiento suave
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

// Carousel functionality
document.addEventListener('DOMContentLoaded', function () {

    const carousel = document.getElementById('carousel');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const slideButtons = [
        document.getElementById('slide0'),
        document.getElementById('slide1'),
        document.getElementById('slide2'),
        document.getElementById('slide3') // Added for the fourth slide
    ];

    let currentSlide = 0;
    const totalSlides = 4;

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
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;

    if (!menuButton || !mobileMenu) {
        console.error('Menu elements not found!');
        return;
    }

    menuButton.addEventListener('click', function (e) {
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

// Mapa interactivo y vista 360°
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle360');
    const mapIframe = document.getElementById('mapIframe');
    const interestColumn = document.getElementById('interestColumn');
    const mapContainer = document.getElementById('mapContainer');
    let is360 = false;

    toggleBtn.addEventListener('click', function () {
        if (!is360) {
            // Mostrar vista 360 y ocultar columna de interés
            mapIframe.src = "https://www.google.com/maps/embed?pb=!4v1749812740793!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDAyLXIyRlE.!2m2!1d41.61888117397476!2d-1.965886231627183!3f304.0992493883874!4f-24.811994254561228!5f0.4000000000000002";
            interestColumn.style.display = "none";
            mapContainer.classList.remove('md:w-4/5');
            mapContainer.classList.add('w-full');
            toggleBtn.textContent = "Mapa interactivo";
            is360 = true;
        } else {
            // Volver al mapa normal y mostrar columna de interés
            mapIframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000.0!2d-2.0000!3d41.5800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd441f0000000000%3A0x0!2sCiria%2C%20Soria!5e0!3m2!1ses!2ses!4v1678901234567!5m2!1ses!2ses";
            interestColumn.style.display = "";
            mapContainer.classList.remove('w-full');
            mapContainer.classList.add('md:w-4/5');
            toggleBtn.textContent = "Explora Ciria en 360°";
            is360 = false;
        }
    });
});

// Mostrar popup y centrar mapa
document.querySelectorAll('#mapa ul li[data-coords]').forEach(function (item) {
    item.addEventListener('click', function () {
        const coords = this.getAttribute('data-coords');
        const [lat, lng] = coords.split(',');
        const mapIframe = document.getElementById('mapIframe');
        mapIframe.src = `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=17&output=embed`;

        document.getElementById('popupTitle').textContent = this.querySelector('span').textContent;
        document.getElementById('popupDescription').textContent = this.getAttribute('data-description');
        document.getElementById('popupImage').src = this.getAttribute('data-image');
        document.getElementById('mapPopup').classList.remove('hidden');
    });
});

// Cerrar popup al pulsar la X
document.getElementById('closeMapPopup').addEventListener('click', function () {
    document.getElementById('mapPopup').classList.add('hidden');
});

// Cerrar popup al hacer clic fuera de la tarjeta
document.getElementById('mapPopup').addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Galerías de ejemplo (personaliza las imágenes)
document.querySelectorAll('.open-gallery-modal').forEach(btn => {
    btn.addEventListener('click', function () {
        const galleryKey = this.getAttribute('data-gallery');
        const modal = document.getElementById('galleryModal');
        const title = document.getElementById('galleryModalTitle');
        const imagesContainer = document.getElementById('galleryModalImages');
        const data = galleryData[galleryKey];

        if (data) {
            title.textContent = data.title;
            imagesContainer.innerHTML = data.images.map(src =>
                `<img src="${src}" alt="" class="h-32 w-32 object-cover rounded-lg shadow-md border border-gray-200">`
            ).join('');
        } else {
            title.textContent = "Galería";
            imagesContainer.innerHTML = "<p class='text-gray-500'>No hay imágenes disponibles.</p>";
        }

        modal.classList.remove('hidden');
    });
});

document.getElementById('closeGalleryModal').addEventListener('click', function () {
    document.getElementById('galleryModal').classList.add('hidden');
});

// Información expandida para el modal
document.querySelectorAll('.open-info-modal').forEach(btn => {
    btn.addEventListener('click', function () {
        const infoKey = this.getAttribute('data-info');
        const modal = document.getElementById('infoModal');
        const title = document.getElementById('infoModalTitle');
        const image = document.getElementById('infoModalImage');
        const text = document.getElementById('infoModalText');
        const data = infoData[infoKey];

        if (data) {
            title.textContent = data.title;
            image.src = data.image;
            image.alt = data.title;
            text.innerHTML = data.text;
        } else {
            title.textContent = "Información";
            image.src = "";
            text.innerHTML = "<p class='text-gray-500'>No hay información disponible.</p>";
        }

        modal.classList.remove('hidden');
    });
});

document.getElementById('closeInfoModal').addEventListener('click', function () {
    document.getElementById('infoModal').classList.add('hidden');
});

// Modal de información legal
document.querySelectorAll('.open-legal-modal').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const key = this.getAttribute('data-legal');
        const modal = document.getElementById('legalModal');
        const title = document.getElementById('legalModalTitle');
        const text = document.getElementById('legalModalText');
        const data = legalTexts[key];

        if (data) {
            title.textContent = data.title;
            text.innerHTML = data.text;
        } else {
            title.textContent = "Información Legal";
            text.innerHTML = "<p class='text-gray-500'>No hay información disponible.</p>";
        }

        modal.classList.remove('hidden');
    });
});

document.getElementById('closeLegalModal').addEventListener('click', function () {
    document.getElementById('legalModal').classList.add('hidden');
});

// Abrir imagen en tamaño completo desde la galería
document.getElementById('galleryModalImages')?.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
        const fullModal = document.getElementById('imageFullModal');
        const fullImg = document.getElementById('imageFullModalImg');
        fullImg.src = e.target.src;
        fullImg.alt = e.target.alt || '';
        fullModal.classList.remove('hidden');
    }
});

// Cerrar el modal de imagen ampliada
document.getElementById('closeImageFullModal')?.addEventListener('click', function () {
    document.getElementById('imageFullModal').classList.add('hidden');
});

// También cerrar al hacer clic fuera de la imagen
document.getElementById('imageFullModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Cierre del modal destacado
document.getElementById('closeDestacadoFullModal')?.addEventListener('click', function () {
    document.getElementById('destacadoFullModal').classList.add('hidden');
});

document.getElementById('destacadoFullModal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Carousel dinámico con flechas
setTimeout(() => {
    let currentSlide = 0;
    const destacados = legalTexts.destacados || [];
    const carousel = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const slideButtons = Array.from(indicatorsContainer.querySelectorAll('button'));
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const totalSlides = slideButtons.length;

    function updateSlides(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        slideButtons.forEach((button, i) => {
            button.className = `w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`;
        });
        currentSlide = index;
    }

    slideButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            updateSlides(index);
        });
    });

    prevButton?.addEventListener('click', () => {
        updateSlides(currentSlide - 1);
    });

    nextButton?.addEventListener('click', () => {
        updateSlides(currentSlide + 1);
    });

    setInterval(() => {
        updateSlides(currentSlide + 1);
    }, 5000);

    updateSlides(0);
}, 300);