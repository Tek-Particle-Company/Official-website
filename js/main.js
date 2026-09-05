/* =====================================================
   NEXORA — UI Interactions (Vanilla JS)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky navbar on scroll ---------- */
  const navbar = document.querySelector('.navbar-nexora');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Mobile menu toggle animation ---------- */
  const toggler = document.querySelector('.navbar-toggler-custom');
  const navCollapse = document.getElementById('mainNav');

  if (toggler && navCollapse) {
    navCollapse.addEventListener('show.bs.collapse', () => toggler.classList.add('active'));
    navCollapse.addEventListener('hide.bs.collapse', () => toggler.classList.remove('active'));

    // Close menu on link click (mobile)
    navCollapse.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      });
    });
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Scroll reveal (lightweight IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Bootstrap form validation UI ---------- */
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', async function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      e.preventDefault();

      const serviceSelect = form.querySelector('#service') || form.querySelector('#topic');
      const emailInput = form.querySelector('#workEmail');
      const mobileInput = form.querySelector('#mobileNumber');
      const service = serviceSelect ? serviceSelect.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const mobile = mobileInput ? mobileInput.value.trim() : '';

      const subjectField = form.querySelector('input[name="_subject"]');
      if (subjectField) {
        const baseSubject = subjectField.defaultValue || subjectField.value || 'New Inquiry';
        subjectField.value = service ? `${baseSubject}: ${service}` : baseSubject;
      }

      const replyToField = form.querySelector('input[name="_replyto"]');
      if (replyToField && email) {
        replyToField.value = email;
      }

      const mobileField = form.querySelector('input[name="mobileNumber"]');
      if (mobileField && mobile) {
        mobileField.value = mobile;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : '';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Sending...';
      }

      try {
        const payload = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: payload,
          headers: {
            'Accept': 'application/json'
          }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          const message = result.message || 'The form could not be submitted right now.';
          if (btn) {
            btn.innerHTML = 'Action needed';
          }
          window.alert(message + ' Check business@tekparticle.online for the activation email from FormSubmit, then click the activation link and try again.');
          throw new Error(message);
        }

        if (btn) {
          btn.innerHTML = 'Message sent';
        }

        form.classList.remove('was-validated');
        form.reset();

        const successBox = document.createElement('div');
        successBox.className = 'alert alert-success mt-3 mb-0';
        successBox.textContent = 'Your message has been sent successfully. We will get back to you soon.';

        const existingAlert = form.parentNode.querySelector('.form-success-message');
        if (existingAlert) existingAlert.remove();

        successBox.classList.add('form-success-message');
        form.parentNode.appendChild(successBox);
      } catch (error) {
        if (btn) {
          btn.innerHTML = 'Send failed';
        }
        console.error('Email send failed:', error);
      } finally {
        if (btn) {
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2200);
        }
      }
    }, false);
  });

  /* ---------- Set active nav link based on current page ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nexora .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
