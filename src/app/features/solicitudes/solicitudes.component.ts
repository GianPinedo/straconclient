import { Component, OnInit, Input } from '@angular/core';
import { SolicitudesCompraService } from '../../core/solicitudes-compra.service';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../shared/nav/nav.component'; // Ajusta la ruta si es diferente
import { HeaderComponent } from '../../shared/header/header.component'; // Ajusta la ruta si es diferente
import { ModalComponent } from '../../shared/modal/modal.component';
import { Detalle } from '../../core/detalle.model';
import { Solicitud } from '../../core/solicitud.model';
import { AddSolicitudModalComponent } from '../../shared/modal/add-solicitud-modal/add-solicitud-modal.component'; // Ajusta la ruta si es diferente
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, NavComponent, HeaderComponent, ModalComponent, AddSolicitudModalComponent],
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
})
export class SolicitudesComponent implements OnInit {
  
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = []; 
  errorMessage: string | null = null;
  modalVisible: boolean = false;
  solicitudSeleccionada: any = null;
  detalles: Detalle[] = [];
  modalAgregarVisible = false; 
  esColocador: boolean = false;
  estadoSeleccionado: string = '';

  constructor(private authService: AuthService,private solicitudesService: SolicitudesCompraService) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
    this.verificarRol();
  }
  verificarRol(): void {
    const rol = this.authService.getRolUsuario();
    this.esColocador = rol === 'Colocador';
  }

  obtenerSolicitudes(): void {
    console.log('Iniciando obtención de solicitudes...');
    this.solicitudesService.obtenerSolicitudes().subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response); // Verifica el formato de la respuesta
        if (response.success) {
          this.solicitudes = response.data;
          this.filtrarSolicitudes(); 
          console.log('Solicitudes procesadas:', this.solicitudes);
        } else {
          this.errorMessage = response.message || 'Error al cargar las solicitudes.';
          console.warn('Error en la respuesta:', this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = 'Error de comunicación con el servidor.';
        console.error('Error en la solicitud:', error);
      },
      complete: () => {
        console.log('Finalizó la obtención de solicitudes.');
      },
    });
  }
  verSolicitud(solicitudId: number): void {
    this.modalVisible = false;
    this.solicitudSeleccionada = null;
    console.log('Solicitud ID seleccionada:', solicitudId);
  
    this.solicitudesService.obtenerSolicitudPorId(solicitudId).subscribe({
      next: (response) => {
        console.log('Datos de la solicitud obtenidos:', response.data);
        if (response.success) {
          this.solicitudSeleccionada = response.data;
          this.modalVisible = true;
          console.log('Modal visible:', this.modalVisible);
        }
      },
      error: (error) => {
        console.error('Error al cargar los detalles de la solicitud:', error);
      },
    });
  }
  

  cerrarModal(): void {
    this.modalVisible = false;
    this.solicitudSeleccionada = null;
  }

  agregarSolicitud(): void {
    if (!this.esColocador) { return; } // Evita que los colocadores creen solicitudes
    this.modalVisible = true;
    this.solicitudSeleccionada = {
      solicitudId: 0,
      proveedor: '',
      usuario: '', // Usuario actual, debe configurarse según la autenticación
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pendiente',
      detalles: [],
    }; // Estructura inicial para una nueva solicitud
  }
  actualizarSubtotal(detalle: Detalle): void {
    detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
  }

  guardarSolicitud(): void {
    if (!this.solicitudSeleccionada.proveedor || this.solicitudSeleccionada.detalles.length === 0) {
      alert('Debe seleccionar un proveedor y agregar al menos un producto.');
      return;
    }
  
    const solicitudParaBackend = {
      ...this.solicitudSeleccionada,
      proveedor: this.solicitudSeleccionada.proveedor,
      detalles: this.solicitudSeleccionada.detalles.map((detalle: Detalle) => ({
        producto: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.cantidad * detalle.precioUnitario,
      })),
    };
  
    this.solicitudesService.crearSolicitud(solicitudParaBackend).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Solicitud creada correctamente.');
          this.modalVisible = false;
          this.obtenerSolicitudes(); // Recarga la tabla
        } else {
          alert(response.message || 'Error al crear la solicitud.');
        }
      },
      error: () => {
        alert('Error de comunicación con el servidor.');
      },
    });
  }
  abrirModalAgregar(): void {
    this.modalAgregarVisible = true;
  }
  cerrarModalAgregar(): void {
    this.modalAgregarVisible = false;
  }
  eliminarSolicitud(solicitudId: number): void {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta solicitud?');
    if (!confirmar) {
      return;
    }
  
    this.solicitudesService.eliminarSolicitud(solicitudId).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Solicitud eliminada correctamente.');
          this.obtenerSolicitudes(); // Actualiza la lista después de eliminar
        } else {
          alert(response.message || 'Error al eliminar la solicitud.');
        }
      },
      error: () => {
        alert('Error de comunicación con el servidor.');
      },
    });
  }
  filtrarSolicitudes(): void {
    if (this.estadoSeleccionado) {
      this.solicitudesFiltradas = this.solicitudes.filter(
        (solicitud) => solicitud.estado === this.estadoSeleccionado
      );
    } else {
      this.solicitudesFiltradas = [...this.solicitudes]; 
    }
  }

  onEstadoChange(estado: string): void {
    this.estadoSeleccionado = estado;
    this.filtrarSolicitudes();
  }
  recargarSolicitudes(): void {
    this.obtenerSolicitudes(); // Llama a tu método existente para obtener las solicitudes
  }
  
  
}
