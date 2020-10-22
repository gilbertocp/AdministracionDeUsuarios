import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, Direction } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { Dni } from '../../models/dni.enum';
import { UsuarioAdministracion } from '../../models/usuario-administracion';
import { Utils } from '../../models/utils';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {

  nombres: string;
  apellidos: string;
  correo: string;
  clave: string;
  dni: string;
  fotoUrl: string = 'assets/noimage.png';
  confirmarClave: string;
  errMessage: string = '';

  constructor(
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    private storage: AngularFireStorage,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  scanDni(): void {
    this.barcodeScanner.scan({
      prompt: 'Coloque el código en el rectángulo',
      formats: "PDF_417"
    }).then(data => {
      if(data) {
        const dniData = data.text.split('@');
        this.nombres = dniData[Dni.NOMBRES];
        this.apellidos = dniData[Dni.APELLIDOS];
        this.dni = dniData[Dni.NUMERO_DOCUMENTO];
      }
    });
  }


  createUser(): void {
    if(!this.checkForm()) {
      this.presentAlert();
    }

    
  }

  takePic(): void {
    this.camera.getPicture({
      cameraDirection: Direction.BACK,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL
    })
    .then(imageData => {
      this.fotoUrl = 'data:image/jpeg;base64,'+ imageData;
    });
  }

  takeFromGallery(): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    })
    .then(imageData => {
      this.fotoUrl = 'data:image/jpeg;base64,'+ imageData;
    });
  }

  checkForm(): boolean {
    this.errMessage = '';
    let noEmptyValues = false;
    let validEmail = false;
    let samePassword = false;

    if(
      !Utils.isEmpty(this.correo) &&
      !Utils.isEmpty(this.nombres) &&
      !Utils.isEmpty(this.apellidos) &&
      !Utils.isEmpty(this.dni) &&
      !Utils.isEmpty(this.clave) &&
      !Utils.isEmpty(this.confirmarClave)
    ) {
      noEmptyValues = true;
      if(Utils.validEmail(this.correo)) {
        validEmail = true;
      }

      if(Utils.samePassword(this.clave, this.confirmarClave)) {
        samePassword = true;
      }
    }

    if(!noEmptyValues) {
      this.errMessage += 'Los campos no deben estar vacios';
      return false;
    }
    
    if(!validEmail) {
      this.errMessage += 'Ingrese un email valido\n'
      return false;
    }

    if(!samePassword) {
      this.errMessage += 'Ingrese la misma constraseña para verificar\n';
      return false;
    }

    if(noEmptyValues && samePassword && validEmail) {
      return true;
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'El formulario no es válido',
      message: this.errMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
