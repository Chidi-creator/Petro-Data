import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/globalException.filter';
import { GlobalResponseInterceptor } from './common/interceptors/global.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));

  app.useGlobalInterceptors(new GlobalResponseInterceptor(reflector));
  const port = configService.get<number>('PORT') || 3000;
  console.log(`Application is running on: http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
