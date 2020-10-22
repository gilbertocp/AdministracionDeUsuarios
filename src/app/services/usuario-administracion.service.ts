import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { UsuarioAdministracion } from '../models/usuario-administracion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdministracionService {

  constructor(private db: AngularFirestore) { }

  getUsuarios() : Observable<UsuarioAdministracion[]>{
    return this.db.collection<UsuarioAdministracion>('usuarios-administracion').valueChanges({idField: 'docId'});
  }

  addUsuario(usuario): Promise<DocumentReference> {
    return this.db.collection('usuarios-administracion').add(usuario);
  }
}
