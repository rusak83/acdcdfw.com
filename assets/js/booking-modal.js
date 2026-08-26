/* Booking modal — intercepts every "Book Online" link (HousecallPro) and opens the
   existing "Can't Call Right Now?" callback form in a modal instead, so every page has
   one consistent, Bitrix-wired, SMS-compliant booking path instead of the HCP widget.
   Injected once per page. lead-form.js (loaded alongside) binds the modal's form exactly
   like every other .lead-form instance — nothing in lead-form.js changes for this. */
(function () {
  'use strict';

  var MODAL_ID = 'booking-modal';
  if (document.getElementById(MODAL_ID)) return;

  var modalHTML =
    '<div class="booking-modal-overlay" id="' + MODAL_ID + '" aria-hidden="true">' +
      '<div class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">' +
        '<button type="button" class="booking-modal-close" aria-label="Close">&times;</button>' +
        '<div class="lead-form-card">' +
          '<h3 id="booking-modal-title">Can’t Call Right Now?</h3>' +
          '<p class="lead-form-note">Request a callback — we respond fast, even after hours.</p>' +
          '<form class="lead-form contact-form" id="booking-modal-lead-form">' +
            '<div class="form-group">' +
              '<label for="booking-modal-name">Full name</label>' +
              '<input id="booking-modal-name" type="text" name="name" placeholder="Jane Smith" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="booking-modal-phone">Phone</label>' +
              '<input id="booking-modal-phone" type="tel" name="phone" placeholder="(469) 000-0000" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="booking-modal-business">Brand / model (if known)</label>' +
              '<input id="booking-modal-business" type="text" name="business" placeholder="Sub-Zero, Samsung, etc.">' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="booking-modal-issue">What’s happening?</label>' +
              '<textarea id="booking-modal-issue" name="issue" placeholder="Not cooling since this morning..." required></textarea>' +
            '</div>' +
            '<div class="form-group form-group-consent">' +
              '<label class="consent-check">' +
                '<input type="checkbox" name="sms_informational_consent" required>' +
                '<span>I consent to receive informational text messages (appointment updates, technician en route alerts, and service reminders) from AC-DC HVAC &amp; Appliance Repair LLC at the phone number provided above. Message frequency varies. Message and data rates may apply. Reply HELP for help, STOP to opt out. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. See our <a href="/sms-terms.html" target="_blank" rel="noopener">SMS Terms &amp; Conditions</a>.</span>' +
              '</label>' +
            '</div>' +
            '<div class="form-group form-group-consent">' +
              '<label class="consent-check">' +
                '<input type="checkbox" name="sms_marketing_consent">' +
                '<span>I also consent to receive occasional marketing and promotional text messages (seasonal maintenance offers, special promotions) from AC-DC HVAC &amp; Appliance Repair LLC at the phone number provided above. Message frequency varies. Message and data rates may apply. Reply HELP for help, STOP to opt out at any time.</span>' +
              '</label>' +
            '</div>' +
            '<button type="submit" class="btn btn-primary">Request a Callback</button>' +
            '<div class="lead-form-status" role="status" aria-live="polite"></div>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  var overlay = document.getElementById(MODAL_ID);
  var closeBtn = overlay.querySelector('.booking-modal-close');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('booking-modal-lock');
    var firstField = overlay.querySelector('#booking-modal-name');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('booking-modal-lock');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest ? event.target.closest('a[href*="book.housecallpro.com"]') : null;
    if (trigger) {
      event.preventDefault();
      openModal();
      return;
    }
    if (event.target === overlay) closeModal();
  });

  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });
})();
