import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    EmployeesModule,
    // スロットリングを提供するモジュール
    // スロットリング：システムの過負荷や特定利用者による資源の独占を回避するため
    // 一定の制限値を超えた場合に意図的に性能を低下させたり、要求を一時的に拒否したりする制御のこと
    ThrottlerModule.forRoot([
      {
        // レート制限に名前を付けている
        name: 'short',
        // time-to-live: 時間の長さ。この場合は60000秒
        ttl: 1000,
        // 指定されたttlの間に許可されるリクエストの最大数
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // APP_GUARD：NestJSのグローバルスコープのガードを設定するために使用されるトークン
      // アプリ全体に適用されるガードを提供できる
      provide: APP_GUARD,
      // ThrottlerGuardがアプリケーション全体のグローバルガードとして設定される
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
