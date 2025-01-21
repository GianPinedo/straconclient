import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Proveedor } from '../../../core/proveedor.model'; // Importa la interfaz
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../../core/proveedores.service';

@Component({
  selector: 'app-add-proveedor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-proveedor-modal.component.html',
  styleUrls: ['./add-proveedor-modal.component.scss'],
})
export class AddProveedorModalComponent implements OnChanges {
  @Input() proveedor: Proveedor | null = null; // Especifica que puede ser un proveedor o null
  @Output() close = new EventEmitter<void>();
  @Output() proveedorActualizado = new EventEmitter<void>();

  proveedorForm: Proveedor = {
    nombre: '',
    direccion: '',
    contacto: '',
  };

  errorMessage: string | null = null;

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proveedor'] && changes['proveedor'].currentValue) {
      this.proveedorForm = { ...changes['proveedor'].currentValue };
    }
  }
  
  

  guardarProveedor(): void {
    this.errorMessage = null;

    if (this.proveedor) {
      this.proveedoresService
        .actualizarProveedor(this.proveedor.id!, this.proveedorForm)
        .subscribe({
          next: (response) => {
            if (response.success) {
              alert('Proveedor actualizado correctamente.');
              this.proveedorActualizado.emit();
              this.close.emit();
            } else {
              this.errorMessage = response.message || 'Error al actualizar el proveedor.';
            }
          },
          error: () => {
            this.errorMessage = 'Error de comunicación con el servidor.';
          },
        });
    } else {
      this.proveedoresService.agregarProveedor(this.proveedorForm).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Proveedor agregado correctamente.');
            this.proveedorActualizado.emit();
            this.close.emit();
          } else {
            this.errorMessage = response.message || 'Error al agregar el proveedor.';
          }
        },
        error: () => {
          this.errorMessage = 'Error de comunicación con el servidor.';
        },
      });
    }
  }

  cerrarModal(): void {
    this.close.emit();
  }
}
