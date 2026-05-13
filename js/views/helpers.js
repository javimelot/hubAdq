/**
 * Shared view helpers — must load before any view file
 */
const H = {

  paramsTable(rows) {
    let html = '<table class="params-table"><thead><tr><th>Campo</th><th>Tipo</th><th>Oblig.</th><th>Descripci&oacute;n</th></tr></thead><tbody>';
    rows.forEach(function(r) {
      const req   = r[2] === 'SI' ? 'si' : r[2] === 'COND' ? 'cond' : 'no';
      const label = r[2] === 'SI' ? 'S&iacute;' : r[2] === 'COND' ? 'Cond.' : 'No';
      html += '<tr><td class="param-name">' + r[0] + '</td><td class="param-type">' + r[1] + '</td>' +
        '<td><span class="badge-req ' + req + '">' + label + '</span></td>' +
        '<td class="param-desc">' + r[3] + '</td></tr>';
    });
    return html + '</tbody></table>';
  },

  respCodes(codes) {
    let html = '<div class="resp-codes">';
    codes.forEach(function(c) {
      const cls = c[0].startsWith('2') ? 'ok' : 'err';
      html += '<div class="resp-code-row"><span class="resp-code ' + cls + '">' + c[0] + '</span><span>' + c[1] + '</span></div>';
    });
    return html + '</div>';
  },

  codeBlock(code) {
    return '<div class="code-block"><button class="copy-btn" onclick="copyCode(this)">Copiar</button>' + H.esc(code) + '</div>';
  },

  esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  langExamples(id, url, bodyJson, clientId, clientSecret) {
    const body1 = bodyJson.replace(/\s+/g, ' ').trim();

    const curl =
      'curl -X POST "' + url + '" \\\n' +
      '  -H "Content-Type: application/json" \\\n' +
      '  -H "RedsysClientId: ' + clientId + '" \\\n' +
      '  -H "RedsysClientSecret: ' + clientSecret + '" \\\n' +
      "  -d '" + body1 + "'";

    const php =
      '<?php\n$ch = curl_init("' + url + '");\ncurl_setopt_array($ch, [\n' +
      '  CURLOPT_RETURNTRANSFER => true,\n  CURLOPT_POST => true,\n' +
      "  CURLOPT_POSTFIELDS => '" + body1.replace(/'/g, "\\'") + "',\n" +
      "  CURLOPT_HTTPHEADER => [\n    'Content-Type: application/json',\n" +
      "    'RedsysClientId: " + clientId + "',\n    'RedsysClientSecret: " + clientSecret + "'\n  ]\n]);\n" +
      'echo curl_exec($ch);\ncurl_close($ch);';

    const python =
      'import requests\nurl = "' + url + '"\n' +
      'headers = {\n  "Content-Type": "application/json",\n' +
      '  "RedsysClientId": "' + clientId + '",\n  "RedsysClientSecret": "' + clientSecret + '"\n}\n' +
      'body = ' + bodyJson + '\nresp = requests.post(url, headers=headers, json=body)\nprint(resp.json())';

    const nodejs =
      'const https = require("https");\nconst body = JSON.stringify(' + body1 + ');\n' +
      'const opts = {\n  hostname: "' + (url.split('/')[2] || '') + '",\n' +
      '  path: "/" + url.split("/").slice(3).join("/") + ",\n' +
      '  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n' +
      '    "RedsysClientId": "' + clientId + '",\n    "RedsysClientSecret": "' + clientSecret + '",\n' +
      '    "Content-Length": Buffer.byteLength(body)\n  }\n};\n' +
      'const req = https.request(opts, r => {\n  let d = "";\n  r.on("data", c => d += c);\n  r.on("end", () => console.log(JSON.parse(d)));\n});\nreq.write(body); req.end();';

    const java =
      'import java.net.URI;\nimport java.net.http.*;\n\n' +
      'var client = HttpClient.newHttpClient();\n' +
      'var body = "' + body1.replace(/"/g, '\\"') + '";\n' +
      'var request = HttpRequest.newBuilder()\n' +
      '  .uri(URI.create("' + url + '"))\n' +
      '  .header("Content-Type", "application/json")\n' +
      '  .header("RedsysClientId", "' + clientId + '")\n' +
      '  .header("RedsysClientSecret", "' + clientSecret + '")\n' +
      '  .POST(HttpRequest.BodyPublishers.ofString(body)).build();\n' +
      'var resp = client.send(request, HttpResponse.BodyHandlers.ofString());\n' +
      'System.out.println(resp.body());';

    const langs = [
      { key: 'curl', label: 'cURL',    code: curl   },
      { key: 'php',  label: 'PHP',     code: php    },
      { key: 'py',   label: 'Python',  code: python },
      { key: 'node', label: 'Node.js', code: nodejs },
      { key: 'java', label: 'Java',    code: java   }
    ];

    let tabs = '<div class="lang-tabs">';
    let panels = '';
    langs.forEach(function(l, i) {
      const active = i === 0 ? ' active' : '';
      tabs += '<button class="lang-tab' + active + '" onclick="switchLang(this,\'lang-' + id + '-' + l.key + '\')">' + l.label + '</button>';
      panels += '<div class="lang-panel' + active + '" id="lang-' + id + '-' + l.key + '">' +
        '<div class="code-block"><button class="copy-btn" onclick="copyCode(this)">Copiar</button>' + H.esc(l.code) + '</div></div>';
    });
    tabs += '</div>';
    return '<div>' + tabs + panels + '</div>';
  },

  consoleCreds(id) {
    const cfg = HubConfig.get();
    return '<div class="console-creds">' +
      '<div class="form-group"><label>RedsysClientId</label>' +
      '<input type="text" id="cid-' + id + '" value="' + H.esc(cfg.clientId) + '" placeholder="ID de suscripci&oacute;n"></div>' +
      '<div class="form-group"><label>RedsysClientSecret</label>' +
      '<input type="password" id="csec-' + id + '" value="' + H.esc(cfg.clientSecret) + '" placeholder="Secret"></div>' +
      '</div>';
  },

  urlBar(id, url) {
    return '<div class="url-bar">' +
      '<span class="method-badge method-post">POST</span>' +
      '<input type="text" id="url-' + id + '" value="' + H.esc(url) + '">' +
      '<button class="btn-send" onclick="sendRequest(\'' + id + '\',\'req-' + id + '\',' +
      '{clientId:document.getElementById(\'cid-' + id + '\').value,' +
      'clientSecret:document.getElementById(\'csec-' + id + '\').value})">Enviar</button>' +
      '</div>';
  },

  responsePanel(id) {
    return '<div class="console-panel">' +
      '<div class="console-panel-header"><h4>Respuesta</h4></div>' +
      '<div class="console-response" id="res-' + id + '">// La respuesta aparecer&aacute; aqu&iacute;...</div>' +
      '<div class="status-bar">' +
      '<span class="status-dot" id="dot-' + id + '"></span>' +
      '<span class="status-code" id="status-' + id + '"></span>' +
      '<span class="status-time" id="time-' + id + '"></span>' +
      '</div></div>';
  },

  servicePage(opts) {
    const id         = opts.id;
    const title      = opts.title;
    const desc       = opts.desc;
    const params     = opts.params;
    const respCodes  = opts.respCodes;
    const exampleReq = opts.exampleReq;
    const exampleResp= opts.exampleResp;
    const notes      = opts.notes;

    const url = HubConfig.getFullUrl(id);
    const cfg = HubConfig.get();

    let notesHtml = '';
    if (notes && notes.length) {
      notesHtml =
        '<div class="info-box info" style="margin-bottom:16px;">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">' +
        '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<ul style="padding-left:16px;margin:0;">' +
        notes.map(function(n) { return '<li>' + n + '</li>'; }).join('') +
        '</ul></div>';
    }

    const tabsHtml =
      '<div class="tabs">' +
      '<button class="tab-btn active" onclick="switchTab(this,\'tab-doc-' + id + '\')">Documentaci&oacute;n</button>' +
      '<button class="tab-btn" onclick="switchTab(this,\'tab-code-' + id + '\')">Ejemplos de C&oacute;digo</button>' +
      '<button class="tab-btn" onclick="switchTab(this,\'tab-console-' + id + '\')">Consola de Pruebas</button>' +
      '</div>';

    const docPanel =
      '<div class="tab-panel active" id="tab-doc-' + id + '">' +
      '<div class="section-title">Par&aacute;metros de entrada</div>' +
      H.paramsTable(params) +
      '<div class="section-title">Ejemplo de petici&oacute;n</div>' +
      H.codeBlock(exampleReq) +
      '<div class="section-title">Ejemplo de respuesta</div>' +
      H.codeBlock(exampleResp) +
      '<div class="section-title">C&oacute;digos de respuesta</div>' +
      H.respCodes(respCodes) +
      '</div>';

    const codePanel =
      '<div class="tab-panel" id="tab-code-' + id + '">' +
      H.langExamples(
        id, url, exampleReq,
        cfg.clientId     || '{RedsysClientId}',
        cfg.clientSecret || '{RedsysClientSecret}'
      ) +
      '</div>';

    // Escape example for textarea value and loadExample button
    const exReqEscAttr = exampleReq.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n');

    const consolePanel =
      '<div class="tab-panel" id="tab-console-' + id + '">' +
      '<div class="console-section">' +
      H.consoleCreds(id) +
      H.urlBar(id, url) +
      '<div class="console-grid">' +
      '<div class="console-panel">' +
      '<div class="console-panel-header"><h4>Request Body</h4>' +
      '<div class="console-panel-actions">' +
      '<button class="btn-secondary" onclick="formatJson(\'req-' + id + '\')">Formatear</button>' +
      '<button class="btn-secondary" onclick="loadExample(\'req-' + id + '\',\'' + exReqEscAttr + '\')">Ejemplo</button>' +
      '</div></div>' +
      '<textarea class="console-textarea" id="req-' + id + '">' + H.esc(exampleReq) + '</textarea>' +
      '</div>' +
      H.responsePanel(id) +
      '</div></div></div>';

    return '<div class="doc-page">' +
      '<div class="doc-header"><h1>' + title + '</h1><p>' + desc + '</p></div>' +
      '<div class="doc-endpoint">' +
      '<span class="method-badge method-post">POST</span>' +
      '<span class="endpoint-url">' + H.esc(url) + '</span>' +
      '</div>' +
      notesHtml +
      tabsHtml + docPanel + codePanel + consolePanel +
      '</div>';
  }
};
