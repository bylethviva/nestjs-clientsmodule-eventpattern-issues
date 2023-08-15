import { Module } from '@nestjs/common';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';

import { MockConsumerController } from './mock-consumer.controller';
import { KAFKA_CLIENT_TOKEN } from '../../src/constants/kafka-client-token.constant';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT_TOKEN,
        async useFactory(): Promise<KafkaOptions> {
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
  controllers: [MockConsumerController],
})
export class MockConsumerModule {}
