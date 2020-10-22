import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage implements OnInit {

  esAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private authSvc: AuthService
  ) { 
    this.route.queryParams.subscribe(params => {
      if(params && params.role === 'admin') {
        this.esAdmin = true;
      }
    })
  }

  ngOnInit() {
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
