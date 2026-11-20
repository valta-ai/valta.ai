// valta.ai "Get onboarded" form -> Brevo hosted form (same pattern as valtagc.com).
// Brevo's API key can't run on Cloudflare (IP authorisation), so the browser posts
// straight to the Brevo hosted form. Field names must match that Brevo form.
(function () {
  var BREVO_FORM_URL = 'https://54461d99.sibforms.com/serve/MUIFAN7TFrrJ51d6jDvwgv3BPR7IFVtIo7k0_KLjz_maOnsXv7lCMa8y-CL-oxNAp365Qdk6NWRlsHkGVb9QPVp-AvEQy2alcB6wy7jYPxIi8o_yHLCEIUiPXkDjsv2wkidac-OVGIg9SlBbmz6gSX3nSO-ltAZsMBXTsI2X_bTSP9yQ9gyrHf6pbiemdQRLMFzC7xdrAFv12VMt'; // Brevo form "contact valta ai" -> list "Valta AI"
  var form = document.getElementById('valta-lead-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var fd = new FormData(form);
    var v = function (k) { return String(fd.get(k) || '').trim(); };
    var notes = '[valta.ai Get onboarded]\nCompany: ' + v('company') + '\nIndustry: ' + v('industry') +
      '\nTrade: ' + v('trade') + '\nPlan: ' + v('plan') + (v('message') ? '\n\n' + v('message') : '');

    (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_name: 'get_onboarded', industry: v('industry'), plan: v('plan') });

    if (BREVO_FORM_URL.indexOf('PASTE_') === 0) {
      var body = 'Name: ' + v('firstName') + ' ' + v('lastName') + '\nEmail: ' + v('email') + '\nPhone: ' + v('phone') + '\n' + notes;
      window.location.href = 'mailto:contact@valta.ai?subject=' + encodeURIComponent('Get onboarded: ' + v('company')) + '&body=' + encodeURIComponent(body);
      return;
    }

    var b = new FormData();
    b.append('FIRSTNAME', v('firstName'));
    b.append('LASTNAME', v('lastName'));
    b.append('EMAIL', v('email'));
    b.append('PHONE', v('phone'));
    b.append('NOTES', notes);
    b.append('email_address_check', '');
    b.append('locale', 'en');
    fetch(BREVO_FORM_URL, { method: 'POST', mode: 'no-cors', body: b }).catch(function () {});

    form.innerHTML =
      '<div style="padding:24px 0;text-align:center">' +
      '<h3 role="status" style="margin:0 0 8px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:32px;letter-spacing:1px;text-transform:uppercase;color:#3DDC97">You\'re in.</h3>' +
      '<p style="margin:0;font-size:17px;color:#C9D3E0">Thanks — your account manager will contact you within one business day.</p></div>';
  });
})();
