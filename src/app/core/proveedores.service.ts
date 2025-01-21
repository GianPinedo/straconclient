import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private apiUrl = `${environment.apiUrl}/Proveedores`;

  constructor(private http: HttpClient) {}

  obtenerProveedores(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  agregarProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, proveedor);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  actualizarProveedor(id: number, proveedor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proveedor);
  }
  
  
}
