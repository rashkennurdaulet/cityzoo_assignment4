/* =====================================================================
   Task 4 — BACKGROUND COLOUR BUTTON
   Task 5 — CURRENT DATE AND TIME
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Task 4: cycle through predefined page colours ---------- */
  var COLORS = ['#f4f7f5', '#e3f2fd', '#fff8e1', '#fce4ec', '#ede7f6', '#e0f7fa', '#e8f5e9'];
  var STORAGE_KEY = 'cityzoo-bg-index';
  var bgButton = document.getElementById('bg-color-btn');
  var index = 0;

  try { index = Number(localStorage.getItem(STORAGE_KEY)) || 0; } catch (e) { /* storage unavailable */ }

  function applyColor() {
    document.body.style.backgroundColor = COLORS[index];      // change the CSS background-color of <body>
  }

  if (bgButton) {
    applyColor();                                             // keep the chosen colour when opening another page
    bgButton.addEventListener('click', function () {
      index = (index + 1) % COLORS.length;                    // next colour, back to the first after the last
      applyColor();
      try { localStorage.setItem(STORAGE_KEY, String(index)); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- Task 5: live date and time, e.g. "October 21, 2026, 10:45:30 AM" ---------- */
  var clock = document.getElementById('current-datetime');

  function updateClock() {
    var now = new Date();                                     // JavaScript Date object
    var date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    var time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    clock.textContent = date + ', ' + time;
    clock.setAttribute('datetime', now.toISOString());
  }

  if (clock) {
    updateClock();
    setInterval(updateClock, 1000);                           // refresh every second
  }
})();
