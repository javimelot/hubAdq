/**
 * HUB Acquirer - API Client
 */
const HubApi = (() => {

  async function send(url, body, headers) {
    const t0 = performance.now();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
      });
      const elapsed = Math.round(performance.now() - t0);
      let data;
      try { data = await res.json(); }
      catch { data = await res.text(); }
      return { ok: res.ok, status: res.status, statusText: res.statusText, data, time: elapsed };
    } catch (err) {
      const elapsed = Math.round(performance.now() - t0);
      return {
        ok: false, status: 0, statusText: 'Network Error',
        data: { error: err.message, hint: 'Verifique la URL y conectividad. CORS puede bloquear peticiones desde file://.' },
        time: elapsed
      };
    }
  }

  return { send };
})();
