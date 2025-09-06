// Page helpers: current year + inquiry form handling (FormSubmit AJAX)



document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('brandLogo');
  if (logo) {
    const svg = 'community-credits-logo.svg';
    const png = 'community-credits-logo.png';

    // Try SVG first
    logo.src = svg;

    // If the SVG fails to load, swap to PNG
    logo.onerror = () => {
      if (logo.src.includes(svg)) {
        logo.onerror = null;       // avoid loops
        logo.src = png;
      }
    };
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const formEl = document.getElementById('inquiryForm');
  if (!formEl) return;

  const successEl = document.getElementById('success');
  const errorEl   = document.getElementById('error');

  // ----- CONFIG: obfuscated recipient email (Base64) -----
  // Replace with a forwarding alias later if you like.
  const ENCODED_EMAIL = "amRlY2s4OEBnbWFpbC5jb20="; // "jdeck88@gmail.com"
  // -------------------------------------------------------

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (successEl) successEl.style.display = "none";
    if (errorEl)   errorEl.style.display   = "none";

    // quick validation
    const required = ['name','email','message','consent'];
    for (const id of required) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (id === 'consent' ? !el.checked : !el.value.trim()) {
        if (errorEl){
          errorEl.textContent = "Please complete the required fields and consent.";
          errorEl.style.display = "block";
        }
        return;
      }
    }
    // honeypot
    const hp = document.getElementById('website');
    if (hp && hp.value) {
      if (successEl) successEl.style.display = "block";
      formEl.reset();
      return;
    }

    try {
      const toEmail  = atob(ENCODED_EMAIL);
      const endpoint = "https://formsubmit.co/ajax/" + toEmail;

      const payload = new FormData(formEl);
      payload.append("_subject", "Community Credits — New Inquiry");
      payload.append("_captcha", "false");
      payload.append("_template", "table");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: payload
      });
      if (!res.ok) throw new Error("Network error");

      if (successEl) successEl.style.display = "block";
      formEl.reset();
    } catch (err) {
      if (errorEl) errorEl.style.display = "block";
    }
  });
});

