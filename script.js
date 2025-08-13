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
            ul.innerHTML = mapPoints.map(point => `
                <li
                  class="flex items-center px-2 py-2 bg-white rounded shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-colors text-sm"
                  data-coords="${point.coords}"
                  data-description="${point.description}"
                  data-image="${point.image}">
                  <i class="${point.icon || 'ri-map-pin-line'} text-lg mr-2"></i>
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

            let autoAdvance = setInterval(() => updateSlides(currentSlide + 1), 5000);

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
    const goToActividades = document.getElementById('goToActividades');

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
    goToActividades?.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        smoothScrollTo('actividades');
    });
    welcomeModal?.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            welcomeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});

// Galería modal
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

// Abrir imagen de galería en modal ampliado
document.getElementById('galleryModalImages')?.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
        openImageModal({ src: e.target.src, alt: e.target.alt });
    }
});

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