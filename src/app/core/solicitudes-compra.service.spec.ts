import { TestBed } from '@angular/core/testing';

import { SolicitudesCompraService } from './solicitudes-compra.service';

describe('SolicitudesCompraService', () => {
  let service: SolicitudesCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudesCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
