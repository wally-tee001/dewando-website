// Toggle About Items (expandable sections)
function toggleAboutItem(header) {
  const aboutItem = header.closest('.about-item');
  const isActive = aboutItem.classList.toggle('active');
  
  // Smooth animation
  const content = aboutItem.querySelector('.about-item-content');
  if (isActive) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = '0';
  }
}

// Toggle Service Details (expandable service info)
function toggleServiceDetails(button) {
  const serviceBox = button.closest('.service-box');
  const details = serviceBox.querySelector('.service-details');
  const isHidden = details.style.display === 'none' || details.style.display === '';
  
  if (isHidden) {
    details.style.display = 'block';
    button.textContent = 'Show Less ▲';
  } else {
    details.style.display = 'none';
    button.textContent = 'Learn More ▼';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navList = document.getElementById('nav-list');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked (mobile)
    navList.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Contact form handling (client-side only)
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      const errors = [];
      if (!name) errors.push('name');
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('email');
      if (!message) errors.push('message');

      if (errors.length) {
        // Simple inline feedback: focus first invalid
        const field = contactForm.querySelector('[name="' + errors[0] + '"]');
        if (field) field.focus();
        return;
      }

      // Simulate a submission (no backend). Show success message and reset form.
      contactForm.reset();
      if (formSuccess) {
        formSuccess.hidden = false;
        setTimeout(() => (formSuccess.hidden = true), 5000);
      }
    });
  }

  // Appointment form handling
  const appointmentForm = document.getElementById('appointment-form');
  const aptSuccess = document.getElementById('apt-success');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Clear previous errors
      appointmentForm.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
      });

      const get = (name) => appointmentForm.elements[name] ? appointmentForm.elements[name].value.trim() : '';
      const vals = {
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        service: get('service'),
        date: get('date'),
        time: get('time')
      };

      const errors = {};
      if (!vals.name) errors.name = 'Please enter your full name.';
      if (!vals.phone) errors.phone = 'Please enter a phone number.';
      if (!vals.email || !/^\S+@\S+\.\S+$/.test(vals.email)) errors.email = 'Please enter a valid email.';
      if (!vals.service) errors.service = 'Please choose a service.';
      if (!vals.date) errors.date = 'Please pick a date.';
      if (!vals.time) errors.time = 'Please pick a time.';

      // Display errors inline
      if (Object.keys(errors).length) {
        for (const k in errors) {
          const field = appointmentForm.querySelector('[name="' + k + '"]');
          if (field) {
            const errEl = field.closest('.form-row')?.querySelector('.form-error');
            if (errEl) {
              errEl.textContent = errors[k];
              errEl.classList.add('show');
            }
          }
        }
        // focus first invalid
        const first = appointmentForm.querySelector('.form-error.show');
        if (first) {
          const fld = first.closest('.form-row')?.querySelector('input,select,textarea');
          if (fld) fld.focus();
        }
        return;
      }

      // Simulate booking with animation
      const submitBtn = appointmentForm.querySelector('.btn-primary');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Booking...';

      setTimeout(() => {
        appointmentForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Book Appointment';
        
        if (aptSuccess) {
          aptSuccess.classList.add('show');
          setTimeout(() => {
            aptSuccess.classList.remove('show');
          }, 5000);
        }
      }, 1000);
    });
  }

  // Ensure appointment date cannot be set to a past date
  const aptDate = document.getElementById('apt-date');
  if (aptDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    aptDate.min = `${yyyy}-${mm}-${dd}`;
  }

  // Animate service boxes when they enter the viewport
  const serviceBoxes = document.querySelectorAll('.service-box');
  if ('IntersectionObserver' in window && serviceBoxes.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    serviceBoxes.forEach((el) => obs.observe(el));
  } else {
    // Fallback: reveal all
    serviceBoxes.forEach((el) => el.classList.add('in-view'));
  }

  // Simple carousel implementation
  (function initCarousel() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    const slidesWrap = carousel.querySelector('.slides');
    const slides = carousel.querySelectorAll('.slide');
    const prev = carousel.querySelector('.carousel-control.prev');
    const next = carousel.querySelector('.carousel-control.next');
    const indicators = carousel.querySelector('.carousel-indicators');
    let index = 0;
    let timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      updateIndicators();
    }

    function updateIndicators() {
      if (!indicators) return;
      indicators.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
      const btn = indicators.querySelector(`button[data-slide="${index}"]`);
      if (btn) btn.classList.add('active');
    }

    // build indicators
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('data-slide', String(i));
      btn.addEventListener('click', () => goTo(i));
      indicators.appendChild(btn);
    });

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));

    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => startAutoplay());

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 4000);
    }

    goTo(0);
    startAutoplay();
  })();
});
