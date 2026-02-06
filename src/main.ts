import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.enableCors({
        origin: [
            'https://api-gateway-one-rose.vercel.app',
            'https://servicio-integracion-mercado-pago.vercel.app',
            'https://microservicio-de-peliculas.vercel.app',
            'https://servicio-promociones.vercel.app',
            'https://servicio-usuarios.vercel.app',
            'https://servicio-funciones-y-salas.vercel.app',
            'https://servicioenvioemails.vercel.app'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    await app.listen(3002);
}
bootstrap();
