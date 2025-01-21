import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../shared/nav/nav.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ProveedoresService } from '../../core/proveedores.service';
import { AddProveedorModalComponent } from '../../shared/modal/add-proveedor-modal/add-proveedor-modal.component';
import { Proveedor } from '../../core/proveedor.model'; 

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, NavComponent, HeaderComponent, AddProveedorModalComponent],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  errorMessage: string | null = null;
  modalVisible = false;
  proveedorSeleccionado: Proveedor | null = null; 

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.errorMessage = null;
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (response) => {
        if (response.success) {
          this.proveedores = response.data;
        } else {
          this.errorMessage = response.message || 'Error al cargar los proveedores.';
        }
      },
      error: () => {
        this.errorMessage = 'Error de comunicación con el servidor.';
      },
    });
  }
  agregarProveedor(): void {
    // Lógica para agregar un proveedor
  }
  eliminarProveedor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Proveedor eliminado correctamente.');
            this.obtenerProveedores(); // Actualiza la tabla
          } else {
            alert(response.message || 'Error al eliminar el proveedor.');
          }
        },
        error: () => {
          alert('Error de comunicación con el servidor.');
        },
      });
    }
  }
  
  abrirModal(proveedor: Proveedor | null = null): void {
    this.proveedorSeleccionado = proveedor; // Asigna el proveedor seleccionado o null
    this.modalVisible = true;
  }
  
  cerrarModal(): void {
    this.modalVisible = false;
    this.proveedorSeleccionado = null;
  }
  
  actualizarTabla(): void {
    this.obtenerProveedores(); // Vuelve a cargar la lista de proveedores
  }
}
