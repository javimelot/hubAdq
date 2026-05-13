/**
 * Welcome / Home view
 */
const WelcomeView = {
  render() {
    return '<div class="doc-page">' +
      '<div class="doc-header">' +
      '<h1>Acquirer API Hub</h1>' +
      '<p>Consola unificada para las APIs de configuración de adquirencia de Redsys.<br>' +
      'Gestione Comercios, Perfiles y Terminales desde un único punto de acceso estandarizado.</p>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:28px;">' +
      this._card('Comercios', 'Alta, modificación, consulta y listado de comercios.', 'com-alta', '#3b82f6',
        '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') +
      this._card('Perfiles', 'Gestión de perfiles: indicadores, DCC, Bizum, TaxFree.', 'per-alta', '#22c55e',
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>') +
      this._card('Terminales', 'Terminales no presenciales: alta, baja, métodos de pago.', 'ter-consulta', '#a855f7',
        '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>') +
      this._card('Firma HMAC', 'Proceso unificado de firma HMAC-SHA256/512.', 'firma-doc', '#f97316',
        '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>') +
      '</div>' +

      '<div class="info-box info" style="margin-bottom:16px;">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '<div><strong>Inicio rápido:</strong> Configure sus credenciales en el icono ⚙ del header, ' +
      'luego seleccione un servicio del menú lateral para ver su documentación y consola de pruebas.</div>' +
      '</div>' +

      '<div class="section-title">Entornos disponibles</div>' +
      '<table class="params-table">' +
      '<thead><tr><th>Entorno</th><th>Comercios / Perfiles</th><th>Terminales</th></tr></thead>' +
      '<tbody>' +
      '<tr><td><span class="badge-req cond">Integración</span></td>' +
      '<td class="param-type">apis-i.redsys.es:20443/acquirement/banking-channel/v1/</td>' +
      '<td class="param-type">apis-i.redsys.es:20443/acquirement/banking-channel/no-presencial/v1/merchant</td></tr>' +
      '<tr><td><span class="badge-req si">Producción</span></td>' +
      '<td class="param-type">apis.redsys.es/acquirement/banking-channel/v1/</td>' +
      '<td class="param-type">apis.redsys.es/acquirement/banking-channel/no-presencial/v1/merchant</td></tr>' +
      '</tbody></table>' +
      '</div>';
  },

  _card(title, desc, view, color, iconPath) {
    return '<div onclick="navigateTo(\'' + view + '\')" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;cursor:pointer;transition:border-color 0.15s;" ' +
      'onmouseover="this.style.borderColor=\'' + color + '\'" onmouseout="this.style.borderColor=\'var(--border)\'">' +
      '<div style="width:36px;height:36px;border-radius:8px;background:' + color + '22;display:flex;align-items:center;justify-content:center;margin-bottom:12px;">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2">' + iconPath + '</svg></div>' +
      '<div style="font-weight:600;margin-bottom:4px;">' + title + '</div>' +
      '<div style="font-size:12px;color:var(--text2);">' + desc + '</div>' +
      '</div>';
  }
};
