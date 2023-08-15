import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_EXAMPLE_TOPIC } from './constants/kafka-topic.constant';
import { KAFKA_CLIENT_TOKEN } from './constants/kafka-client-token.constant';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @Get()
  getHello(): string {
    this.kafkaClient.emit(KAFKA_EXAMPLE_TOPIC, {
      test: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    });
    return this.appService.getHello();
  }
}
