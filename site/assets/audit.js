// The free-audit form (audit.html). Records consent with the request: the exact
// consent text, the page and the time. With an endpoint configured
// (site.config.json → auditEndpoint) it POSTs JSON; until then it opens the
// visitor's own email app with the request filled in, and shows the address.
(() => {
  const form = document.getElementById('audit');
  if (!form) return;
  const msg = document.getElementById('a-msg');
  const say = (text, ok) => { msg.textContent = text; msg.className = ok ? 'notice ok' : 'notice'; msg.hidden = false; };
  const openedAt = Date.now();
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      company: form.company.value.trim(),
      website: form.website.value.trim(),
      email: form.email.value.trim(),
      consent: form.consent.checked,
      consent_text: form.querySelector('label[for="a-consent"]').textContent.trim(),
      page: location.href,
      at: new Date().toISOString(),
      // Bot checks the server uses: a hidden field people never fill, and when the page was opened.
      company_fax: form.company_fax.value,
      opened_at: openedAt,
    };
    if (!data.company || !data.website || !EMAIL.test(data.email)) return say('Completați numele firmei, site-ul și o adresă de email validă.');
    if (!data.consent) return say('Bifați căsuța de acord, ca să vă putem trimite auditul prin email.');

    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        return say('Mulțumim! Auditul ajunge pe email în 2 zile lucrătoare.', true);
      } catch {
        return say(`Nu am putut trimite cererea. Scrieți-ne direct la ${form.dataset.email}.`);
      }
    }
    const body = [
      'Cerere audit gratuit', '',
      `Firma: ${data.company}`, `Site: ${data.website}`, `Email: ${data.email}`, '',
      `Consimțământ: ${data.consent_text}`, `Pagina: ${data.page}`, `Data: ${data.at}`,
    ].join('\n');
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Cerere audit gratuit')}&body=${encodeURIComponent(body)}`;
    say(`Se deschide aplicația de email cu cererea completată; apăsați Trimite. Dacă nu se deschide, scrieți-ne la ${form.dataset.email}.`, true);
  });
})();
