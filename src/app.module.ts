import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT_TOKEN } from './constants/kafka-client-token.constant';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT_TOKEN,
        async useFactory() {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092', 'kafka:29092'],
              },
              producer: {
                allowAutoTopicCreation: true,
              },
              producerOnlyMode: process.env.NODE_ENV !== 'test' ? true : false,
            },
          };
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
