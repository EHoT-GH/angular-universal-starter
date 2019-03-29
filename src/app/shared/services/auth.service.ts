import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from '@gorniv/ngx-universal';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class AuthService {
  private _authToken: string;
  private _authState: BehaviorSubject<boolean>;
  private _interruptedUrl: string;

  public get interruptedUrl(): string {
    return this._interruptedUrl;
  }

  public set interruptedUrl(url: string) {
    this._interruptedUrl = url;
  }

  public get token(): string {
    return this._authToken ? this._authToken : '';
  }

  public set token(token: string) {
    this._authToken = token;
    this._authState.next(!!token);
  }

  public set changeAuthState(newState: boolean) {
    this._authState.next(newState);
  }

  constructor(private _cookie: CookieService,
              private _http: HttpClient,
              private _router: Router) {
    this._authState = new BehaviorSubject(!1);
    this.token = this._cookie.get('token');
  }

  isAuthenticated(): boolean {
    // This method is required to implement authentication.
    return !!this.token;
  }

  saveTokenInCookieStorage(token: string): void {
    // For saving auth token in Cookie storage.
    this._cookie.put('token', token);
  }

  logIn(body: { email: string, password: string }) {
    return this._http.post<{ token: string }>('/api/auth', body)
      .pipe(tap(res => {
        this.saveTokenInCookieStorage(res.token);
        if (this.interruptedUrl && this.interruptedUrl.length) {
          this._router.navigate([this.interruptedUrl])
            .then(() => {
              // TODO: If Notification (toast) service is present we can show successfully LOGGED IN message
            });
        }
      }));
  }

  registration(body: { email: string, password: string }) {
    return this._http.post<{ token: string }>('/api/auth', body)
      .pipe(tap(res => {
        this.logIn(body);
      }));
  }

  logOut(reason: string) {
    this.changeAuthState = false;
    this._cookie.removeAll();
    this._router.navigate(['/auth', 'login']).then(() => {
      switch (reason) {
        case '401': {
          // TODO: If Notification (toast) service is present we can show LOG OUT message with reason 401 Error from server
          break;
        }
        case 'user option': {
          // TODO: If Notification (toast) service is present we can show LOG OUT message with another reason
          break;
        }
        default: {
          // TODO: If Notification (toast) service is present we can show LOG OUT message
        }
      }
    });
  }
}
