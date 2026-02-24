export const config = {
    APIPromocionesUrls: {
        baseUrl: 'http://localhost:3005',
        // En tu archivo de configuración de URLs
        verificarPromocionById: (clienteId: number) =>
            `/promocion/verificar-promocion/${clienteId}`,
        getPromocionById: (id: number) => `/promocion/admin/${id}`,
    },
    APIFuncionesUrls: {
        baseUrl: 'http://localhost:3002',
        reservarButacasByIds: '/disponibilidad-butaca/reservar',
        getDatosFuncionById: (id: number) => `/funcion/admin/${id}`,
        ocuparButacasByIds: '/disponibilidad-butaca/ocupar',
        getPrecioEntradaByFuncionId: (funcionId: number) =>
            `/funcion/precio-entrada/${funcionId}`,
    },
    APIIntegracionMPUrls: {
        baseUrl: 'https://susanne-tressured-fidel.ngrok-free.dev', //link solo valido para pc rama
        abrirCobro: '/cobros/abrir-cobro',
    },
    APIEnviarMailsUrls: {
        baseUrl: 'http://localhost:3006',
        sendMail: '/mails/send',
    },
    APIUsuariosUrls: {
        baseUrl: 'http://localhost:3004',
        getDatosClienteById: (id: number) =>
            `/usuario/admin/datos-cliente/${id}`,
    },
};
