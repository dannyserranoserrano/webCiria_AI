let legalTexts = {};
let infoData = {};
let galleryData = {};

// Cargar datos desde datos.json y generar destacados y modales
fetch('datos.json')
    .then(response => response.json())
    .then(data => {
        legalTexts = data.legalTexts;
        infoData = data.infoData;
        galleryData = data.galleryData;

        // --- PUNTOS DE INTERÉS DINÁMICOS ---
        const mapPoints = data.mapPoints || [];
        const interestColumn = document.getElementById('interestColumn');
        if (interestColumn && mapPoints.length) {
            const ul = interestColumn.querySelector('ul');
            ul.className = "grid grid-cols-2 gap-1 md:block"; // 2 columnas en móvil, lista en escritorio
            ul.innerHTML = mapPoints.map(point => `
                <li
                  class="flex items-center gap-1 py-1 px-1 text-xs md:py-2 md:px-2 md:text-sm bg-white rounded shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  data-coords="${point.coords}"
                  data-description="${point.description}"
                  data-image="${point.image}">
                  <i class="${point.icon || 'ri-map-pin-line'} text-base md:text-lg mr-1"></i>
                  <span>${point.name}</span>
                </li>
            `).join('');
            // Listener para abrir el modal y centrar el mapa
            ul.querySelectorAll('li').forEach(function (item) {
                item.addEventListener('click', function () {
                    const coords = this.getAttribute('data-coords');
                    const [lat, lng] = coords.split(',');
                    const mapIframe = document.getElementById('mapIframe');
                    if (mapIframe && lat && lng) {
                        mapIframe.src = `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=17&output=embed`;
                    }
                    document.getElementById('popupTitle').textContent = this.querySelector('span').textContent;
                    document.getElementById('popupDescription').textContent = this.getAttribute('data-description');
                    document.getElementById('popupImage').src = this.getAttribute('data-image');
                    document.getElementById('popupImage').alt = this.querySelector('span').textContent;
                    document.getElementById('mapPopup').classList.remove('hidden');
                });
            });
        }

        // Crear slides de Lugares Destacados dinámicamente
        const destacados = data.destacados || [];
        const carousel = document.getElementById('carousel');
        const indicatorsContainer = document.getElementById('carouselIndicators');
        if (carousel && destacados.length) {
            carousel.innerHTML = destacados.map(destacado => `
                <div class="min-w-full flex-shrink-0 destacado-slide">
                  <div class="relative h-[500px] cursor-pointer">
                    <img src="${destacado.img || ''}" alt="${destacado.alt || ''}" class="w-full h-full object-cover object-top">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10">
                      <h3 class="text-3xl font-bold text-white mb-2">${destacado.title || ''}</h3>
                      <p class="text-white text-lg mb-4">${destacado.desc || ''}</p>
                    </div>
                  </div>
                </div>
            `).join('');
            indicatorsContainer.innerHTML = destacados.map((_, i) =>
                `<button id="slide${i}" class="w-3 h-3 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}"></button>`
            ).join('');
        }

        // Carrusel funcionalidad
        setTimeout(() => {
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
                button.addEventListener('click', () => updateSlides(index));
            });

            prevButton?.addEventListener('click', () => updateSlides(currentSlide - 1));
            nextButton?.addEventListener('click', () => updateSlides(currentSlide + 1));

            let autoAdvance = setInterval(() => updateSlides(currentSlide + 1), 7000);

            updateSlides(0);

            // Modal imagen destacado
            document.querySelectorAll('#carousel .destacado-slide').forEach(slide => {
                slide.addEventListener('click', function () {
                    const img = slide.querySelector('img');
                    const title = slide.querySelector('h3');
                    const desc = slide.querySelector('p');
                    openImageModal({
                        src: img.src,
                        alt: img.alt,
                        title: title?.textContent || '',
                        desc: desc?.textContent || ''
                    });
                    clearInterval(autoAdvance);
                });
            });

            // Reactivar autoavance al cerrar modal imagen
            document.getElementById('closeImageFullModal')?.addEventListener('click', () => {
                closeImageModal();
                autoAdvance = setInterval(() => updateSlides(currentSlide + 1), 5000);
            });
            document.getElementById('imageFullModal')?.addEventListener('click', function (e) {
                if (e.target === this) {
                    closeImageModal();
                    autoAdvance = setInterval(() => updateSlides(currentSlide + 1), 5000);
                }
            });
        }, 300);
    })
    .catch(err => {
        console.error('Error cargando datos.json:', err);
    });

