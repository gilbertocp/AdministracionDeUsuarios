import { Injectable, Component } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {
    
  }

  canActivate(): Observable<boolean> {
    return this.authSvc.user$.pipe(
      take(1),
      map(user => user && user.perfil === 'admin'? true: false), 
      tap(isAdmin => {
        if(!isAdmin) {
          console.log('Access Denied - Admins Only');
          this.router.navigate(['/user-dashboard']);
        }
      })
    );
  }
  
}
