import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092', 'kafka:29092'],
        retry: {
          initialRetryTime: 5_000,
        },
      },
      producer: {
        allowAutoTopicCreation: true,
      },
      producerOnlyMode: process.env.NODE_ENV !== 'test' ? true : false,
    },
  });

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
