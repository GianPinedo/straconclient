import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      this.router.navigate(['/solicitudes']); // Redirige a solicitudes si ya está autenticado
      return false;
    }

    return true; // Permite acceso al login si no está autenticado
  }
}
