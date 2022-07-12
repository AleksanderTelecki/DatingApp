import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from '../_services/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountsService:AccountsService, private toastr:ToastrService){

  }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean>{
    return this.accountsService.currentUser$.pipe(
      map(user=>{
        if(user) return true;
        
        this.toastr.error("You shall not pass!");
        
      })
    );
  }
  
}
