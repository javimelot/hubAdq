/**
 * Comercios views
 */
const ComerciosViews = {

  _common: {
    respCodes: [
      ['2000','Operación realizada correctamente'],
      ['4001','Error validación campos de entrada'],
      ['4002','FUC no encontrado'],
      ['4003','Entidad no autorizada'],
      ['4004','Comercio ya existente'],
      ['4005','Datos obligatorios no informados'],
      ['4006','Sector de actividad no válido'],
      ['4007','Código postal no válido'],
      ['4008','Documento de identidad no válido'],
      ['4009','Cuenta bancaria no válida'],
      ['4010','URL no válida'],
      ['5000','Error interno del sistema']
    ]
  },

  alta() {
    return H.servicePage({
      id: 'com-alta',
      title: 'Alta de Comercio',
      desc: 'Servicio para el alta de comercio en Redsys. Realiza automáticamente el alta de datos por defecto (perfil, descuentos, tasas) según el modelo de negocio de la entidad.',
      endpoint: '/add-commerce',
      notes: [
        'Si no se informa el FUC y la entidad tiene asignación automática activada, se generará automáticamente.',
        'La URL es obligatoria para comercio electrónico y debe incluir esquema http/https.',
        'El teléfono en formato E164 se genera automáticamente si no se informa.'
      ],
      params: [
        ['fuc','Integer N9','COND','Código FUC del establecimiento. Condicional: si no se informa y hay asignación automática, se genera.'],
        ['tipoPeticion','Integer N2','SI','Tipo de la entidad peticionaria.'],
        ['csbPeticion','Integer N4','SI','CSB de la entidad peticionaria.'],
        ['tipo','Integer N2','SI','Tipo de la entidad adquirente del comercio.'],
        ['csb','Integer N4','SI','CSB de la entidad adquirente del comercio.'],
        ['datosComercio.nombre','String AN40','SI','Nombre asignado al establecimiento.'],
        ['datosComercio.nombreReducido','String AN15','NO','Nombre corto. Si no se especifica, se usan las primeras 15 posiciones del nombre.'],
        ['datosComercio.tipoDocumento','Integer','SI','Tipo de documento del propietario (1=NIF/CIF, 2=Pasaporte, 3=Doc.Extranjero...).'],
        ['datosComercio.numeroDocumento','String AN12','SI','Número del documento. Se valida el carácter verificador.'],
        ['datosComercio.pais','Integer N3','SI','Código ISO del país.'],
        ['datosComercio.sectorActividad','Integer N4','SI','Sector de actividad nacional (MCC).'],
        ['datosComercio.direccion','Objeto','SI','Datos de dirección (nacional o internacional).'],
        ['datosComercio.contactos','Listado','SI','Lista de contactos. Mínimo un elemento.'],
        ['datosComercio.url','String AN100','COND','URL web. Obligatoria para comercio electrónico.'],
        ['datosComercio.cuenta','Objeto','COND','Cuenta bancaria. Solo para entidades 4B.'],
        ['datosComercio.perfilDefecto','Objeto','COND','Perfil por defecto. Solo para entidades 4B.']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({
        fuc: 999999999,
        tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49,
        datosComercio: {
          nombre: "COMERCIO PRUEBA SL",
          nombreReducido: "COM PRUEBA",
          tipoDocumento: 1,
          numeroDocumento: "B12345678",
          pais: 724,
          sectorActividad: 5411,
          direccion: {
            nacional: { tipo: "CL", domicilio: "Gran Via", numeroDomicilio: 28, codigoPostal: 28013, localidad: "Madrid" }
          },
          contactos: [{ nivel: "01", telefono: 912345678, nombre: "Juan Garcia", email: "juan@comercio.es", telefonoE164: "+34912345678" }],
          url: "https://www.comercio-prueba.es"
        }
      }, null, 2),
      exampleResp: JSON.stringify({ code: "00", description: "Operación realizada correctamente", data: { fuc: 999999999 } }, null, 2)
    });
  },

  modificacion() {
    return H.servicePage({
      id: 'com-mod',
      title: 'Modificación de Comercio',
      desc: 'Servicio para la modificación de los datos de un comercio existente. Solo se envían los campos que se desean modificar.',
      notes: ['Solo se deben enviar los campos que se desean modificar.', 'El FUC es obligatorio para identificar el comercio.'],
      params: [
        ['fuc','Integer N9','SI','Código FUC del establecimiento a modificar.'],
        ['tipoPeticion','Integer N2','SI','Tipo de la entidad peticionaria.'],
        ['csbPeticion','Integer N4','SI','CSB de la entidad peticionaria.'],
        ['tipo','Integer N2','SI','Tipo de la entidad adquirente.'],
        ['csb','Integer N4','SI','CSB de la entidad adquirente.'],
        ['datosComercio','Objeto','SI','Campos a modificar (solo los que cambian).']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({
        fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49,
        datosComercio: { nombre: "COMERCIO MODIFICADO SL", contactos: [{ nivel: "01", telefono: 912345679, email: "nuevo@comercio.es" }] }
      }, null, 2),
      exampleResp: JSON.stringify({ code: "00", description: "Operación realizada correctamente" }, null, 2)
    });
  },

  consulta() {
    return H.servicePage({
      id: 'com-consulta',
      title: 'Consulta de Comercio Específico',
      desc: 'Recuperación de los datos de un comercio específico identificado por su FUC.',
      params: [
        ['fuc','Integer N9','SI','Código FUC del establecimiento a consultar.'],
        ['tipoPeticion','Integer N2','SI','Tipo de la entidad peticionaria.'],
        ['csbPeticion','Integer N4','SI','CSB de la entidad peticionaria.'],
        ['tipo','Integer N2','SI','Tipo de la entidad adquirente.'],
        ['csb','Integer N4','SI','CSB de la entidad adquirente.']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({ fuc: 999999999, tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49 }, null, 2),
      exampleResp: JSON.stringify({
        code: "00", description: "Operación realizada correctamente",
        data: { fuc: 999999999, datosComercio: { nombre: "COMERCIO PRUEBA SL", pais: 724, sectorActividad: 5411 } }
      }, null, 2)
    });
  },

  listado() {
    return H.servicePage({
      id: 'com-listado',
      title: 'Consulta Listado de Comercios',
      desc: 'Recuperación de datos de comercios por parámetros de búsqueda (filtros).',
      params: [
        ['tipoPeticion','Integer N2','SI','Tipo de la entidad peticionaria.'],
        ['csbPeticion','Integer N4','SI','CSB de la entidad peticionaria.'],
        ['tipo','Integer N2','SI','Tipo de la entidad adquirente.'],
        ['csb','Integer N4','SI','CSB de la entidad adquirente.'],
        ['filtro.nombre','String','NO','Filtro por nombre del comercio.'],
        ['filtro.sectorActividad','Integer','NO','Filtro por sector de actividad.'],
        ['filtro.pais','Integer','NO','Filtro por código de país ISO.']
      ],
      respCodes: this._common.respCodes,
      exampleReq: JSON.stringify({ tipoPeticion: 1, csbPeticion: 49, tipo: 1, csb: 49, filtro: { nombre: "COMERCIO" } }, null, 2),
      exampleResp: JSON.stringify({
        code: "00", description: "Operación realizada correctamente",
        data: { comercios: [{ fuc: 999999999, nombre: "COMERCIO PRUEBA SL" }, { fuc: 999999998, nombre: "COMERCIO EJEMPLO SA" }], totalRegistros: 2 }
      }, null, 2)
    });
  }
};