// Modal de bienvenida y desplazamiento suave
document.addEventListener('DOMContentLoaded', function () {
    const exploreButton = document.getElementById('exploreButton');
    const welcomeModal = document.getElementById('welcomeModal');
    const closeModalBtn = document.getElementById('closeModal');
    const goToDestacados = document.getElementById('goToDestacados');
    const goToMapa = document.getElementById('goToMapa');

    function smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    exploreButton?.addEventListener('click', () => {
        welcomeModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    closeModalBtn?.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    goToDestacados?.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        smoothScrollTo('destacados');
    });
    goToMapa?.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        smoothScrollTo('mapa');
    });
    welcomeModal?.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});

// --- Menú móvil ---
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;
    if (!menuButton || !mobileMenu) return;
    menuButton.addEventListener('click', function (e) {
        e.preventDefault();
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('hidden', !isMenuOpen);
        menuButton.querySelector('i').className = isMenuOpen ? 'ri-close-line text-white ri-2x' : 'ri-menu-line text-white ri-2x';
    });
    Array.from(mobileMenu.getElementsByTagName('a')).forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            menuButton.querySelector('i').className = 'ri-menu-line text-white ri-2x';
        });
    });
});

// Galería modal (calles, paisajes, etc.)
document.querySelectorAll('.open-gallery-modal').forEach(btn => {
    btn.addEventListener('click', function () {
        const galleryKey = this.getAttribute('data-gallery');
        const modal = document.getElementById('galleryModal');
        const title = document.getElementById('galleryModalTitle');
        const imagesContainer = document.getElementById('galleryModalImages');
        const data = galleryData[galleryKey];

        if (data && data.images) {
            title.textContent = data.title;
            imagesContainer.innerHTML = data.images.map(src =>
                `<img src="${src}" alt="${data.title}" class="h-32 w-32 object-cover rounded-lg shadow-md border border-gray-200">`
            ).join('');
            addImageClickEvents(imagesContainer, data.title);
        } else {
            title.textContent = "Galería";
            imagesContainer.innerHTML = "<p class='text-gray-500'>No hay imágenes disponibles.</p>";
        }

        modal.classList.remove('hidden');
    });
});

// Evento para abrir el modal de festividades agrupadas
document.querySelectorAll('.open-gallery-modal').forEach(btn => {
    btn.addEventListener('click', function () {
        if (btn.dataset.gallery === 'festividades') {
            openFestividadesGalleryModal();
        }
        // ...otros casos...
    });
});

// Abre el modal principal de festividades con los botones de cada fiesta
async function openFestividadesGalleryModal() {
    const festividades = galleryData.festividades;
    const galleryModalImages = document.getElementById('galleryModalImages');
    galleryModalImages.innerHTML = '';

    festividades.groups.forEach((group, idx) => {
        const btn = document.createElement('button');
        btn.textContent = group.title;
        btn.className = 'bg-white text-black px-6 py-3 rounded-button font-semibold shadow-sm m-2 border border-gray-300 hover:bg-gray-100 transition-colors text-lg';
        btn.style.letterSpacing = '0.5px';
        btn.addEventListener('click', () => openFiestaImagesModal(idx));
        galleryModalImages.appendChild(btn);
    });

    document.getElementById('galleryModalTitle').textContent = festividades.title;
    document.getElementById('galleryModal').classList.remove('hidden');
}

