import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MockConsumerModule } from './mocks/mock-consumer.module';
import { MockConsumerController } from './mocks/mock-consumer.controller';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT_TOKEN } from '../src/constants/kafka-client-token.constant';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: ClientKafka;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MockConsumerModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    client = await app.get(KAFKA_CLIENT_TOKEN);
    await client.connect();
    await app.init();
  });

  afterAll(async () => {
    client.close();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');

    return new Promise((res, rej) => {
      setTimeout(() => {
        try {
          // This checks the value assigned to static field DATA on the mock consumer. This mock
          // consumes the message that's emitted to the test topic
          expect(MockConsumerController.DATA).toEqual({
            test: expect.any(Number),
          });

          res(null);
        } catch (err) {
          return rej(err);
        }
      }, 9_000);
    });
  }, 10_000);
});
