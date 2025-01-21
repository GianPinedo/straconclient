import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true, // Es standalone
  imports: [RouterModule, CommonModule], // Importa RouterModule aquí
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {}
