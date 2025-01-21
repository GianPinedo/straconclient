import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesCompraService } from '../../core/solicitudes-compra.service';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() solicitud: any; // Detalles de la solicitud
  @Input() visible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<void>();
  @Output() estadoActualizado = new EventEmitter<void>(); 

  esAprobador: boolean = false; // Define si el usuario tiene rol Aprobador
  estados = ['Pendiente', 'Aprobado', 'Rechazado']; // Opciones del combo de estados
  estadoSeleccionado: string = ''; // Estado seleccionado en el combo
  errorMessage: string | null = null;
  montoTotal: number = 0;

  constructor(
    private solicitudesService: SolicitudesCompraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const rol = this.authService.getRolUsuario();
    this.esAprobador = rol === 'Aprobador';
  
    if (this.solicitud) {
      this.estadoSeleccionado = this.solicitud.estado || 'Pendiente';
      console.log('Estado inicial:', this.estadoSeleccionado); // Debug inicial
    } else {
      this.estadoSeleccionado = 'Pendiente';
    }
    this.calcularMontoTotal();
  }

  calcularMontoTotal(): void {
    this.montoTotal = this.solicitud?.detalles.reduce(
      (total: number, detalle: any) => total + (detalle.subtotal || 0),
      0
    );
    console.log('Monto total calculado:', this.montoTotal); // Debug
  }
  
  actualizarEstado(): void {
    console.log('Estado seleccionado antes de enviar:', this.estadoSeleccionado); // Debug del valor
    if (!this.estadoSeleccionado) {
      this.errorMessage = 'Debe seleccionar un estado válido.';
      return;
    }

  
    this.solicitudesService
      .actualizarEstadoSolicitud(this.solicitud.solicitudId, this.estadoSeleccionado)
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert('Estado actualizado exitosamente.');
            this.estadoActualizado.emit();
            this.close.emit();
          } else {
            this.errorMessage = response.message || 'Error al actualizar el estado.';
          }
        },
        error: () => {
          this.errorMessage = 'Error de comunicación con el servidor.';
        },
      });
  }
  
  getMontoTotal(): number {
    if (!this.solicitud || !this.solicitud.detalles) {
      return 0;
    }
    return this.solicitud.detalles.reduce(
      (total: number, detalle: any) => total + detalle.subtotal,
      0
    );
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'estado-pendiente';
      case 'Aprobado':
        return 'estado-aprobado';
      case 'Rechazado':
        return 'estado-rechazado';
      default:
        return 'estado-desconocido';
    }
  }
  
  
  cerrarModal(): void {
    this.close.emit();
  }
}
