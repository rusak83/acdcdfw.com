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

  // GA4 Measurement Protocol — direct server-reachable hit, sent only after Bitrix confirms the
  // lead was actually created. Exists because analytics.google.com/g/collect (the normal
  // gtag/GTM path used by pushDataLayer below) gets blocked by ad blockers/DNS filters for a real
  // share of visitors (confirmed 2026-07-10: a real form submission created Bitrix lead #30009
  // but 0 generate_lead events reached GA4 that day). www.google-analytics.com/mp/collect is a
  // different endpoint that survives that blocking in testing, so it's used as a second, more
  // reliable path — not a replacement for GTM, a backstop for when GTM's path gets dropped.
  // Note: this API secret is write-only (can create noisy events, cannot read any data), and is
  // necessarily public since it ships in client JS — accepted trade-off for a single-file fix
  // with no separate backend/webhook system.
  var GA4_MEASUREMENT_ID = 'G-3LR1C6XDEC';
  var GA4_MP_API_SECRET = 'hfkn3EeIQ4-tUpURMlNjWQ';

  function setStatus(form, text, isError) {
    var el = form.querySelector('.lead-form-status');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-error', !!isError);
    el.classList.add('is-visible');
  }

  // GA4/GTM signal. Deliberately excludes name/phone — GA4's terms prohibit sending PII in event params.
  function pushDataLayer(eventName, extra) {
    if (!window.dataLayer) return;
    window.dataLayer.push(Object.assign({
      event: eventName,
      lead_form_id: 'commercial-lead-form',
      page_path: window.location.pathname
    }, extra || {}));
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Reads the real GA4 client_id from the _ga cookie so this hit links to the visitor's actual
  // session/source/medium instead of showing up as an orphaned event. Falls back to a stored
  // synthetic id only if _ga was never set (e.g. that cookie itself got blocked too) — still
  // records the conversion, just without session attribution.
  function getGA4ClientId() {
    var ga = getCookie('_ga');
    if (ga) {
      var parts = ga.split('.');
      if (parts.length >= 4) return parts[2] + '.' + parts[3];
    }
    var fallbackKey = 'ga4_mp_fallback_cid';
    var stored = null;
    try { stored = localStorage.getItem(fallbackKey); } catch (e) {}
    if (stored) return stored;
    var generated = 'srv.' + Date.now() + '.' + Math.floor(Math.random() * 1e9);
    try { localStorage.setItem(fallbackKey, generated); } catch (e) {}
    return generated;
  }

  function sendMeasurementProtocolHit(eventName, extra) {
    try {
      var body = JSON.stringify({
        client_id: getGA4ClientId(),
        events: [{
          name: eventName,
          params: Object.assign({ engagement_time_msec: '100' }, extra || {})
        }]
      });
      fetch('https://www.google-analytics.com/mp/collect?measurement_id=' + GA4_MEASUREMENT_ID + '&api_secret=' + GA4_MP_API_SECRET, {
        method: 'POST',
        body: body,
        keepalive: true
      }).catch(function () {}); // best-effort — analytics must never block or break the actual lead
    } catch (e) { /* same — never let this throw into the submit handler */ }
  }

  function mailtoFallback(data) {
    var subject = encodeURIComponent('Service request — ' + (data.business || data.name));
    var body = encodeURIComponent(
      'Name: ' + data.name + '\n' +
      'Phone: ' + data.phone + '\n' +
      (data.business ? 'Business/Brand: ' + data.business + '\n' : '') +
      'Problem: ' + data.issue
    );
    window.location.href = 'mailto:' + FALLBACK_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  function bitrixLeadFields(data) {
    // Every literal here is English — this is the actual data written into the CRM record.
    return {
      TITLE: 'Website lead — ' + (data.business || data.name),
      NAME: data.name,
      COMPANY_TITLE: data.business || undefined,
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: 'Problem: ' + data.issue + '\nSubmitted from: ' + data.page,
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: (document.title.split('|')[0].trim() || 'Website') + ' — lead form',
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

        if (!data.name || !data.phone || !data.issue) {
          setStatus(form, 'Please fill in every field so we can call you back fast.', true);
          return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        if (!BITRIX_WEBHOOK_URL) {
          // No webhook wired yet — hand off via email so the lead is never lost, and tell the user to also call.
          pushDataLayer('lead_form_fallback', { fallback_reason: 'not_configured' });
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
            pushDataLayer('generate_lead', { lead_source: 'commercial_page_form' });
            sendMeasurementProtocolHit('generate_lead', {
              lead_source: 'commercial_page_form',
              lead_form_id: 'commercial-lead-form',
              lead_id: String(r.json.result)
            });
            form.reset();
            setStatus(form, "Got it — we'll call you back shortly. For anything urgent, call (469) 224-0577 directly.", false);
          }).catch(function () {
            pushDataLayer('lead_form_fallback', { fallback_reason: 'network_error' });
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
