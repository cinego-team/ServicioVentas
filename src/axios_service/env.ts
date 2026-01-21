export const config = {
    APIPromocionesUrls: {
    baseUrl: 'http://localhost:3005',
    // En tu archivo de configuración de URLs
    verificarPromocionById: (clienteId: number) => `/promocion/verificar-promocion?clienteId=${clienteId}`,         
    getPromocionById: (id: number) => `/promocion/admin/${id}`, 
},
    APIFuncionesUrls: {
        baseUrl: 'http://localhost:3003',
        obtenerPrecioEntradaByFuncionId: (id: number) =>
            `/formato/precio-entrada/${id}`, 
        reservarButacasByIds: '/disponibilidad-butaca/reservar',        
        getDatosFuncionById: (id: number) => `/formato/datos-funcion/${id}`,
        ocuparButacasByIds: '/formato/ocupar-butacas',
    },
    APIIntegracionMPUrls: {
        baseUrl: 'http://localhost:3007',
        abrirCobro: '/cobros/abrir-cobro',
    },
    APIEnviarMailsUrls: {
        baseUrl: 'http://localhost:3008',        
        sendMail: '/mails/send',
    },
    APIUsuariosUrls: {
        baseUrl: 'http://localhost:3004',
        getDatosClienteById: (id: number) =>
            `/microservicio-usuarios/datos-cliente/${id}`,
    },
};
