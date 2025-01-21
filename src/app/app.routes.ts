import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RolGuard } from './core/rol.guard';
import { LoginGuard } from './core/login.guard';
import { LoginComponent } from './auth/login/login.component';
import { SolicitudesComponent } from './features/solicitudes/solicitudes.component';
import { ProveedoresComponent } from './features/proveedores/proveedores.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'solicitudes',
    component: SolicitudesComponent,
    canActivate: [AuthGuard], 
  },
  {
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate: [AuthGuard, RolGuard], 
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
