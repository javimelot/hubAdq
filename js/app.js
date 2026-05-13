/**
 * HUB Acquirer - Main Application
 */
(function () {
  'use strict';

  const VIEWS = {
    'com-alta':    () => ComerciosViews.alta(),
    'com-mod':     () => ComerciosViews.modificacion(),
    'com-consulta':() => ComerciosViews.consulta(),
    'com-listado': () => ComerciosViews.listado(),
    'per-alta':    () => PerfilesViews.alta(),
    'per-mod':     () => PerfilesViews.modificacion(),
    'per-baja':    () => PerfilesViews.baja(),
    'per-consulta':() => PerfilesViews.consulta(),
    'ter-consulta':    () => TerminalesViews.consulta(),
    'ter-clave':       () => TerminalesViews.clave(),
    'ter-lista':       () => TerminalesViews.lista(),
    'ter-alta':        () => TerminalesViews.alta(),
    'ter-mod':         () => TerminalesViews.modificacion(),
    'ter-baja':        () => TerminalesViews.baja(),
    'ter-reactiva':    () => TerminalesViews.reactivacion(),
    'ter-metodo-alta': () => TerminalesViews.metodoAlta(),
    'ter-metodo-mod':  () => TerminalesViews.metodoMod(),
    'ter-metodo-baja': () => TerminalesViews.metodoBaja(),
    'firma-doc':   () => FirmaView.render()
  };

  let currentView = null;

  function init() {
    setupNav();
    setupSettings();
    setupSearch();
    setupSidebarCollapse();
    updateEnvBadge();

    const hash = location.hash.slice(1);
    if (hash && VIEWS[hash]) navigateTo(hash);
    else renderWelcome();
  }

  function setupNav() {
    document.querySelectorAll('[data-view]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(a.getAttribute('data-view'));
      });
    });
  }

  function navigateTo(key) {
    const fn = VIEWS[key];
    if (!fn) return;
    currentView = key;
    location.hash = key;

    document.querySelectorAll('[data-view]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-view') === key);
    });

    const main = document.getElementById('main-content');
    main.innerHTML = fn();
    main.scrollTop = 0;
  }

  function renderWelcome() {
    document.getElementById('main-content').innerHTML = WelcomeView.render();
  }

  function setupSettings() {
    const btn   = document.getElementById('btn-settings');
    const modal = document.getElementById('modal-settings');
    const close = document.getElementById('modal-close');
    const save  = document.getElementById('cfg-save');

    btn.addEventListener('click', () => {
      const cfg = HubConfig.get();
      document.getElementById('cfg-env').value          = cfg.env;
      document.getElementById('cfg-client-id').value    = cfg.clientId;
      document.getElementById('cfg-client-secret').value= cfg.clientSecret;
      document.getElementById('cfg-hmac-key').value     = cfg.hmacKey;
      document.getElementById('cfg-algo').value         = cfg.algo;
      modal.classList.add('open');
    });

    close.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    save.addEventListener('click', () => {
      HubConfig.save({
        env:          document.getElementById('cfg-env').value,
        clientId:     document.getElementById('cfg-client-id').value,
        clientSecret: document.getElementById('cfg-client-secret').value,
        hmacKey:      document.getElementById('cfg-hmac-key').value,
        algo:         document.getElementById('cfg-algo').value
      });
      updateEnvBadge();
      modal.classList.remove('open');
      if (currentView) navigateTo(currentView);
    });
  }

  function updateEnvBadge() {
    const badge = document.getElementById('env-badge');
    const cfg = HubConfig.get();
    badge.textContent = cfg.env === 'pro' ? 'PRO' : 'INT';
    badge.style.background = cfg.env === 'pro' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)';
    badge.style.color = cfg.env === 'pro' ? '#f87171' : '#f97316';
    badge.style.borderColor = cfg.env === 'pro' ? 'rgba(239,68,68,0.3)' : 'rgba(249,115,22,0.3)';
  }

  function setupSearch() {
    const input = document.getElementById('search-input');
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      document.querySelectorAll('.sidebar-links li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }

  function setupSidebarCollapse() {
    document.querySelectorAll('.sidebar-group-title').forEach(title => {
      title.addEventListener('click', () => {
        const group = title.getAttribute('data-group');
        const ul = document.getElementById('group-' + group);
        if (ul) ul.classList.toggle('collapsed');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // ===== Global helpers used by inline onclick =====

  window.switchTab = function (btn, panelId) {
    const container = btn.closest('.tabs').parentElement;
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  };

  window.switchLang = function (btn, panelId) {
    const container = btn.closest('.lang-tabs').parentElement;
    container.querySelectorAll('.lang-tab').forEach(b => b.classList.remove('active'));
    container.querySelectorAll('.lang-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
  };

  window.copyCode = function (btn) {
    const block = btn.parentElement;
    const text = block.textContent.replace('Copiar', '').trim();
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = 'Copiar'; }, 1800);
    });
  };

  window.formatJson = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    try { el.value = JSON.stringify(JSON.parse(el.value), null, 2); }
    catch (e) { alert('JSON no válido: ' + e.message); }
  };

  window.clearField = function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  };

  window.loadExample = function (textareaId, json) {
    const el = document.getElementById(textareaId);
    if (el) el.value = json;
  };

  window.sendRequest = async function (viewKey, textareaId, overrides) {
    const textarea = document.getElementById(textareaId);
    const resEl    = document.getElementById('res-' + viewKey);
    const statusEl = document.getElementById('status-' + viewKey);
    const dotEl    = document.getElementById('dot-' + viewKey);
    const timeEl   = document.getElementById('time-' + viewKey);
    const urlEl    = document.getElementById('url-' + viewKey);

    if (!textarea || !resEl) return;

    let body;
    try { body = JSON.parse(textarea.value); }
    catch (e) { resEl.textContent = '// JSON inválido: ' + e.message; return; }

    const url = urlEl ? urlEl.value : HubConfig.getFullUrl(viewKey);
    const cfg = HubConfig.get();

    // Show loading
    resEl.textContent = '// Enviando...';
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'status-code'; }
    if (dotEl)    { dotEl.className = 'status-dot pending'; }
    if (timeEl)   { timeEl.textContent = ''; }

    // Sign
    const key  = (overrides && overrides.hmacKey) || cfg.hmacKey;
    const algo = cfg.algo || 'SHA256';
    let signedBody = body;
    if (key) {
      try { signedBody = await HubSignature.sign(body, key, viewKey, algo); }
      catch (e) { console.warn('Firma no aplicada:', e.message); }
    }

    // Headers (allow per-console override)
    const headers = HubConfig.getHeaders(overrides || {});

    const result = await HubApi.send(url, signedBody, headers);

    // Display
    resEl.textContent = typeof result.data === 'object'
      ? JSON.stringify(result.data, null, 2)
      : (result.data || '(sin contenido)');

    if (statusEl) {
      statusEl.textContent = result.status + ' ' + result.statusText;
      statusEl.className = 'status-code ' + (result.ok ? 'ok' : 'err');
    }
    if (dotEl) { dotEl.className = 'status-dot ' + (result.ok ? 'ok' : 'err'); }
    if (timeEl) { timeEl.textContent = result.time + 'ms'; }

    // Verify signature
    if (key && result.data && typeof result.data === 'object') {
      const valid = await HubSignature.verifyResponse(result.data, key, algo);
      if (valid !== null) {
        resEl.textContent += '\n\n// Firma respuesta: ' + (valid ? '✓ VÁLIDA' : '✗ NO VERIFICADA');
      }
    }
  };

  window.navigateTo = function (key) { navigateTo(key); };

})();
