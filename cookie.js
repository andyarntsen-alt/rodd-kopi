// Cookie/personvern-banner
(function() {
  if (localStorage.getItem('rodd-cookies-accepted')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
        <circle cx="8.5" cy="8.5" r="1" fill="currentColor"/>
        <circle cx="10.5" cy="15.5" r="1" fill="currentColor"/>
        <circle cx="15.5" cy="13.5" r="1" fill="currentColor"/>
        <circle cx="7" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="11" r="1" fill="currentColor"/>
      </svg>
    </div>
    <h5>Vi respekterer personvernet ditt</h5>
    <p>Vi bruker informasjonskapsler for å forbedre opplevelsen din på nettsiden vår.
    <br>Les mer i vår <a href="personvern.html">personvernerklæring</a></p>
    <div class="cookie-actions">
      <button class="cookie-decline">Avvis</button>
      <button class="cookie-accept">Godta</button>
    </div>
  `;
  document.body.appendChild(banner);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('cookie-visible');
    });
  });

  banner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem('rodd-cookies-accepted', 'true');
    banner.classList.remove('cookie-visible');
    setTimeout(() => banner.remove(), 400);
  });

  banner.querySelector('.cookie-decline').addEventListener('click', () => {
    localStorage.setItem('rodd-cookies-accepted', 'declined');
    banner.classList.remove('cookie-visible');
    setTimeout(() => banner.remove(), 400);
  });
})();
