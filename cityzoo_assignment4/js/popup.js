/* =====================================================================
   Task 3 — SUBSCRIPTION POP-UP
   The pop-up (#subscribe-popup) is hidden by default. Any element with
   data-popup-open opens it. It closes with: the X button / Cancel button
   (data-popup-close), a click on the dark area outside the box, or Esc.
   ===================================================================== */
(function () {
  'use strict';

  var overlay = document.getElementById('subscribe-popup');
  if (!overlay) return;

  var form = overlay.querySelector('form');
  var lastFocused = null;
  var closeTimer = null;

  function openPopup() {
    clearTimeout(closeTimer);
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-lock');
    requestAnimationFrame(function () { overlay.classList.add('visible'); });   // fade-in
    var first = overlay.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closePopup() {
    overlay.classList.remove('visible');                                         // fade-out
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-lock');
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      overlay.classList.remove('open');
      if (form) form.reset();                                                    // fresh form next time
      if (lastFocused) lastFocused.focus();
    }, 260);
  }

  document.querySelectorAll('[data-popup-open]').forEach(function (btn) {
    btn.addEventListener('click', openPopup);
  });
  overlay.querySelectorAll('[data-popup-close]').forEach(function (btn) {
    btn.addEventListener('click', closePopup);
  });

  // click outside the white box
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closePopup();
  });

  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') { closePopup(); return; }
    if (event.key === 'Tab') {                                                   // keep keyboard focus inside the pop-up
      var focusable = overlay.querySelectorAll('button, input, select, textarea, a[href]');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // after a successful subscription, show the thank-you message for 2 s, then close
  overlay.addEventListener('zoo:valid', function () {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closePopup, 2200);
  });
})();
