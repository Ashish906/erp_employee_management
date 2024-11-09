import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Response} from 'express';

export interface ResponseI<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseI<T>> {
    private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();

    return next.handle()
      .pipe(
        map(data => {
          const responseObj: {[key: string]: any} = {
            status: response.statusCode
          }
          if(typeof data === 'object') {
            responseObj.data = data;
          } else if(typeof data === 'string') {
            responseObj.message = data;
          }
          return responseObj;
        }),
        catchError(error => {
          if(response.statusCode === 500) {
            this.logger.error(error);
          }
          return throwError(error);
        })
      )
  }
}