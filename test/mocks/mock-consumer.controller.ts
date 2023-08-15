import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT_TOKEN } from '../../src/constants/kafka-client-token.constant';
import { KAFKA_EXAMPLE_TOPIC } from '../../src/constants/kafka-topic.constant';

/**
 * Controller for mocking a consumer via a kafkajs nest js transporter
 */
@Controller()
export class MockConsumerController implements OnModuleInit {
  static DATA: Record<string, null> | null = null;

  constructor(
    @Inject(KAFKA_CLIENT_TOKEN)
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  @EventPattern(KAFKA_EXAMPLE_TOPIC)
  async getTestPayload(@Payload() data: any): Promise<void> {
    console.log('Made it to getTestPayload', data);

    // Assign to static field to allow for inspection in tests
    MockConsumerController.DATA = data;
  }
}
