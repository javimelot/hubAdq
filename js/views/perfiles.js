/**
 * Perfiles views
 */
const PerfilesViews = {

  _common: {
    respCodes: [
      ['2000','Operación realizada correctamente'],
      ['4001','Error validación campos de entrada'],
      ['4002','FUC no encontrado'],
      ['4003','Entidad no autorizada'],
      ['4004','Perfil ya existente'],
      ['4005','Datos obligatorios no informados'],
      ['4006','Valor de indicador no válido'],
      ['4007','Entidad no certificada para DCC'],
      ['4008','Entidad no certificada para Discover'],
      ['4009','Perfil no encontrado'],
      ['4010','Operación no permitida para esquema 4B'],
      ['5000','Error interno del sistema']
    ],
    baseParams: [
      ['fuc','Integer N9','SI','Código que identifica al comercio.'],
      ['tipoPeticion','Integer N2','SI','Tipo de la entidad peticionaria/procesadora.'],
      ['csbPeticion','Integer N4','SI','CSB de la entidad peticionaria/procesadora.'],
      ['tipo','Integer N2','SI','Tipo de la entidad adquirente asociada al perfil.'],
      ['csb','Integer N4','SI','CSB de la entidad adquirente asociada al perfil.']
    ]
  },

  alta() {
    return H.servicePage({
      id: 'per-alta',
      title: 'Alta de Perfil de Comercio',
      desc: 'Servicio para el alta del perfil del comercio. Solo disponible para entidades que no pertenecen al esquema 4B.',
      notes: [
        'Solo disponible para entidades que NO pertenecen al esquema 4B.',
        'Los indicadores no informados tomarán sus valores por defecto.',
        'indTicketBaiVerifactu: 0=NO, 1=TICKETBAI, 2=VERIFACTU, 3=FACTURACIÓN SIN VERIFACTU.'
      ],
      params: [
        ...this._common.baseParams,
        ['datosPerfil','Objeto','SI','Datos del perfil (ver campos detallados abajo).'],
        ['datosPerfil.indKeyEntryOnUs','String AN1','NO','Indicador ON-US. 0=No, 1=Sí. Defecto: 0.'],
        ['datosPerfil.indCtrlDevoluciones','String AN1','NO','Control devoluciones. 0=No controla, 1=Sí controla. Defecto: 1.'],
        ['datosPerfil.totalAutorizaciones','String AN1','NO','Totales en cierre automático. 0=No, 1=Sí. Defecto: 1.'],
        ['datosPerfil.indClienteVip','String AN1','NO','Cliente VIP. N=No, S=Sí. Defecto: N.'],
        ['datosPerfil.indMultiadquirencia','String AN1','NO','Multiadquirencia. 0=No, 1=Sí. Defecto: 1.'],
        ['datosPerfil.indPreautorizaciones','String AN1','NO','Preautorizaciones. 0=No, 1=Sí. Defecto: 0.'],
        ['datosPerfil.indPropina','String AN1','NO','Propinas. 0=No, 1=Sí. Defecto: 0.'],
        ['datosPerfil.indRecarga','String AN1','NO','Recarga telefónica. 0=No, 1=Sí. Defecto: 0.'],
        ['datosPerfil.indPagoNoPresente','String AN1','NO','Pagos no presenciales. 0=No, 1=Sí, 2=Avanzada Redsys, 3=Avanzada Redsys+Marcas, 4=Avanzada Marcas. Defecto: 0.'],
        ['datosPerfil.indNoSeguro','String AN1','NO','Comercio electrónico no seguro. 0=No, 1=Sí. Defecto: 0.'],
        ['datosPerfil.idioma','String AN1','NO','Idioma recibos: 1=Castellano, 2=Catalán, 3=Portugués, 4=Francés, 5=Inglés, 6=Euskera, 7=Italiano, 8=Alemán, 9=Gallego, A=Valenciano. Defecto: 1.'],
        ['datosPerfil.monedaLiquidacion','Integer N3','NO','Moneda ISO de liquidación. Defecto: 978 (EUR).'],
        ['datosPerfil.indTicketBaiVerifactu','String AN1','NO','TicketBAI/Verifactu. 0=No, 1=TICKETBAI, 2=VERIFACTU, 3=FACTURACIÓN SIN VERIFACTU.'],
        ['datosPerfil.datosDCC','Objeto','NO','Configuración DCC (Dynamic Currency Conversion).'],
        ['datosPerfil.pagosInmediatos','Objeto','NO','Configuración de pagos inmediatos/Bizum.'],
        ['datosPerfil.cashBack','Objeto','NO','Configuración operativa CashBack.'],
        ['datosPerfil.datosTaxFree','Objeto','NO','Configuración TaxFree.'],
        ['datosPerfil.paymentFacilitator','Objeto','NO','Configuración Payment Facilitator.'],
        ['datosPerfil.tarjetasEMV','Objeto','NO','Configuración aceptación tarjetas EMV internacionales.']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({
        fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49,
        datosPerfil: {
          indKeyEntryOnUs: "0", indCtrlDevoluciones: "1", totalAutorizaciones: "1",
          indClienteVip: "N", indMultiadquirencia: "1", indPreautorizaciones: "0",
          indPropina: "0", indRecarga: "0", indPagoNoPresente: "0", indNoSeguro: "0",
          idioma: "1", monedaLiquidacion: 978, indTicketBaiVerifactu: "0",
          pagosInmediatos: { indBizum: "0" }
        }
      }, null, 2),
      exampleResp: JSON.stringify({ code: "00", description: "Operación realizada correctamente", data: { fuc: 999999999, tipo: 1, csb: 49 } }, null, 2)
    });
  },

  modificacion() {
    return H.servicePage({
      id: 'per-mod',
      title: 'Modificación de Perfil de Comercio',
      desc: 'Servicio para la modificación del perfil de un comercio existente. Solo se envían los campos que se desean modificar.',
      notes: ['Solo se deben enviar los campos del perfil que se desean modificar.'],
      params: [
        ...this._common.baseParams,
        ['datosPerfil','Objeto','SI','Campos del perfil a modificar (solo los que cambian).']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({
        fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49,
        datosPerfil: { indPreautorizaciones: "1", indPropina: "1", idioma: "5" }
      }, null, 2),
      exampleResp: JSON.stringify({ code: "00", description: "Operación realizada correctamente" }, null, 2)
    });
  },

  baja() {
    return H.servicePage({
      id: 'per-baja',
      title: 'Baja de Perfil de Comercio',
      desc: 'Servicio para dar de baja el perfil de un comercio.',
      notes: ['La baja del perfil no elimina el comercio, solo su configuración de perfil para la entidad indicada.'],
      params: this._common.baseParams,
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({ fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49 }, null, 2),
      exampleResp: JSON.stringify({ code: "00", description: "Operación realizada correctamente" }, null, 2)
    });
  },

  consulta() {
    return H.servicePage({
      id: 'per-consulta',
      title: 'Consulta de Perfil de Comercio',
      desc: 'Servicio para consultar el perfil completo de un comercio, incluyendo todos sus indicadores y configuraciones.',
      notes: ['Devuelve todos los datos del perfil incluyendo indicadores, DCC, TaxFree, pagos inmediatos, etc.'],
      params: this._common.baseParams,
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({ fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49 }, null, 2),
      exampleResp: JSON.stringify({
        code: "00", description: "Operación realizada correctamente",
        data: {
          fuc: 999999999, tipo: 1, csb: 49,
          datosPerfil: {
            indKeyEntryOnUs: "0", indCtrlDevoluciones: "1", totalAutorizaciones: "1",
            indClienteVip: "N", indMultiadquirencia: "1", indPreautorizaciones: "1",
            indPropina: "1", idioma: "5", monedaLiquidacion: 978,
            usuarioAlta: "APIUSER1", fechaAlta: "2024-01-15"
          }
        }
      }, null, 2)
    });
  }
};
