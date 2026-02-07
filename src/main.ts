import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.enableCors({
        origin: [
            'https://apigateway-v5pv.onrender.com',
            'https://servicio-integracion-mercadopago.onrender.com',
            'https://microservicio-de-peliculas.onrender.com',
            'https://serviciopromociones-wftn.onrender.com',
            'https://servicio-usuarios-ejqg.onrender.com',
            'https://servicio-funciones-y-salas.onrender.com',
            'https://servicio-envio-emails.onrender.com'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    await app.listen(3002);
}
bootstrap();
