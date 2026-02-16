import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.enableCors({
        origin: [
            `http://localhost:${process.env.PUERTO_MS_PROMOCIONES}`,
            `http://localhost:${process.env.PUERTO_MS_VENTAS}`,
            `http://localhost:${process.env.PUERTO_MS_PELICULAS}`,
            `http://localhost:${process.env.PUERTO_APIGATEWAY}`,
            `http://localhost:${process.env.PUERTO_MS_FUNCIONES_Y_SALAS}`,
            `http://localhost:${process.env.PUERTO_MS_ENVIO_EMAILS}`,
            `http://localhost:${process.env.PUERTO_MS_MERCADOPAGO}`,
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    await app.listen(process.env.PUERTO_MS_VENTAS!);
}
bootstrap();
