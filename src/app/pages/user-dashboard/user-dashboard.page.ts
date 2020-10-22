import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UsuarioAdministracionService } from '../../services/usuario-administracion.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage implements OnInit {

  usuarios = [];
  esAdmin = false;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    public authSvc: AuthService,
    private usuarioAdministracionSvc: UsuarioAdministracionService,
    public loadingController: LoadingController,
  ) {  
    this.authSvc.user$.subscribe(user => {
      if(user.data.perfil === 'admin') {
        this.esAdmin = true;
      } else {
        this.esAdmin = false;
      }
    });
  }

  ngOnInit() {
    this.presentLoading();
    this.usuarioAdministracionSvc.getUsuarios()
    .subscribe(users => {
      this.usuarios = users;
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Control',
      buttons: [{
        text: 'Cerrar Sesión',
        icon: 'log-out',
        handler: () => {
          this.authSvc.logout();
          this.router.navigate(['/login']); 
        }
      }]
    });
    await actionSheet.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1500,
      spinner: 'bubbles'
    });
    await loading.present();
  }
}
