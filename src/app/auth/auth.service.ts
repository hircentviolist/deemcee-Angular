import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { Login } from 'app/model/login';
import { Credentials } from 'app/model/credentials';
import { ModuleControlService } from 'app/shared/module-control.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { tap, switchMap, map } from 'rxjs/operators';
import { AuthDto } from 'app/model/auth-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  credential$ = new BehaviorSubject<Credentials>(null);

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<any> {

    const url = environment.backendApi + 'auth/login';

    return this.http.post<AuthDto>(url, login)
    .pipe(
      tap(console.log),
      map(auth => {
        return {
          email: login.email,
          role: auth.roles[0], // until multiple roles can be created
          access_token: auth.access_token,
          refresh_token: auth.refresh_token,
          expires_in: auth.expires_in,
          full_name: auth.full_name,
          is_first_login: auth.is_first_login
        }
      }),
      tap((cred: Credentials) => {
        this.credential$.next(cred);
        localStorage.setItem('DeEmcee', JSON.stringify(cred));
      })
    )

  }

  isSignedIn(): boolean {
    const cred = JSON.parse(localStorage.getItem('DeEmcee')) as Credentials;
    if (cred) {
      this.credential$.next(cred);
      return true;
    }
    return false;
  }

  logout() {
    this.credential$.next(null);
    localStorage.removeItem('DeEmcee');
    return
  }

  resetPassword(body: {email: string}) {
    const url = environment.backendApi + 'password/reset';

    return this.http.post(url, body)
  }
}
