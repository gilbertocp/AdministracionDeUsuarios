import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  spinner = false;

  constructor(
    private toastController: ToastController,
    private authSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.spinner = true;

    this.authSvc.login(this.email, this.password)
    .then(() => {
      localStorage.setItem('cred_ad_usuarios', Math.random().toString(36).slice(-8));
      this.router.navigate(['/home']);
    })
    .catch(() => this.displayErrorToast('No se ha podido iniciar sesión, verifique que el usuario y la clave esten ingresado correctamente'))
    .finally(() => this.spinner = false);   
  }

  loginUsersButtons({currentTarget}): void {
    switch(currentTarget.id) {
      case 'tester':
        this.email = 'tester@tester.com';
        this.password = '555555';
      break;
      case 'admin':
        this.email = 'admin@admin.com';
        this.password = '111111';
      break;

      case 'invitado':
        this.email = 'invitado@invitado.com';
        this.password = '222222';
      break;

      case 'anonimo':
        this.email = 'anonimo@anonimo.com';
        this.password = '444444';
      break;

      case 'usuario':
        this.email = 'usuario@usuario.com';
        this.password = '333333';
      break;
    }

    (document.querySelector('#submit') as HTMLButtonElement).click();
    
  }

  private async displayErrorToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
