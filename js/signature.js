/**
 * HUB Acquirer - Unified Signature Module
 *
 * Terminales API (T29V2):
 *   Sign: HMAC(info.data serialized as JSON) → Base64URL
 *   Verify: same over response info.data
 *
 * Comercios / Perfiles APIs:
 *   Sign: HMAC(data block serialized as JSON) → Base64
 */
const HubSignature = (() => {

  function encode(buf) {
    const bytes = new Uint8Array(buf);
    let b = '';
    bytes.forEach(byte => b += String.fromCharCode(byte));
    return btoa(b);
  }

  function encodeUrl(buf) {
    return encode(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async function importKey(keyStr, algo) {
    const raw = new TextEncoder().encode(keyStr);
    return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: algo }, false, ['sign', 'verify']);
  }

  async function hmac(data, keyStr, algo = 'SHA-256', urlSafe = false) {
    const key = await importKey(keyStr, algo);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
    return urlSafe ? encodeUrl(sig) : encode(sig);
  }

  /**
   * Sign a Terminales request (T29V2 format)
   * Signature is computed over JSON.stringify(info.data)
   */
  async function signTerminales(body, keyStr, algo = 'SHA256') {
    const dataToSign = JSON.stringify(body.info?.data || {});
    const signature = await hmac(dataToSign, keyStr, 'SHA-' + algo, true);
    return {
      ...body,
      signatureData: { signatureType: 'T29V2', signature }
    };
  }

  /**
   * Sign a Comercios/Perfiles request
   * Signature is computed over JSON.stringify(the whole data block)
   */
  async function signComerciosPerfiles(body, keyStr, algo = 'SHA256') {
    const dataToSign = JSON.stringify(body);
    const signature = await hmac(dataToSign, keyStr, 'SHA-' + algo, false);
    return {
      data: body,
      signature: { signatureType: 'HMAC-' + algo, signature }
    };
  }

  /**
   * Auto-detect API type and sign accordingly
   */
  async function sign(body, keyStr, viewKey, algo = 'SHA256') {
    if (!keyStr) return body;
    const ep = HubConfig.getEndpoint(viewKey);
    if (!ep) return body;
    if (ep.cat === 'terminales') return signTerminales(body, keyStr, algo);
    return signComerciosPerfiles(body, keyStr, algo);
  }

  /**
   * Verify response signature
   */
  async function verifyResponse(responseBody, keyStr, algo = 'SHA256') {
    try {
      const received = responseBody.signatureData?.signature || responseBody.signature?.signature;
      if (!received) return null;
      const dataBlock = responseBody.info?.data || responseBody.data;
      const dataToVerify = JSON.stringify(dataBlock);
      const computed = await hmac(dataToVerify, keyStr, 'SHA-' + algo, true);
      const computedStd = await hmac(dataToVerify, keyStr, 'SHA-' + algo, false);
      return computed === received || computedStd === received;
    } catch { return null; }
  }

  /**
   * Compute signature for display (testing tool)
   */
  async function compute(data, keyStr, algo = 'SHA256', urlSafe = true) {
    if (!keyStr || !data) return '(configure clave y datos)';
    try { return await hmac(data, keyStr, 'SHA-' + algo, urlSafe); }
    catch (e) { return '(error: ' + e.message + ')'; }
  }

  return { sign, verifyResponse, compute, hmac };
})();
