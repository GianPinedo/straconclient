import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent, LoginComponent], // Declara los componentes que usas
  imports: [
    BrowserModule,
    FormsModule, // Para ngModel
    RouterModule.forRoot(routes), // Configuración de las rutas
  ],
  bootstrap: [AppComponent], // Componente raíz
})
export class AppModule {}
