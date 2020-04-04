import { Injectable, NgModule } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Constants } from '../shared/constants';
import { from } from 'rxjs';
import { flatMap } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {
    constructor(private authSvc: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        return from(this.authSvc.getJWT()).pipe(
            flatMap(token => {
                const dupRequest = request.clone({
                    headers: new HttpHeaders({
                        'Content-Type': "application/json",
                        'Authorization': token
                    })
                });

                return next.handle(dupRequest).pipe(timeout(15000));
            })
        );

    }
};

@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: HttpsRequestInterceptor,
        multi: true
    }
    ]
})

export class InterceptorModule { }