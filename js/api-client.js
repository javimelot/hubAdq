/* ============================================================
   api-client.js — HTTP client for all API calls
   ============================================================ */

var HubApiClient = (function () {

  /* ── Generic POST request ─────────────────────────────────── */
  async function post(url, body, clientId, clientSecret) {
    var startTime = Date.now();
    var authHeader = 'Basic ' + btoa(clientId + ':' + clientSecret);

    var response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Authorization': authHeader
        },
        body: typeof body === 'string' ? body : JSON.stringify(body)
      });
    } catch (err) {
      var elapsed = Date.now() - startTime;
      // Distinguish CORS / network errors
      var isCors = (
        err instanceof TypeError &&
        (err.message.indexOf('Failed to fetch') !== -1 ||
         err.message.indexOf('NetworkError') !== -1 ||
         err.message.indexOf('CORS') !== -1 ||
         err.message.indexOf('fetch') !== -1)
      );
      return {
        ok:       false,
        status:   0,
        elapsed:  elapsed,
        isCors:   isCors,
        error:    err.message,
        body:     null
      };
    }

    var elapsed = Date.now() - startTime;
    var text = '';
    try { text = await response.text(); } catch (e) {}

    var parsed = null;
    try { parsed = JSON.parse(text); } catch (e) {}

    return {
      ok:      response.ok,
      status:  response.status,
      elapsed: elapsed,
      isCors:  false,
      error:   response.ok ? null : (text || response.statusText),
      body:    parsed !== null ? parsed : text,
      raw:     text
    };
  }

  /* ── Comercios / Perfiles call ────────────────────────────── */
  async function callComerciosApi(url, bodyObj, clientId, clientSecret) {
    return post(url, bodyObj, clientId, clientSecret);
  }

  /* ── Terminales call (with signing) ──────────────────────── */
  async function callTerminalesApi(url, infoData, clientId, clientSecret) {
    var signed = await HubSignature.signTerminalesRequest(infoData, clientSecret, false);
    return post(url, signed, clientId, clientSecret);
  }

  /* ── Raw call (body already prepared) ────────────────────── */
  async function callRaw(url, rawBody, clientId, clientSecret) {
    return post(url, rawBody, clientId, clientSecret);
  }

  /* ── Format result for display ───────────────────────────── */
  function formatResult(result) {
    if (result.isCors) {
      return {
        statusClass: 'error',
        statusText:  'CORS / Network Error',
        bodyText:    formatCorsError(result.error),
        elapsed:     result.elapsed
      };
    }
    if (result.status === 0 && result.error) {
      return {
        statusClass: 'error',
        statusText:  'Error de Red',
        bodyText:    '// Error de red:\n// ' + result.error,
        elapsed:     result.elapsed
      };
    }
    var bodyText;
    if (result.body !== null && typeof result.body === 'object') {
      bodyText = JSON.stringify(result.body, null, 2);
    } else {
      bodyText = result.raw || '';
    }
    return {
      statusClass: result.ok ? 'success' : 'error',
      statusText:  result.status ? (result.status + ' ' + getStatusText(result.status)) : 'Error',
      bodyText:    bodyText,
      elapsed:     result.elapsed
    };
  }

  function formatCorsError(errMsg) {
    return '// ⚠ Error de CORS / Red\n' +
           '//\n' +
           '// No se pudo conectar con la API.\n' +
           '// Esto es normal cuando se ejecuta desde file:// o un\n' +
           '// dominio diferente al de la API.\n' +
           '//\n' +
           '// Causas comunes:\n' +
           '//   1. Abriendo el archivo directamente (file://)\n' +
           '//      → Usa un servidor local: python -m http.server 8080\n' +
           '//   2. La API no permite CORS desde este origen\n' +
           '//      → Usa un proxy o llama desde backend\n' +
           '//   3. Certificado SSL no confiable (puerto 20443)\n' +
           '//      → Acepta el certificado en el navegador primero\n' +
           '//\n' +
           '// Error original: ' + (errMsg || 'TypeError: Failed to fetch');
  }

  function getStatusText(code) {
    var map = {
      200: 'OK', 201: 'Created', 204: 'No Content',
      400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
      404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable Entity',
      500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable'
    };
    return map[code] || '';
  }

  return {
    post:               post,
    callComerciosApi:   callComerciosApi,
    callTerminalesApi:  callTerminalesApi,
    callRaw:            callRaw,
    formatResult:       formatResult
  };

})();
