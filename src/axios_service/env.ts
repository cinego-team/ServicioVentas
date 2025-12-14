export const config = {
    APIPromocionesUrls: {
        baseUrl: 'http://localhost:3000',
        verificarPromocionById: (id: number) =>
            `/promociones/verificar-promocion/${id}`,
        getPromocionById: (id: number) => `/promociones/${id}`,
    },
    APIFuncionesUrls: {
        baseUrl: 'http://localhost:3001',
        obtenerPrecioEntradaByFuncionId: (id: number) =>
            `/funciones/precio-entrada/${id}`,
        reservarButacasByIds: '/funciones/reservar-butacas',
        getDatosFuncionById: (id: number) => `/funciones/datos-funcion/${id}`,
        ocuparButacasByIds: '/funciones/ocupar-butacas',
    },
    APIIntegracionMPUrls: {
        baseUrl: 'http://localhost:3002',
        abrirCobro: '/cobros/abrir-cobro',
    },
    APIEnviarMailsUrls: {
        baseUrl: 'http://localhost:3003',
        sendMail: '/mails/send',
    },
    APIUsuariosUrls: {
        baseUrl: 'http://localhost:3004',
        getDatosClienteById: (id: number) =>
            `/microservicio-usuarios/datos-cliente/${id}`,
    },
};
