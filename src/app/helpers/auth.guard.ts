import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiServiceService } from '../services/api-service.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private apiservice: ApiServiceService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
    const accessToken =(localStorage.getItem('UserData') )
    if (accessToken) {
      // console.log("isactivate11",this.apiservice.isActivate);
      return true;
    } else {
    
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You don't have permission to view this page, Redirecting to Login!",
    
      });
      this.router.navigate(['login']);
      return false; // Return false after navigating
    }
  }

  // canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   if (this.apiservice.isLoggedIn()) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }
  
}

   
