import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CAMBIA LO QUE TENGAS POR ESTO:
    await app.enableCors(); 

    // O si prefieres mantener la estructura actual pero permitir todo:
    // await app.enableCors({ origin: '*', credentials: true });

    await app.listen(3002); // Asegúrate de que aquí diga 3002
}
bootstrap();
