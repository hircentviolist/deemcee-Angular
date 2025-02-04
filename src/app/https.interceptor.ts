import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from './model/credentials';

@Injectable()
export class HttpsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let token: any = localStorage.getItem('DeEmcee');
    if (token) {
      token = JSON.parse(token);
      token = token.access_token;
    } else {
      token = '';
    }

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request);
  }
}
