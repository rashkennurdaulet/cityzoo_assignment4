/* =====================================================================
   Task 1 — FORM VALIDATION
   Works on every <form data-validate>. Each field describes its rules in
   a data-rules attribute, e.g.  data-rules="required|min:8|password"
   Rules: required | min:N | email | password | match:otherFieldId | range:MIN:MAX
   ===================================================================== */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each validator returns an error message, or '' when the value is OK.
  var validators = {
    required: function (v, arg, label) {
      return v.trim() === '' ? label + ' is required.' : '';
    },
    min: function (v, arg, label) {
      return v.trim().length < Number(arg) ? label + ' must be at least ' + arg + ' characters long.' : '';
    },
    email: function (v) {
      return EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address (e.g. name@example.com).';
    },
    password: function (v) {
      return /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Password must contain at least one letter and one number.';
    },
    match: function (v, arg) {
      var other = document.getElementById(arg);
      return other && v === other.value ? '' : 'Passwords do not match.';
    },
    range: function (v, arg, label) {
      var parts = arg.split(':'), min = Number(parts[0]), max = Number(parts[1]), n = Number(v);
      return Number.isInteger(n) && n >= min && n <= max ? '' : label + ' must be a whole number from ' + min + ' to ' + max + '.';
    }
  };

  function errorBox(input) {
    return document.getElementById(input.id + '-error');
  }

  function showError(input, message) {
    var box = errorBox(input);
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    if (box) { box.textContent = message; box.classList.add('d-block'); }
  }

  function showValid(input) {
    var box = errorBox(input);
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.removeAttribute('aria-invalid');
    if (box) { box.textContent = ''; box.classList.remove('d-block'); }
  }

  function clearState(input) {
    var box = errorBox(input);
    input.classList.remove('is-invalid', 'is-valid');
    input.removeAttribute('aria-invalid');
    if (box) { box.textContent = ''; box.classList.remove('d-block'); }
  }

  // Checks one field against its rules; stops at the first broken rule.
  function validateField(input) {
    var label = input.dataset.label || input.name || 'This field';
    var rules = (input.dataset.rules || '').split('|').filter(Boolean);
    for (var i = 0; i < rules.length; i++) {
      var colon = rules[i].indexOf(':');
      var name = colon === -1 ? rules[i] : rules[i].slice(0, colon);
      var arg = colon === -1 ? '' : rules[i].slice(colon + 1);
      var message = validators[name](input.value, arg, label);
      if (message) { showError(input, message); return false; }
    }
    showValid(input);
    return true;
  }

  function isTouched(input) {
    return input.classList.contains('is-invalid') || input.classList.contains('is-valid');
  }

  function setupForm(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-rules]'));
    var success = form.querySelector('.form-success');
    form.noValidate = true;                       // we show our own messages, not the browser's

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (success) success.classList.add('d-none');
        if (isTouched(input)) validateField(input);                       // live feedback after first check
        fields.forEach(function (other) {                                // password changed -> re-check confirmation
          if (other !== input && isTouched(other) && (other.dataset.rules || '').indexOf('match:' + input.id) !== -1) {
            validateField(other);
          }
        });
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();                                              // no server: validate, then show success
      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var values = {};
      fields.forEach(function (input) { if (input.type !== 'password') values[input.name] = input.value.trim(); });
      form.reset();                                                        // empties the form and clears the states
      if (success) success.classList.remove('d-none');
      form.dispatchEvent(new CustomEvent('zoo:valid', { bubbles: true, detail: values }));
    });

    form.addEventListener('reset', function () {
      fields.forEach(clearState);
      if (success) success.classList.add('d-none');
    });
  }

  document.querySelectorAll('form[data-validate]').forEach(setupForm);
})();
