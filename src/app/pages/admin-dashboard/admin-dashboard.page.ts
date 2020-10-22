import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

  usuario: Usuario;
  loadingElement: HTMLIonLoadingElement;

  constructor(
    private authSvc: AuthService,
    private actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.presentLoading();

    this.authSvc.user$.subscribe(user => {
      this.usuario = {...user.data, docId: user.id};
      this.loadingElement.onDidDismiss();
    });
  }

  verListado() {
    this.router.navigate(['/user-dashboard']);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Control',
      buttons: [{
        text: 'Cerrar Sesión',
        icon: 'log-out',
        handler: () => {
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentLoading() {
    this.loadingElement = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1500,
      spinner: 'bubbles'
    });
    await this.loadingElement.present();
  }

}
