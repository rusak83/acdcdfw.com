/* Commercial lead form — submits to n8n webhook, falls back to mailto if unset/unreachable so no lead is ever silently lost. */
(function () {
  'use strict';

  // TODO(Victor): replace with the real n8n webhook URL once the workflow exists.
  var LEAD_WEBHOOK_URL = '';
  var FALLBACK_EMAIL = 'support@acdchomeservices.com';

  function setStatus(form, text, isError) {
    var el = form.querySelector('.lead-form-status');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
    el.classList.add('is-visible');
  }

  function mailtoFallback(data) {
    var subject = encodeURIComponent('Commercial service request — ' + (data.business || data.name));
    var body = encodeURIComponent(
      'Name: ' + data.name + '\n' +
      'Phone: ' + data.phone + '\n' +
      'Business: ' + data.business + '\n' +
      'Problem: ' + data.issue
    );
    window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  function initLeadForms() {
    document.querySelectorAll('form.lead-form').forEach(function (form) {
      if (form.dataset.leadFormBound === 'true') return;
      form.dataset.leadFormBound = 'true';

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var fd = new FormData(form);
        var data = {
          name: (fd.get('name') || '').toString().trim(),
          phone: (fd.get('phone') || '').toString().trim(),
          business: (fd.get('business') || '').toString().trim(),
          issue: (fd.get('issue') || '').toString().trim(),
          page: window.location.pathname
        };

        if (!data.name || !data.phone || !data.business || !data.issue) {
          setStatus(form, 'Please fill in every field so we can call you back fast.', true);
          return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        if (!LEAD_WEBHOOK_URL) {
          // No backend wired yet — hand off via email so the lead is never lost, and tell the user to also call.
          mailtoFallback(data);
          setStatus(form, 'Email drafted with your details — please send it, and call (469) 224-0577 for the fastest response.', false);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request a Callback'; }
          return;
        }

        fetch(LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error('bad status');
          form.reset();
          setStatus(form, "Got it — we'll call you back shortly. For anything urgent, call (469) 224-0577 directly.", false);
        }).catch(function () {
          mailtoFallback(data);
          setStatus(form, "Couldn't reach our system — email drafted instead. Please also call (469) 224-0577 directly.", true);
        }).finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request a Callback'; }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initLeadForms);
})();
