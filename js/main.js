/**
 * VEXTORIX - Main JavaScript
 * Light, fast, accessible functionality (No external dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on any link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        mobileToggle.focus();
      }
    });
  }

  // 2. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');
      
      // Close all other accordion items for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isCurrentlyActive);
      questionBtn.setAttribute('aria-expanded', !isCurrentlyActive);
    });
  });

  // 3. Email Copy with Toast Notification
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'support@vextorix.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('¡Correo copiado al portapapeles!');
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('¡Correo copiado al portapapeles!');
      }
    });
  });

  // 4. Update Current Year
  const yearElements = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // 5. Header Elevation on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
        header.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      } else {
        header.style.boxShadow = 'none';
        header.style.borderColor = 'var(--border-subtle)';
      }
    }, { passive: true });
  }

  // 6. Active Navigation Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || href.endsWith(`#${id}`)) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
});
