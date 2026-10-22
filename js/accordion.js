/* =====================================================================
   Task 2 — ACCORDION (FAQ)
   Every .faq-item has a button (.faq-question) and a panel (.faq-panel).
   Panels are closed by default (max-height: 0 in CSS). A click opens the
   panel by setting max-height to its real height (CSS animates it) and a
   second click closes it again.
   ===================================================================== */
(function () {
  'use strict';

  var items = document.querySelectorAll('.faq-item');

  function setOpen(item, open) {
    var button = item.querySelector('.faq-question');
    var panel = item.querySelector('.faq-panel');
    item.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  }

  items.forEach(function (item) {
    item.querySelector('.faq-question').addEventListener('click', function () {
      setOpen(item, !item.classList.contains('open'));
    });
  });

  // keep open panels the right height when the window is resized
  window.addEventListener('resize', function () {
    items.forEach(function (item) {
      if (item.classList.contains('open')) {
        item.querySelector('.faq-panel').style.maxHeight = item.querySelector('.faq-panel').scrollHeight + 'px';
      }
    });
  });
})();
