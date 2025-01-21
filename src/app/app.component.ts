import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Marca este componente como independiente
  imports: [RouterModule], // Importa módulos necesarios (por ejemplo, RouterModule para router-outlet)
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {}
