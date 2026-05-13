/**
 * HUB Acquirer - Configuration & State
 */
const HubConfig = (() => {
  const KEY = 'hub_adq_cfg';

  const DEFAULTS = {
    env: 'int',
    clientId: '',
    clientSecret: '',
    hmacKey: '',
    algo: 'SHA256'
  };

  const URLS = {
    int: {
      comercios:  'https://apis-i.redsys.es:20443/acquirement/banking-channel/v1/commerce',
      perfiles:   'https://apis-i.redsys.es:20443/acquirement/banking-channel/v1/profile',
      terminales: 'https://apis-i.redsys.es:20443/acquirement/banking-channel/no-presencial/v1/merchant'
    },
    pro: {
      comercios:  'https://apis.redsys.es/acquirement/banking-channel/v1/commerce',
      perfiles:   'https://apis.redsys.es/acquirement/banking-channel/v1/profile',
      terminales: 'https://apis.redsys.es/acquirement/banking-channel/no-presencial/v1/merchant'
    }
  };

  const ENDPOINTS = {
    // Comercios
    'com-alta':     { cat: 'comercios', path: '/add-commerce',   method: 'POST', label: 'Alta de Comercio' },
    'com-mod':      { cat: 'comercios', path: '/modify-commerce', method: 'POST', label: 'Modificación de Comercio' },
    'com-consulta': { cat: 'comercios', path: '/get-commerce',    method: 'POST', label: 'Consulta de Comercio' },
    'com-listado':  { cat: 'comercios', path: '/get-commerces',   method: 'POST', label: 'Consulta Listado' },
    // Perfiles
    'per-alta':     { cat: 'perfiles', path: '/add-commerce-profile',    method: 'POST', label: 'Alta de Perfil' },
    'per-mod':      { cat: 'perfiles', path: '/modify-commerce-profile', method: 'POST', label: 'Modificación de Perfil' },
    'per-baja':     { cat: 'perfiles', path: '/delete-commerce-profile', method: 'POST', label: 'Baja de Perfil' },
    'per-consulta': { cat: 'perfiles', path: '/get-commerce-profile',    method: 'POST', label: 'Consulta de Perfil' },
    // Terminales
    'ter-consulta':     { cat: 'terminales', path: '/detail',          method: 'POST', label: 'Consulta Terminal' },
    'ter-clave':        { cat: 'terminales', path: '/key',             method: 'POST', label: 'Consulta Clave' },
    'ter-lista':        { cat: 'terminales', path: '/list',            method: 'POST', label: 'Consulta Múltiple' },
    'ter-alta':         { cat: 'terminales', path: '/add',             method: 'POST', label: 'Alta Terminal' },
    'ter-mod':          { cat: 'terminales', path: '/modify',          method: 'POST', label: 'Modificación Terminal' },
    'ter-baja':         { cat: 'terminales', path: '/delete',          method: 'POST', label: 'Baja Terminal' },
    'ter-reactiva':     { cat: 'terminales', path: '/reactivate',      method: 'POST', label: 'Reactivación Terminal' },
    'ter-metodo-alta':  { cat: 'terminales', path: '/paymethod/add',   method: 'POST', label: 'Alta Método Pago' },
    'ter-metodo-mod':   { cat: 'terminales', path: '/paymethod/modify',method: 'POST', label: 'Mod. Método Pago' },
    'ter-metodo-baja':  { cat: 'terminales', path: '/paymethod/delete',method: 'POST', label: 'Baja Método Pago' }
  };

  let cfg = load();

  function load() {
    try {
      const s = localStorage.getItem(KEY);
      return s ? { ...DEFAULTS, ...JSON.parse(s) } : { ...DEFAULTS };
    } catch { return { ...DEFAULTS }; }
  }

  function save(updates) {
    cfg = { ...cfg, ...updates };
    localStorage.setItem(KEY, JSON.stringify(cfg));
  }

  function get() { return { ...cfg }; }

  function getBaseUrl(cat) {
    return URLS[cfg.env]?.[cat] || '';
  }

  function getFullUrl(viewKey) {
    const ep = ENDPOINTS[viewKey];
    if (!ep) return '';
    return getBaseUrl(ep.cat) + ep.path;
  }

  function getEndpoint(viewKey) { return ENDPOINTS[viewKey] || null; }

  function getHeaders(overrides = {}) {
    return {
      'Content-Type': 'application/json',
      'RedsysClientId':     overrides.clientId     || cfg.clientId     || '',
      'RedsysClientSecret': overrides.clientSecret || cfg.clientSecret || ''
    };
  }

  return { get, save, getBaseUrl, getFullUrl, getEndpoint, getHeaders, ENDPOINTS, URLS };
})();
