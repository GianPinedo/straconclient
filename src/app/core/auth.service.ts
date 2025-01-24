import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth/login`;

  constructor(private http: HttpClient) {}

  login(nombreUsuario: string, contraseña: string): Observable<any> {
    const body = { nombreUsuario, contraseña };
    return this.http.post<any>(this.apiUrl, body);
  }

  saveSessionData(token: string, usuario: any): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUsuario(): any | null {
    if (this.isBrowser()) {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  getRolUsuario(): string | null {
    const usuario = this.getUsuario();
    return usuario ? usuario.rol : null; // Retorna el rol del usuario
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}