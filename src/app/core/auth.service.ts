import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  nomComplet: string;
  profilId?: number;
  actif: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;
  private readonly accessTokenKey = 'cima_alm_access_token';
  private readonly refreshTokenKey = 'cima_alm_refresh_token';
  private readonly userKey = 'cima_alm_user';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  logout(): void {
    this.http.post<void>(`${this.baseUrl}/logout`, {}).subscribe({ error: () => undefined });
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh-token`, { refreshToken: this.refreshTokenValue }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  get refreshTokenValue(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get currentUser(): AuthUser | null {
    const value = localStorage.getItem(this.userKey);
    return value ? JSON.parse(value) as AuthUser : null;
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
  }
}
