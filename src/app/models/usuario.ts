export interface Roles {
  admin: boolean,
  noAdmin: boolean
}

export interface Usuario {
  docId?: string,
  clave?: string,
  correo?: string,
  id?:number,
  perfil?: string,
  sexo?: string,
  nombre?: string
}