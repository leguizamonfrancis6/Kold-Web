const heroVideo = document.querySelector('.hero-video');

// The video starts loading only once the hero is near the viewport, and is skipped for reduced motion.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.remove();
} else {
  heroVideo.addEventListener('loadeddata', () => heroVideo.classList.add('is-visible'), { once: true });

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      heroVideo.src = isMobile ? heroVideo.dataset.mobileSrc : heroVideo.dataset.src;
      observer.disconnect();
    },
    { rootMargin: '200px 0px' }
  );
  observer.observe(heroVideo);
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const setMenuOpen = (isOpen) => {
  mainNav.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
};

menuToggle.addEventListener('click', () => setMenuOpen(!mainNav.classList.contains('is-open')));

// Any click outside the toggle (including a nav link) closes the menu.
document.addEventListener('click', (event) => {
  if (!menuToggle.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

const contactForm = document.querySelector('#contact-form');
const queryField = contactForm.querySelector('textarea');
const counter = document.querySelector('#counter');
const formStatus = document.querySelector('#form-status');

const updateCounter = () => {
  counter.textContent = `${queryField.value.length}/${queryField.maxLength}`;
};

const showStatus = (message, type = '') => {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
};

queryField.addEventListener('input', updateCounter);

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showStatus('Enviando consulta...');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    // FormSubmit can answer 200 with { success: "false" }.
    const result = await response.json().catch(() => ({}));
    if (!response.ok || String(result.success) === 'false') throw new Error(response.statusText);

    contactForm.reset();
    updateCounter();
    showStatus('Gracias. Recibimos tu consulta y te contactaremos pronto.', 'success');
  } catch {
    showStatus('No pudimos enviar el mensaje. Escribinos directamente por email o WhatsApp.', 'error');
  }
});

const clientGrid = document.querySelector('.client-grid');
const carouselButtons = document.querySelectorAll('[data-carousel-direction]');

const updateCarouselButtons = () => {
  const maxScroll = clientGrid.scrollWidth - clientGrid.clientWidth;
  carouselButtons.forEach((button) => {
    const direction = Number(button.dataset.carouselDirection);
    button.disabled = direction < 0 ? clientGrid.scrollLeft <= 1 : clientGrid.scrollLeft >= maxScroll - 1;
  });
};

carouselButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const cardWidth = clientGrid.querySelector('.client-card').getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(clientGrid).columnGap) || 0;
    clientGrid.scrollBy({ left: Number(button.dataset.carouselDirection) * (cardWidth + gap) });
  });
});

clientGrid.addEventListener('scroll', updateCarouselButtons, { passive: true });
window.addEventListener('resize', updateCarouselButtons);
updateCarouselButtons();
