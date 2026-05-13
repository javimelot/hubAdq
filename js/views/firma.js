/**
 * Firma / Auth documentation view
 */
const FirmaView = {
  render() {
    return '<div class="doc-page">' +
      '<div class="doc-header">' +
      '<h1>Módulo de Firma Digital</h1>' +
      '<p>Proceso unificado de firma HMAC para todas las APIs del HUB de Adquirencia. ' +
      'Se soportan HMAC-SHA256 y HMAC-SHA512.</p>' +
      '</div>' +

      '<div class="info-box warning" style="margin-bottom:20px;">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
      '<div>La firma garantiza la integridad y autenticidad de los mensajes. ' +
      'Configure su clave HMAC en el icono ⚙ del header para que la consola firme automáticamente.</div>' +
      '</div>' +

      '<div class="tabs">' +
      '<button class="tab-btn active" onclick="switchTab(this,\'tab-firma-ter\')">API Terminales (T29V2)</button>' +
      '<button class="tab-btn" onclick="switchTab(this,\'tab-firma-com\')">API Comercios / Perfiles</button>' +
      '<button class="tab-btn" onclick="switchTab(this,\'tab-firma-tool\')">Herramienta de Prueba</button>' +
      '</div>' +

      // Terminales tab
      '<div class="tab-panel active" id="tab-firma-ter">' +
      '<div class="section-title">Proceso de firma — Petición</div>' +
      '<ol style="padding-left:20px;color:var(--text2);line-height:2.2;margin-bottom:16px;">' +
      '<li>Serializar <code>info.data</code> como cadena JSON: <code>JSON.stringify(info.data)</code></li>' +
      '<li>Calcular HMAC-SHA256 (o SHA512) con la clave de la entidad</li>' +
      '<li>Codificar en Base64 URL-safe (reemplazar <code>+</code>→<code>-</code>, <code>/</code>→<code>_</code>, eliminar <code>=</code>)</li>' +
      '<li>Incluir en <code>signatureData.signature</code> con <code>signatureType: "T29V2"</code></li>' +
      '</ol>' +
      H.codeBlock('// Ejemplo de petición firmada\n{\n  "info": {\n    "data": { "fuc": "251533972", "idTransaction": "462706983089", "terminal": "1" }\n  },\n  "signatureData": {\n    "signatureType": "T29V2",\n    "signature": "uwO2N0J9jVRJ8yiyRWFeYnqD7DY6FRLt41v0b6LYUs_8JqLxX0xdLA-i7UwplNfRD2E195XYCQuH5RR4Kr2OiA=="\n  }\n}') +
      '<div class="section-title">Proceso de firma — Respuesta</div>' +
      '<ol style="padding-left:20px;color:var(--text2);line-height:2.2;margin-bottom:16px;">' +
      '<li>Extraer el bloque <code>info.data</code> de la respuesta</li>' +
      '<li>Serializar como cadena JSON</li>' +
      '<li>Calcular HMAC con la misma clave y algoritmo</li>' +
      '<li>Comparar con <code>signatureData.signature</code></li>' +
      '</ol>' +
      '</div>' +

      // Comercios/Perfiles tab
      '<div class="tab-panel" id="tab-firma-com">' +
      '<div class="section-title">Proceso de firma — Petición</div>' +
      '<ol style="padding-left:20px;color:var(--text2);line-height:2.2;margin-bottom:16px;">' +
      '<li>Serializar el bloque <code>data</code> completo como cadena JSON</li>' +
      '<li>Calcular HMAC-SHA256 con la clave de la entidad</li>' +
      '<li>Codificar en Base64 estándar</li>' +
      '<li>Incluir en <code>signature.signature</code> con <code>signatureType: "HMAC-SHA256"</code></li>' +
      '</ol>' +
      H.codeBlock('// Estructura de petición firmada\n{\n  "data": {\n    "fuc": 999999999,\n    "tipoPeticion": 1,\n    ...\n  },\n  "signature": {\n    "signatureType": "HMAC-SHA256",\n    "signature": "<base64-encoded-hmac>"\n  }\n}') +
      '</div>' +

      // Tool tab
      '<div class="tab-panel" id="tab-firma-tool">' +
      '<div class="section-title">Calculadora de firma</div>' +
      '<div class="form-group"><label>Datos a firmar (JSON)</label>' +
      '<textarea id="sign-data" rows="4" placeholder=\'{"fuc":"999999999","idTransaction":"000000000001","terminal":"1"}\'></textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
      '<div class="form-group"><label>Clave HMAC</label><input type="password" id="sign-key" placeholder="Clave de firma"></div>' +
      '<div class="form-group"><label>Algoritmo</label><select id="sign-algo"><option value="SHA256">HMAC-SHA256</option><option value="SHA512">HMAC-SHA512</option></select></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:14px;">' +
      '<button class="btn-primary" onclick="FirmaView.compute()">Calcular Firma</button>' +
      '<button class="btn-secondary" onclick="FirmaView.computeStd()">Base64 Estándar</button>' +
      '</div>' +
      '<div class="form-group"><label>Resultado (Base64 URL-safe)</label>' +
      '<input type="text" id="sign-result" readonly placeholder="Resultado aparecerá aquí..."></div>' +
      '<div class="form-group"><label>Resultado (Base64 Estándar)</label>' +
      '<input type="text" id="sign-result-std" readonly placeholder="Resultado aparecerá aquí..."></div>' +
      '</div>' +
      '</div>';
  },

  async compute() {
    const data = document.getElementById('sign-data').value;
    const key  = document.getElementById('sign-key').value;
    const algo = document.getElementById('sign-algo').value;
    if (!data || !key) { alert('Introduce datos y clave.'); return; }
    const r = await HubSignature.compute(data, key, algo, true);
    document.getElementById('sign-result').value = r;
  },

  async computeStd() {
    const data = document.getElementById('sign-data').value;
    const key  = document.getElementById('sign-key').value;
    const algo = document.getElementById('sign-algo').value;
    if (!data || !key) { alert('Introduce datos y clave.'); return; }
    const r = await HubSignature.compute(data, key, algo, false);
    document.getElementById('sign-result-std').value = r;
  }
};

// Expose for inline onclick
window.FirmaView = FirmaView;
