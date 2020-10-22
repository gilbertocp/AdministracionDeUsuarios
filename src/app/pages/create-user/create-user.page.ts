import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera, Direction } from '@ionic-native/camera/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Dni } from '../../models/dni.enum';
import { UsuarioAdministracion } from '../../models/usuario-administracion';
import { Utils } from '../../models/utils';
import { File } from '@ionic-native/file/ngx';
import { UsuarioAdministracionService } from '../../services/usuario-administracion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {

  dni: string;
  img: string;
  clave: string;
  correo: string;
  nombres: string;
  apellidos: string;
  errMessage: string = '';
  imagePreviewUrl: string = 'assets/noimage.png';
  confirmarClave: string;

  constructor(
    private file: File,
    private camera: Camera,
    private router: Router,
    private storage: AngularFireStorage,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private usuariosAdministracionSvc: UsuarioAdministracionService,
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

  async createUser() {
    
    if(!this.checkForm()) {
      this.presentAlert(this.errMessage);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Espere. . .',
    });

    await loading.present();

    this.file.readAsArrayBuffer(Utils.getDirectory(this.img), Utils.getFilename(this.img))
    .then(arrayBuffer => {
      const fileBlob = new Blob(
        [ arrayBuffer ],
        { type: 'image/jpg' }
      )

      const storagePath = `images/${new Date().toLocaleDateString()}__${Math.random().toString(36).substring(2)}`;
      const uploadTask = this.storage.upload(storagePath, fileBlob);

      uploadTask.then(async task => {

        const usuario: UsuarioAdministracion = {
          nombres: this.nombres.toUpperCase(),
          apellidos: this.apellidos.toUpperCase(),
          correo: this.correo,
          clave: this.clave,
          dni: this.dni,
          imgUrl: await task.ref.getDownloadURL()
        };

        this.usuariosAdministracionSvc.addUsuario(usuario)
        .then(() => {
          this.presentAlert('Se ha registrado el usuario exitosamente')
          this.router.navigate(['/admin-dashboard']);
        })
        .catch(() => {
          this.presentAlert('No se ha podido registrar el usuario, intentelo más tarde');
        })
        .finally(() => {
          loading.dismiss();
        });

      });
    });
  }

  takePic(): void {
    this.camera.getPicture({
      cameraDirection: Direction.BACK,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI
    })
    .then(imageData => {
      this.img = imageData;
      
      this.file
      .readAsDataURL(Utils.getDirectory(imageData), Utils.getFilename(imageData))
      .then(base64Url => {
        this.imagePreviewUrl = base64Url;
      }).catch(err => console.log(err));
    });
  }

  takeFromGallery(): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    })
    .then(imageData => {
      this.img = Utils.getDirectory(imageData) + Utils.getFilenameGallery(imageData)
      
      this.file
      .readAsDataURL(Utils.getDirectory(imageData), Utils.getFilenameGallery(imageData))
      .then(base64Url => {
        this.imagePreviewUrl = base64Url;
      }).catch(err => console.log(err));
    });
  }

  checkForm(): boolean {
    this.errMessage = '';
    let noEmptyValues = false;
    let validEmail = false;
    let samePassword = false;
    let photoUploaded = false;

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

      if(!Utils.isEmpty(this.img)) {
        photoUploaded = true;
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

    if(!photoUploaded) {
      this.errMessage += 'Tiene que subir una imagen';
      return false;
    }

    if(noEmptyValues && samePassword && validEmail) {
      return true;
    }
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: msj,
      message: this.errMessage,
      buttons: ['OK']
    });

    await alert.present();
  }

}
