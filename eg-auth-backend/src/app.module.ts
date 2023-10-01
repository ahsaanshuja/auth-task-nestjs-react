import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from 'utils/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      isGlobal: true,
      expandVariables: true,
    }),

    MongooseModule.forRoot(process.env.DB_URI, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB is connected!');
        });

        connection.on('error', (err) => {
          console.log('Failed to connect to MongoDB', err);
        });

        connection._events.connected();
        return connection;
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
