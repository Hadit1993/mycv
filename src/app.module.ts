import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import Report from './reports/report.entity';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './users/user.entity';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import CustomBadRequestException from './exceptions/custom_bad_request.exception';
import { ConfigModule, ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        entities: [User, Report],
      }),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validationError: { target: true, value: true },
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const errorObj = {};
          errors.forEach((val) => {
            errorObj[val.property] = Object.values(val.constraints)[0];
          });
          return new CustomBadRequestException(errorObj);
        },
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['abcd'] })).forRoutes('*');
  }
}
