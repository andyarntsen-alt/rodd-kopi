// Flash bar
const flashBar = document.getElementById('flashBar');
const flashClose = document.querySelector('.flash-close');
if (flashClose && flashBar) {
  flashClose.addEventListener('click', () => {
    flashBar.classList.add('flash-hidden');
    header.classList.add('flash-gone');
  });
}

// Header hide/show on scroll
const header = document.getElementById('header');
let lastScrollY = 0;
let ticking = false;
const kbState = { rotY: -6, rotX: 3, rot: -2.4 };

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      header.classList.toggle('scrolled', currentScrollY > 40);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }

      // Hero showcase parallax
      const cards = document.querySelectorAll('.showcase-card');
      if (currentScrollY < window.innerHeight && cards.length) {
        const progress = currentScrollY / window.innerHeight;
        cards.forEach((card, i) => {
          const speed = 0.1 + i * 0.08;
          const y = currentScrollY * speed;
          card.style.transform = `translateY(${-y}px) rotate(${card.style.getPropertyValue('--r') || '0deg'})`;
          card.style.opacity = Math.max(0, 1 - progress * 1.1);
        });
      }

      // Keyboard 3D tilt basert på scroll-retning
      const keyboard = document.querySelector('.integrations-keyboard');
      if (keyboard) {
        const kbSection = keyboard.closest('.keyboard-section');
        if (kbSection) {
          const rect = kbSection.getBoundingClientRect();
          const viewH = window.innerHeight;
          const center = rect.top + rect.height / 2;
          const position = (center - viewH / 2) / (viewH / 2);
          const clamped = Math.max(-1, Math.min(1, position));

          const targetRotY = clamped * -6;
          const targetRotX = clamped * 3;
          const targetRot = -2.4 + clamped * 1.5;

          // Smooth lerp
          kbState.rotY += (targetRotY - kbState.rotY) * 0.08;
          kbState.rotX += (targetRotX - kbState.rotX) * 0.08;
          kbState.rot += (targetRot - kbState.rot) * 0.08;

          keyboard.style.transform = `perspective(1000px) rotateY(${kbState.rotY}deg) rotateX(${kbState.rotX}deg) rotate(${kbState.rot}deg)`;
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = menuBtn.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Fade-in on scroll med stagger
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.hero-content, .profiles-heading, .profiles-desc, .insta-card, .services-heading, .services-desc, .about-content, .team-card, .contact h2, .contact-sub, .contact-fancy-btn, .subscribe, .keyboard-section .integrations-keyboard').forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// Polaroid-kort fade-in via klasse (CSS håndterer alt)
const polaroidObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('polaroid-visible');
      polaroidObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.polaroid').forEach((el, i) => {
  el.style.setProperty('--delay', `${i * 0.15}s`);
  polaroidObserver.observe(el);
});

// Newsletter form
const subscribeForm = document.querySelector('.subscribe form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const btn = this.querySelector('.submit-btn');
    if (input.value) {
      btn.textContent = 'SENDT \u2713';
      btn.style.backgroundColor = 'hsl(88, 12%, 33%)';
      input.disabled = true;
      input.value = '';
      input.placeholder = 'Takk! Du er påmeldt.';
    }
  });
}

// Smooth scroll med offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// Lazy loading bilder
document.querySelectorAll('img').forEach(img => {
  if (!img.closest('header') && !img.closest('.hero')) {
    img.loading = 'lazy';
  }
});

// Prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('scroll-behavior', 'auto');
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
}

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const highlightNav = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('nav-active');
        }
      });
    }
  });
};

window.addEventListener('scroll', highlightNav, { passive: true });

// Tilbake til toppen med dobbeltklikk på header
header.addEventListener('dblclick', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