// Modal secundario para mostrar las fotos de una fiesta concreta
function openFiestaImagesModal(groupIdx) {
    const festividades = galleryData.festividades;
    const group = festividades.groups[groupIdx];

    let fiestaModal = document.getElementById('fiestaModal');
    if (!fiestaModal) {
        fiestaModal = document.createElement('div');
        fiestaModal.id = 'fiestaModal';
        fiestaModal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]';
        fiestaModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl w-[90vw] max-w-3xl flex flex-col relative overflow-hidden p-8">
                <button id="closeFiestaModal" class="absolute top-4 right-4 text-gray-600 hover:text-primary text-2xl font-bold">&times;</button>
                <h3 id="fiestaModalTitle" class="text-2xl font-bold mb-6"></h3>
                <div id="fiestaModalImages" class="flex flex-wrap gap-4"></div>
            </div>
        `;
        document.body.appendChild(fiestaModal);
        document.getElementById('closeFiestaModal').addEventListener('click', () => {
            fiestaModal.classList.add('hidden');
        });
        fiestaModal.addEventListener('click', function (e) {
            if (e.target === this) this.classList.add('hidden');
        });
    }

    document.getElementById('fiestaModalTitle').textContent = group.title;
    const imagesDiv = document.getElementById('fiestaModalImages');
    imagesDiv.innerHTML = group.images.map(src =>
        `<img src="${src}" alt="${group.title}" class="h-32 w-32 object-cover rounded-lg shadow-md border border-gray-200">`
    ).join('');
    addImageClickEvents(imagesDiv, group.title);

    fiestaModal.classList.remove('hidden');
}

// Modal de información expandida
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
            title.textContent = data.title || "Información Legal";
            text.innerHTML = data.text;
        } else {
            title.textContent = "Información Legal";
            text.innerHTML = "<p class='text-gray-500'>No hay información disponible.</p>";
        }

        modal.classList.remove('hidden');
    });
});

// Funciones para el modal de imagen ampliada
function openImageModal({ src, alt = '', title = '', desc = '' }) {
    const modal = document.getElementById('imageFullModal');
    const img = document.getElementById('imageFullModalImg');
    const overlay = document.getElementById('imageFullModalOverlay');
    const modalTitle = document.getElementById('imageFullModalTitle');
    const modalDesc = document.getElementById('imageFullModalDesc');

    // Asegura el z-index más alto
    modal.classList.add('z-[1100]');

    img.src = src;
    img.alt = alt;
    if (title || desc) {
        overlay.classList.remove('hidden');
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
    } else {
        overlay.classList.add('hidden');
        modalTitle.textContent = '';
        modalDesc.textContent = '';
    }
    modal.classList.remove('hidden');
}

function closeImageModal() {
    document.getElementById('imageFullModal').classList.add('hidden');
}

// Cierre de modales genéricos
document.getElementById('closeGalleryModal')?.addEventListener('click', () => closeModal('galleryModal'));
document.getElementById('closeInfoModal')?.addEventListener('click', () => closeModal('infoModal'));
document.getElementById('closeLegalModal')?.addEventListener('click', () => closeModal('legalModal'));
document.getElementById('closeImageFullModal')?.addEventListener('click', closeImageModal);
document.getElementById('imageFullModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeImageModal();
});

// Función genérica para cerrar modales
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
}

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
        document.getElementById('popupImage').alt = this.querySelector('span').textContent;
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

// Abrir imagen del punto de interés en modal ampliado
document.getElementById('popupImage')?.addEventListener('click', function () {
    openImageModal({
        src: this.src,
        alt: this.alt,
        title: document.getElementById('popupTitle').textContent,
        desc: document.getElementById('popupDescription').textContent
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

// Función para añadir eventos de clic a las imágenes en un contenedor
function addImageClickEvents(container, title = '', desc = '') {
    Array.from(container.querySelectorAll('img')).forEach(img => {
        img.classList.add('cursor-pointer');
        img.addEventListener('click', function () {
            openImageModal({
                src: img.src,
                alt: img.alt,
                title: title || img.alt || '',
                desc: desc || ''
            });
        });
    });
}