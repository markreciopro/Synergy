// SYNERGY PLACEMENT AGENCY — Behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    var closeMenu = function () {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu after tapping a link (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Nav shadow once the page scrolls past the top
  var nav = document.querySelector('.sy-nav');
  if (nav) {
    var toggleNavShadow = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    toggleNavShadow();
    window.addEventListener('scroll', toggleNavShadow, { passive: true });
  }

  // Scroll-reveal for sections
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Keep the footer copyright year current automatically
  var yearEl = document.getElementById('sy-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- VIRTUAL BRIEFING ROOM CONTROLLER ---
  var btnAuthorize = document.getElementById('btnAuthorizeBriefing');
  var btnDisconnect = document.getElementById('btnDisconnectBriefing');
  var initialConsole = document.getElementById('consoleInitialState');
  var connectedConsole = document.getElementById('consoleConnectedState');
  var videoElement = document.getElementById('userBriefingCamera');
  var cameraFallback = document.getElementById('cameraFallbackPlaceholder');
  var streamInstance = null;

  if (btnAuthorize && initialConsole && connectedConsole) {
    btnAuthorize.addEventListener('click', function () {
      // Toggle console visual states
      initialConsole.classList.add('d-none');
      connectedConsole.classList.remove('d-none');

      // Request browser environment media stream capabilities (Camera/Mic)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(function (stream) {
            streamInstance = stream;
            if (videoElement) {
              videoElement.srcObject = stream;
              if (cameraFallback) cameraFallback.classList.add('d-none');
            }
          })
          .catch(function (error) {
            console.warn("Camera tracking blocked or not found: ", error);
            // Gracefully leave background fallback text on screen if blocked
          });
      }
    });
  }

  if (btnDisconnect && initialConsole && connectedConsole) {
    btnDisconnect.addEventListener('click', function () {
      // Safely close media tracks
      if (streamInstance) {
        streamInstance.getTracks().forEach(function (track) {
          track.stop();
        });
        streamInstance = null;
      }
      
      if (videoElement) videoElement.srcObject = null;
      if (cameraFallback) cameraFallback.classList.remove('d-none');

      // Reset panels back to handshake gate
      connectedConsole.classList.add('d-none');
      initialConsole.classList.remove('d-none');
    });
  }
});