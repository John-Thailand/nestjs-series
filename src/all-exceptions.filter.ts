import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { MyLoggerService } from './my-logger/my-logger.service';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

// グローバルにエラーハンドリングを行うためのカスタム例外フィルター
// @Catch(): 全ての例外をキャッチするデコレーター
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  // 例外をキャッチし、適切なレスポンスを返す
  catch(exception: unknown, host: ArgumentsHost) {
    // HTTPコンテキスト
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();

    const myResponseObj: MyResponseObj = {
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      // Unprocessable Entity(処理ができないもの)のことで、コードや文法、リクエストは間違っていないが、意味が間違っているため、うまく処理ができないもの
      myResponseObj.statusCode = 422;
      myResponseObj.response = exception.message.replaceAll(/\n/g, '');
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = 'Internal Server Error';
    }

    // 生成したレスポンスオブジェクトをクライアントに送信する
    response.status(myResponseObj.statusCode).json(myResponseObj);
    // エラーメッセージをログに記録
    this.logger.error(myResponseObj.response, AllExceptionsFilter.name);
    // 親クラスの例外処理を実行
    super.catch(exception, host);
  }
}
