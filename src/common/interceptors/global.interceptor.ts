import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import path from 'path';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class GlobalResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const successMessage = this.reflector.get<string>(
      'successMessage',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: successMessage || 'Request Successful',
        data: data,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
