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

  // --- VIRTUAL BRIEFING ROOM (Jitsi / 8x8 JaaS) ---
  var jitsiApi = null;
  var btnJoin = document.getElementById('btnJoinBriefing');
  var briefingGate = document.getElementById('briefingGate');
  var jaasContainer = document.getElementById('jaasContainer');
  var jaasLoading = document.getElementById('jaasLoading');
  var btnFullscreen = document.getElementById('btnFullscreenBriefing');
  var videoWrapper = document.getElementById('videoWrapper');

  if (btnJoin && briefingGate && jaasContainer) {
    btnJoin.addEventListener('click', function () {
      if (typeof JitsiMeetExternalAPI === 'undefined') {
        console.error('Jitsi external_api.js did not load — check the script tag in index.html.');
        return;
      }

      // Fade out the gate; Jitsi's own pre-join screen handles the
      // camera/mic permission prompt and preview from here, so there's
      // no separate permission request happening before this.
      briefingGate.style.opacity = '0';
      setTimeout(function () { briefingGate.style.display = 'none'; }, 300);

      var options = {
        roomName: 'vpaas-magic-cookie-3cdad222ce27409992f2b37f6b8d554e/Synergy_Briefing_Room',
        parentNode: jaasContainer,
        width: '100%',
        height: '100%',
        configOverwrite: {
          prejoinPageEnabled: true,
          disableThirdPartyRequests: true,
          disableDeepLinking: true
        },
        interfaceConfigOverwrite: {
          SHOW_CHROME_EXTENSION_BANNER: false,
          MOBILE_APP_PROMO: false
        }
      };

      jitsiApi = new JitsiMeetExternalAPI('8x8.vc', options);

      jitsiApi.addEventListener('videoConferenceJoined', function () {
        if (jaasLoading) jaasLoading.style.display = 'none';
      });
    });
  }

  if (btnFullscreen && videoWrapper) {
    btnFullscreen.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        videoWrapper.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }
});