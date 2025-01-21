import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const rol = this.authService.getRolUsuario();
    if (rol === 'Colocador') {
      return true; // Permitir acceso si el usuario tiene el rol correcto
    }

    alert('Acceso denegado: su rol de usuario no tiene permiso para acceder a esta página.');
    this.router.navigate(['/solicitudes']); // Redirigir si no tiene el rol adecuado
    return false;
  }
}
