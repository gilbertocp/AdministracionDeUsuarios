import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private db: AngularFirestore) { }

  getUsuarios(): any {
    return this.db.collection<Usuario>('usuarios').valueChanges({idField: 'docId'});
  }
}
