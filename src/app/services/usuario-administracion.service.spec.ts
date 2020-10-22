import { TestBed } from '@angular/core/testing';

import { UsuarioAdministracionService } from './usuario-administracion.service';

describe('UsuarioAdministracionService', () => {
  let service: UsuarioAdministracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioAdministracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
