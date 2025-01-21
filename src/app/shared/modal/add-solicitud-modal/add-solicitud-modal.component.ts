import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../../core/proveedores.service';
import { ProductosService } from '../../../core/productos.service';
import { SolicitudesCompraService } from '../../../core/solicitudes-compra.service';
import { Detalle } from '../../../core/detalle.model';
import { Solicitud } from '../../../core/solicitud.model';

@Component({
    selector: 'app-add-solicitud-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-solicitud-modal.component.html',
    styleUrls: ['./add-solicitud-modal.component.scss'],
  })
  export class AddSolicitudModalComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    @Output() solicitudCreada = new EventEmitter<void>();
    @Input() visible: boolean = false
  
    proveedores: any[] = [];
    productos: any[] = [];
    detalles: Detalle[] = [];
    totalOrden: number = 0;

  
    solicitud: Solicitud = {
      solicitudId: 0,
      proveedorId: '',
      usuario: '',
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pendiente',
      detalles: [],
    };
  
    errorMessage: string | null = null;
  
    constructor(
      private proveedoresService: ProveedoresService,
      private productosService: ProductosService,
      private solicitudesService: SolicitudesCompraService
    ) {}
  
    ngOnInit(): void {
      this.cargarProveedores();
      this.cargarProductos();
    }
  
    cargarProveedores(): void {
      this.proveedoresService.obtenerProveedores().subscribe({
        next: (response) => {
          if (response.success) {
            this.proveedores = response.data;
          }
        },
        error: () => {
          this.errorMessage = 'Error al cargar los proveedores.';
        },
      });
    }
  
    cargarProductos(): void {
      this.productosService.obtenerProductos().subscribe({
        next: (response) => {
          if (response.success) {
            this.productos = response.data;
          }
        },
        error: () => {
          this.errorMessage = 'Error al cargar los productos.';
        },
      });
    }
  
    agregarProductoAlDetalle(producto: any): void {
      const detalle: Detalle = {
        nombre: producto.nombre,
        productoId: producto.id,
        cantidad: 1,
        precioUnitario: producto.precioUnitario,
        subtotal: producto.precioUnitario,
      };
  
      this.detalles.push(detalle);
      this.actualizarSubtotal(detalle);
    }
  
    actualizarSubtotal(detalle: any): void {
      detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
      this.calcularTotalOrden();
    }
    calcularTotalOrden(): void {
      this.totalOrden = this.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    }
    
    
  
    guardarSolicitud(): void {
      if (!this.solicitud.proveedorId || this.detalles.length === 0) {
        this.errorMessage = 'Debe seleccionar un proveedor y agregar al menos un producto.';
        return;
      }
    
      // Validar cada detalle
      for (const detalle of this.detalles) {
        if (
          !detalle.productoId || // Validar productoId
          detalle.cantidad <= 0 || // Validar cantidad positiva
          detalle.precioUnitario <= 0 || // Validar precio unitario
          detalle.subtotal <= 0 // Validar subtotal
        ) {
          //this.errorMessage = 'Todos los productos deben tener datos válidos.';
          console.log('Todos los productos deben tener datos válidos.');
          //return;
        }
      }

      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const usuarioId = usuario?.id || '';
    
      // Construir el objeto para el backend
      const solicitudParaBackend = {
        solicitudId: 0,
        proveedor: this.solicitud.proveedorId.toString(), 
        usuario: usuarioId.toString(),
        fecha: this.solicitud.fecha,
        estado: 'Pendiente',
        detalles: this.detalles.map((detalle) => ({
          producto: detalle.productoId.toString(), 
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          subtotal: detalle.subtotal,
        })),
      };
    
      // Enviar al servicio
      console.log('Datos enviados al backend:', solicitudParaBackend); // Verifica los datos
      this.solicitudesService.crearSolicitud(solicitudParaBackend).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Solicitud creada correctamente.');
            this.solicitudCreada.emit();
            this.close.emit();
          } else {
            this.errorMessage = response.message || 'Error al crear la solicitud.';
          }
        },
        error: () => {
          this.errorMessage = 'Error de comunicación con el servidor.';
        },
      });
    }
    
  
    cerrarModal(): void {
      this.close.emit();
    }
  }