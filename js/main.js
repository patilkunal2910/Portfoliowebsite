// Portfolio Interactive Features & Logic

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initNavbar();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* -------------------------------------------------------------
 * 1. Dark / Light Theme Controller
 * ------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
  }

  function updateThemeIcons(isDark) {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(icon => {
      icon.classList.toggle('hidden', !isDark);
    });
    moonIcons.forEach(icon => {
      icon.classList.toggle('hidden', isDark);
    });
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

  // Initialize icon state
  updateThemeIcons(document.documentElement.classList.contains('dark'));

  // Listen for OS theme change if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      updateThemeIcons(e.matches);
    }
  });
}

/* -------------------------------------------------------------
 * 2. Typing Effect for Hero Subtitle
 * ------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = [
    'AIML Engineer',
    'Deep Learning Specialist',
    'LLM & NLP Developer',
    'Computer Vision Enthusiast'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* -------------------------------------------------------------
 * 3. Mobile Navigation & Scroll Spy
 * ------------------------------------------------------------- */
function initNavbar() {
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile menu
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Spy & Sticky navbar shadow
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;

    // Nav shadow on scroll
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add('shadow-sm', 'border-b', 'border-slate-200/80', 'dark:border-slate-800/80');
      } else {
        nav.classList.remove('shadow-sm', 'border-b', 'border-slate-200/80', 'dark:border-slate-800/80');
      }
    }

    // Active link highlighting
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 4. Project Filtering
 * ------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Update active button styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');
      });

      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');

      // Filter cards with smooth display
      projectCards.forEach(card => {
        const itemCategories = card.getAttribute('data-category') || '';
        if (category === 'all' || itemCategories.includes(category)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 5. Contact Form Simulation & Toast Notification
 * ------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      `;
    }

    // Simulate sending time
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      contactForm.reset();
      showToast('Thank you! Your message has been sent successfully.');
    }, 1000);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  if (!toast) return;

  if (toastMsg) toastMsg.textContent = message;
  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 4000);
}

/* -------------------------------------------------------------
 * 6. Back To Top Button
 * ------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
