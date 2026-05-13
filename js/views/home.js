/* ============================================================
   views/home.js — Welcome / landing page
   ============================================================ */

var HubViews = HubViews || {};

HubViews.home = (function () {

  function render() {
    var html = '';
    html += '<div class="content-area">';
    html += '<div class="home-hero">';
    html += '<div class="home-hero-logo">';
    html += renderLogoLarge();
    html += '</div>';
    html += '<h1 class="home-hero-title">HUB de Adquirencia</h1>';
    html += '<p class="home-hero-subtitle">';
    html += 'Portal de documentaci\u00f3n e integraci\u00f3n para las APIs de adquirencia de Redsys. ';
    html += 'Consulta la documentaci\u00f3n, prueba los endpoints y genera ejemplos de c\u00f3digo.';
    html += '</p>';
    html += '<div class="home-stats">';
    html += '<div class="home-stat"><div class="home-stat-number">3</div><div class="home-stat-label">APIs</div></div>';
    html += '<div class="home-stat"><div class="home-stat-number">24</div><div class="home-stat-label">Servicios</div></div>';
    html += '<div class="home-stat"><div class="home-stat-number">6</div><div class="home-stat-label">Lenguajes</div></div>';
    html += '<div class="home-stat"><div class="home-stat-number">2</div><div class="home-stat-label">Entornos</div></div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="home-cards">';

    // Comercios card
    html += '<div class="home-api-card" data-navigate="comercios-alta-comercio">';
    html += '<div class="home-api-card-icon" style="background:rgba(249,115,22,0.15);">&#127978;</div>';
    html += '<div class="home-api-card-title">API Comercios</div>';
    html += '<div class="home-api-card-desc">';
    html += 'Gesti\u00f3n completa de comercios: alta, modificaci\u00f3n, consulta individual y listado con filtros.';
    html += '</div>';
    html += '<div class="home-api-card-count">4 servicios &bull; v1.12</div>';
    html += '</div>';

    // Perfiles card
    html += '<div class="home-api-card" data-navigate="perfiles-alta-perfil">';
    html += '<div class="home-api-card-icon" style="background:rgba(251,191,36,0.15);">&#9881;</div>';
    html += '<div class="home-api-card-title">API Perfiles</div>';
    html += '<div class="home-api-card-desc">';
    html += 'Configuraci\u00f3n de perfiles de comercio: par\u00e1metros de pago, DCC, propinas, recarga y m\u00e1s.';
    html += '</div>';
    html += '<div class="home-api-card-count">4 servicios &bull; v2.3</div>';
    html += '</div>';

    // Terminales card
    html += '<div class="home-api-card" data-navigate="terminales-consulta-terminal">';
    html += '<div class="home-api-card-icon" style="background:rgba(59,130,246,0.15);">&#128241;</div>';
    html += '<div class="home-api-card-title">API Terminales</div>';
    html += '<div class="home-api-card-desc">';
    html += 'Gesti\u00f3n de terminales no presenciales: alta, baja, m\u00e9todos de pago, grupos y operaciones.';
    html += '</div>';
    html += '<div class="home-api-card-count">16 servicios &bull; v1.6</div>';
    html += '</div>';

    html += '</div>'; // home-cards

    // Quick start
    html += '<div class="card">';
    html += '<div class="card-header">';
    html += '<span style="font-size:1.2rem;">&#9889;</span>';
    html += '<div>';
    html += '<div class="card-title">Gu\u00eda R\u00e1pida</div>';
    html += '<div class="card-subtitle">C\u00f3mo empezar a usar el HUB</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="quickstart-steps">';

    html += '<div class="quickstart-step">';
    html += '<div class="step-number">1</div>';
    html += '<div class="step-content">';
    html += '<div class="step-title">Selecciona un servicio</div>';
    html += '<div class="step-desc">Navega por el men\u00fa lateral y elige la API y el servicio que necesitas documentar o probar.</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="quickstart-step">';
    html += '<div class="step-number">2</div>';
    html += '<div class="step-content">';
    html += '<div class="step-title">Revisa la documentaci\u00f3n</div>';
    html += '<div class="step-desc">Consulta la tabla de par\u00e1metros, los ejemplos de request/response y los c\u00f3digos de respuesta.</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="quickstart-step">';
    html += '<div class="step-number">3</div>';
    html += '<div class="step-content">';
    html += '<div class="step-title">Configura tus credenciales</div>';
    html += '<div class="step-desc">En la pesta\u00f1a "Consola de Pruebas", expande el panel de credenciales e introduce tu RedsysClientId y RedsysClientSecret.</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="quickstart-step">';
    html += '<div class="step-number">4</div>';
    html += '<div class="step-content">';
    html += '<div class="step-title">Env\u00eda la petici\u00f3n</div>';
    html += '<div class="step-desc">Selecciona el entorno (Integraci\u00f3n / Producci\u00f3n), edita el body JSON y pulsa "Enviar". La respuesta aparecer\u00e1 en tiempo real.</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="quickstart-step">';
    html += '<div class="step-number">5</div>';
    html += '<div class="step-content">';
    html += '<div class="step-title">Genera c\u00f3digo</div>';
    html += '<div class="step-desc">Usa la pesta\u00f1a "Ejemplos de C\u00f3digo" para obtener snippets en cURL, PHP, Python, Node.js, Java y C#.</div>';
    html += '</div>';
    html += '</div>';

    html += '</div>'; // quickstart-steps
    html += '</div>'; // card

    // CORS notice
    html += '<div class="alert alert-warning">';
    html += '<span class="alert-icon">&#9888;</span>';
    html += '<div>';
    html += '<strong>Nota sobre CORS:</strong> Si abres este archivo directamente desde el sistema de archivos (<code>file://</code>), ';
    html += 'las llamadas a la API fallar\u00e1n por restricciones de CORS. ';
    html += 'Para probar la consola, sirve el directorio con un servidor local: ';
    html += '<code>python -m http.server 8080</code> o <code>npx serve .</code>';
    html += '</div>';
    html += '</div>';

    // Auth info
    html += '<div class="info-box">';
    html += '<strong>Autenticaci\u00f3n:</strong> Todas las APIs usan autenticaci\u00f3n HTTP Basic (Base64 de clientId:clientSecret). ';
    html += 'La API de Terminales adem\u00e1s requiere firma HMAC-SHA256 sobre el campo <code>info.data</code> con el tipo de firma <code>T29V2</code>.';
    html += '</div>';

    html += '</div>'; // content-area
    return html;
  }

  function renderLogoLarge() {
    return '<svg width="100" height="52" viewBox="0 0 100 52" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<radialGradient id="flameGradL" cx="50%" cy="60%" r="55%">' +
      '<stop offset="0%" stop-color="#fbbf24"/>' +
      '<stop offset="60%" stop-color="#f97316"/>' +
      '<stop offset="100%" stop-color="#ea580c"/>' +
      '</radialGradient>' +
      '</defs>' +
      // Flame (circle with bite)
      '<circle cx="22" cy="26" r="20" fill="url(#flameGradL)"/>' +
      '<circle cx="34" cy="14" r="10" fill="#0f0f1a"/>' +
      // Hub icon
      '<circle cx="78" cy="26" r="20" fill="none" stroke="#f97316" stroke-width="2"/>' +
      '<circle cx="78" cy="12" r="4" fill="#f97316"/>' +
      '<circle cx="66" cy="34" r="4" fill="#f97316"/>' +
      '<circle cx="90" cy="34" r="4" fill="#f97316"/>' +
      '<line x1="78" y1="16" x2="78" y2="26" stroke="#f97316" stroke-width="2"/>' +
      '<line x1="69" y1="31" x2="76" y2="26" stroke="#f97316" stroke-width="2"/>' +
      '<line x1="87" y1="31" x2="80" y2="26" stroke="#f97316" stroke-width="2"/>' +
      '<circle cx="78" cy="26" r="4" fill="#fbbf24"/>' +
      '</svg>';
  }

  return { render: render };

})();
