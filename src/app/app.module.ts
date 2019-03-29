// angular
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { CookieService, CookieModule, CookieOptionsProvider } from '@gorniv/ngx-universal';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { JwtModule } from '@auth0/angular-jwt';
// shared
import { SharedModule } from '@shared/shared.module';
import { TranslatesService } from '@shared/translates';
import { AuthService } from '@shared/services/auth.service';
// components
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { UniversalStorage } from '@shared/storage/universal.storage';
// interceptors
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';
import { ErrorInterceptor } from '@shared/interceptors/error.interceptor';
import { AuthGuard } from '@shared/guards/auth.guard';
import { UnAuthGuard } from '@shared/guards/un-auth.guard';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    TransferHttpCacheModule,
    HttpClientModule,
    RouterModule,
    AppRoutes,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['http://localhost:4000/api/auth'],
      },
    }),
  ],
  declarations: [AppComponent],
  providers: [
    CookieService,
    UniversalStorage,
    AuthService,
    // Guards
    AuthGuard,
    UnAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initLanguage, multi: true, deps: [TranslatesService] },
  ],
})
export class AppModule {
}
