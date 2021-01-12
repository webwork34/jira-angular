import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  User,
  FbRegisterResponse,
  FbCreateResponse,
  FbLoginResponse,
} from './../shared/interfaces';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userName = '';
  constructor(private http: HttpClient, private router: Router) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fireB-token-exp')!);
    if (new Date() > expDate) {
      this.logout();
      return null!;
    }
    return localStorage.getItem('fireB-token')!;
  }

  register(user: User): Observable<FbRegisterResponse> {
    return this.http.post<FbRegisterResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
      user
    );
  }

  createNewUser(user: any): Observable<FbCreateResponse> {
    return this.http.post<FbCreateResponse>(
      `${environment.fbDbUrl}/users.json`,
      user
    );
  }

  login(user: User): Observable<FbLoginResponse | null> {
    return this.http
      .post<FbLoginResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(tap(this.setToken));
  }

  private setToken(response: FbLoginResponse | null) {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem('fireB-token', response.idToken);
      localStorage.setItem('fireB-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
