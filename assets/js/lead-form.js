/* Commercial lead form — creates a Bitrix24 CRM Lead directly via crm.lead.add (client-side webhook call).
   Falls back to mailto if the webhook isn't configured or the request fails, so no lead is ever silently lost.
   All field values sent to Bitrix are English-only by design — no Russian strings in this file. */
(function () {
  'use strict';

  // TODO(Victor): set to your Bitrix24 incoming webhook base URL, e.g.
  // 'https://yourportal.bitrix24.com/rest/1/xxxxxxxxxxxxxxxx'
  // Scope the webhook to CRM only when you create it — this URL is public (visible in page source).
  var BITRIX_WEBHOOK_URL = 'https://fusedfw.bitrix24.com/rest/1/3wth6hjav7e7r6x8';
  var BITRIX_ASSIGNED_BY_ID = 1; // Victor
  var FALLBACK_EMAIL = 'support@acdcdfw.com';

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

  function bitrixLeadFields(data) {
    // Every literal here is English — this is the actual data written into the CRM record.
    return {
      TITLE: 'Website lead — ' + data.business,
      NAME: data.name,
      COMPANY_TITLE: data.business,
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: 'Problem: ' + data.issue + '\nSubmitted from: ' + data.page,
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: 'Commercial equipment repair page — lead form',
      STATUS_ID: 'NEW',
      ASSIGNED_BY_ID: BITRIX_ASSIGNED_BY_ID,
      OPENED: 'Y'
    };
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

        if (!BITRIX_WEBHOOK_URL) {
          // No webhook wired yet — hand off via email so the lead is never lost, and tell the user to also call.
          mailtoFallback(data);
          setStatus(form, 'Email drafted with your details — please send it, and call (469) 224-0577 for the fastest response.', false);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request a Callback'; }
          return;
        }

        fetch(BITRIX_WEBHOOK_URL + '/crm.lead.add.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: bitrixLeadFields(data),
            params: { REGISTER_SONET_EVENT: 'Y' }
          })
        }).then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
          .then(function (r) {
            if (!r.ok || !r.json || r.json.error || !r.json.result) throw new Error(r.json && r.json.error_description || 'bad response');
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
