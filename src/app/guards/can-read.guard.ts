import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanReadGuard implements CanActivate {
  
  constructor(
    private authSvc: AuthService
  ) {
    
  }
  
  canActivate(): Observable<boolean>{
      return this.authSvc.user$.pipe(
        take(1),
        map(user => user && this.authSvc.canRead(user) ? true: false), 
        tap(canView => {
          if(!canView)
            console.log('Must have permission to view content');
        })
      );
  }
  
}
