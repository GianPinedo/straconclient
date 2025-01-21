import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesCompraService {
  private apiUrl = `${environment.apiUrl}/SolicitudesCompra`;

  constructor(private http: HttpClient) {}

  obtenerSolicitudes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  obtenerSolicitudPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  crearSolicitud(solicitud: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, solicitud);
  }
  eliminarSolicitud(solicitudId: number): Observable<any> {
    const url = `${this.apiUrl}/${solicitudId}`;
    return this.http.delete<any>(url);
  }
  actualizarEstadoSolicitud(solicitudId: number, estado: string): Observable<any> {
    const url = `${this.apiUrl}/${solicitudId}/estado`;
    return this.http.patch(url, { estado });
  }
}
