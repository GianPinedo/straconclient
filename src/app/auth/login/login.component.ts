import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'], 
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  credentials = { nombreUsuario: '', contrasena: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null; 
    this.authService.login(this.credentials.nombreUsuario, this.credentials.contrasena).subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.saveSessionData(response.data.token, response.data.usuario);
          this.router.navigate(['/solicitudes']); 
        } else {
          this.errorMessage = response.message || 'Error desconocido';
        }
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
      },
    });
  }
}
