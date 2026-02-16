export const config = {
    APIPromocionesUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_PROMOCIONES}`,
        // En tu archivo de configuración de URLs
        verificarPromocionById: (clienteId: number) =>
            `/promocion/verificar-promocion?clienteId=${clienteId}`,
        getPromocionById: (id: number) => `/promocion/admin/${id}`,
    },
    APIFuncionesUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_FUNCIONES_Y_SALAS}`,
        obtenerPrecioEntradaByFuncionId: (id: number) =>
            `/formato/precio-entrada/${id}`,
        reservarButacasByIds: '/disponibilidad-butaca/reservar',
        getDatosFuncionById: (id: number) => `/formato/datos-funcion/${id}`,
        ocuparButacasByIds: '/formato/ocupar-butacas',
    },
    APIIntegracionMPUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_MERCADOPAGO}`,
        abrirCobro: '/cobros/abrir-cobro',
    },
    APIEnviarMailsUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_ENVIO_EMAILS}`,
        sendMail: '/mails/send',
    },
    APIUsuariosUrls: {
        baseUrl: `http://localhost:${process.env.PUERTO_MS_USUARIOS}`,
        getDatosClienteById: (id: number) =>
            `/usuario/admin/datos-cliente/${id}`,
    },
};
