/**
 * Terminales views
 */
const TerminalesViews = {

  _rc: [
    ['2000','Operación realizada correctamente'],
    ['4001','Error validación campos de entrada'],
    ['5000','Error interno del sistema']
  ],

  _baseParams: [
    ['info.data.fuc','9/N','SI','Código FUC asignado al comercio.'],
    ['info.data.idTransaction','12/AN','SI','Número/identificador de la petición.'],
    ['info.data.terminal','3/N','SI','Número de terminal del comercio.'],
    ['signatureData.signatureType','String','SI','Tipo de firma: T29V2.'],
    ['signatureData.signature','String','SI','Valor de firma HMAC de la petición.']
  ],

  _req(data) {
    return JSON.stringify({
      info: { data },
      signatureData: { signatureType: "T29V2", signature: "<HMAC calculado sobre info.data>" }
    }, null, 2);
  },

  _resp(data) {
    return JSON.stringify({
      signatureData: { signatureType: "T29V2", signature: "<firma respuesta>" },
      info: { data, idTransaction: "000000000001", result: { code: 2000, description: "Operacion realizada Correctamente" } }
    }, null, 2);
  },

  consulta() {
    return H.servicePage({
      id: 'ter-consulta', title: 'Consulta de Terminal',
      desc: 'Consulta todos los datos asociados a un terminal existente de canal no presencial por comercio y terminal.',
      notes: ['La firma se calcula sobre JSON.stringify(info.data) con HMAC-SHA256 o SHA512, codificado en Base64URL.'],
      params: this._baseParams,
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "251533972", idTransaction: "462706983089", terminal: "1" }),
      exampleResp: this._resp({ fuc: 251533972, terminal: 1, typeCsb: 0, csb: 198, nameCommerce: "QUEST PHARMA LABORATORIOS", keyType: 31, currency: 978, connectionType: "D", typeNotification: "4" })
    });
  },

  clave() {
    return H.servicePage({
      id: 'ter-clave', title: 'Consulta de Clave de Terminal',
      desc: 'Consulta la clave de un terminal existente de canal no presencial.',
      params: this._baseParams,
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "251533972", idTransaction: "462706983090", terminal: "1" }),
      exampleResp: this._resp({ fuc: 251533972, terminal: 1, key: "qwertyasdf0123456789", keyType: 31 })
    });
  },

  lista() {
    return H.servicePage({
      id: 'ter-lista', title: 'Consulta de Terminales (Múltiple)',
      desc: 'Consulta datos asociados a varios terminales de canal no presencial por filtros.',
      params: [
        ['info.data.fuc','9/N','SI','Código FUC asignado al comercio.'],
        ['info.data.idTransaction','12/AN','SI','Número/identificador de la petición.'],
        ['info.data.csb','4/N','NO','CSB para filtrar terminales.'],
        ['signatureData.signatureType','String','SI','Tipo de firma: T29V2.'],
        ['signatureData.signature','String','SI','Valor de firma HMAC.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "251533972", idTransaction: "462706983091", csb: "198" }),
      exampleResp: this._resp({ terminals: [{ fuc: 251533972, terminal: 1, nameCommerce: "COMERCIO 1", terminalModel: "S1" }, { fuc: 251533972, terminal: 2, nameCommerce: "COMERCIO 1 - PAYGOLD", terminalModel: "S3" }] })
    });
  },

  alta() {
    return H.servicePage({
      id: 'ter-alta', title: 'Alta de Terminal',
      desc: 'Da de alta un terminal de canal no presencial con su configuración y métodos de pago.',
      notes: [
        'Modelos: S1=SIS Normal, S2=MOTO, S3=PayGold, S4=PUCE, A1=Android PayGold, A2=Android Bizum.',
        'connectionType: D=Directo, P=Pasarela, U=Conectado PUCE.',
        'keyType: 20=Clave Directa, 23=SHA256, 24=X9.19, 31=HMAC SHA256.',
        'Debe incluir al menos un método de pago en el array paymethods.'
      ],
      params: [
        ...this._baseParams,
        ['info.data.connectionType','1/AN','SI','Modo conexión: D=Directo, P=Pasarela, U=PUCE.'],
        ['info.data.currency','3/N','SI','Moneda configurada (978=EUR).'],
        ['info.data.typeNotification','1/N','SI','Tipo notificación: 0=Sin, 1-7=Varios modos.'],
        ['info.data.urlOK','250/AN','NO','URL de redirección OK.'],
        ['info.data.urlKO','250/AN','NO','URL de redirección KO.'],
        ['info.data.urlNotificationOnline','250/AN','NO','URL de notificación online.'],
        ['info.data.emailNotification','70/AN','NO','Email del comercio para notificaciones.'],
        ['info.data.keyType','2/N','SI','Tipo de clave: 20=Directa, 23=SHA256, 24=X9.19, 31=HMAC SHA256.'],
        ['info.data.terminalModel','String','SI','Modelo de terminal virtual.'],
        ['info.data.indicatorCVV2','1/N','NO','CVV2: 2=No solicita, 3=Opcional, 4=Obligatorio.'],
        ['info.data.paymethods','Lista','SI','Lista de métodos de pago a configurar.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({
        fuc: "999008881", idTransaction: "000000000001", terminal: "1",
        connectionType: "D", currency: 978, typeNotification: "4",
        urlOK: "https://www.comercio.es/ok", urlKO: "https://www.comercio.es/ko",
        urlNotificationOnline: "https://www.comercio.es/notif",
        emailNotification: "admin@comercio.es", keyType: 31, terminalModel: "S1", indicatorCVV2: 4,
        paymethods: [{ paymethod: "C", status: "A" }, { paymethod: "R", status: "A" }]
      }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1 })
    });
  },

  modificacion() {
    return H.servicePage({
      id: 'ter-mod', title: 'Modificación de Terminal',
      desc: 'Modifica un terminal existente de canal no presencial. Solo se envían los campos que se desean modificar.',
      notes: ['FUC y terminal son obligatorios para identificar el terminal. El resto de campos son opcionales.'],
      params: [
        ...this._baseParams,
        ['info.data.[campo]','Varios','NO','Cualquier campo del terminal que se desee modificar.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000002", terminal: "1", emailNotification: "nuevo@comercio.es", urlOK: "https://www.comercio.es/nuevo-ok" }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1 })
    });
  },

  baja() {
    return H.servicePage({
      id: 'ter-baja', title: 'Baja de Terminal',
      desc: 'Da de baja un terminal existente de canal no presencial.',
      notes: ['La baja es lógica; el terminal puede ser reactivado posteriormente.'],
      params: this._baseParams,
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000003", terminal: "1" }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1 })
    });
  },

  reactivacion() {
    return H.servicePage({
      id: 'ter-reactiva', title: 'Reactivación de Terminal',
      desc: 'Reactiva un terminal de canal no presencial existente previamente dado de baja.',
      params: this._baseParams,
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000004", terminal: "1" }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1 })
    });
  },

  metodoAlta() {
    return H.servicePage({
      id: 'ter-metodo-alta', title: 'Alta de Método de Pago',
      desc: 'Da de alta un método de pago a un comercio de canal no presencial.',
      notes: ['Métodos: C=Tarjeta, R=Referencia, T=Transferencia, D=Domiciliación, P=PayPal, Z=Bizum.'],
      params: [
        ...this._baseParams,
        ['info.data.paymethods','Lista','SI','Lista de métodos de pago. Cada uno con paymethod y status (A=Activo).'],
        ['info.data.paymethods[].paymethod','String','SI','Código del método de pago.'],
        ['info.data.paymethods[].status','String','SI','Estado: A=Activo.'],
        ['info.data.paymethods[].additionalData','String','NO','Datos adicionales del método de pago.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000005", terminal: "1", paymethods: [{ paymethod: "T", status: "A", additionalData: "" }] }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1, paymethods: [{ paymethod: "T", result: "OK" }] })
    });
  },

  metodoMod() {
    return H.servicePage({
      id: 'ter-metodo-mod', title: 'Modificación de Método de Pago',
      desc: 'Permite la modificación del campo additionalData de un método de pago.',
      params: [
        ...this._baseParams,
        ['info.data.paymethods','Lista','SI','Lista de métodos a modificar.'],
        ['info.data.paymethods[].paymethod','String','SI','Código del método de pago.'],
        ['info.data.paymethods[].additionalData','String','SI','Nuevos datos adicionales.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000006", terminal: "1", paymethods: [{ paymethod: "T", additionalData: "newdata" }] }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1, paymethods: [{ paymethod: "T", result: "OK" }] })
    });
  },

  metodoBaja() {
    return H.servicePage({
      id: 'ter-metodo-baja', title: 'Baja de Método de Pago',
      desc: 'Da de baja un método de pago de un comercio de canal no presencial.',
      params: [
        ...this._baseParams,
        ['info.data.paymethods','Lista','SI','Lista de métodos a dar de baja.'],
        ['info.data.paymethods[].paymethod','String','SI','Código del método de pago.']
      ],
      respCodes: this._rc,
      exampleReq: this._req({ fuc: "999008881", idTransaction: "000000000007", terminal: "1", paymethods: [{ paymethod: "T" }] }),
      exampleResp: this._resp({ fuc: 999008881, terminal: 1, paymethods: [{ paymethod: "T", result: "OK" }] })
    });
  }
};
