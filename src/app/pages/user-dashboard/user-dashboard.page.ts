import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UsuarioAdministracionService } from '../../services/usuario-administracion.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage implements OnInit {

  esAdmin = false;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    public authSvc: AuthService,
    private usuarioAdministracionSvc: UsuarioAdministracionService
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
    this.usuarioAdministracionSvc.getUsuarios()
    .subscribe(users => {
      console.log(users);
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
}
