import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiServiceService } from './api-service.service';

export interface Users {
  loginName: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  logout(arg0: boolean) {
    throw new Error('Method not implemented.');
  }
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  private tokenSubject: BehaviorSubject<string | null>;
   //baseUrl='http://192.168.120.55:8000'
//  baseUrl='http://csm.augtrans.com:4049'

baseUrl='http://localhost:8000' // localhost
// baseUrl='http://35.154.191.16:8000' // AWS
constructor(private http: HttpClient, private route: Router,private apiservise:ApiServiceService) {
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
    this.userSubject = new BehaviorSubject<any>(localStorage.getItem('UserData'));
    this.user = this.userSubject.asObservable();
   }

   proceedLogin(userCred: Users): Observable<any[]> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
    // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'auth-token': JSON.parse(localStorage.getItem('access') || '')}) };
    return this.http.post<any[]>(this.baseUrl+'/api/login/', userCred, httpOptions).pipe(map((userData: any) => {
     
      
      if (userData) {
       
       // console.log('userData',userData);
        localStorage.setItem('token', JSON.stringify(userData.access));
     
       localStorage.setItem('r_token', (userData.refresh));
       this.apiservise.isActivate=true
        this.userSubject = userData;
        
        return userData;
      } else {
        return '';
      }
    }));
  }




  // getusertoken() {
  //   return localStorage.getItem('gdUserData');
  // }

  // gettoken() {
  //   return !!localStorage.getItem('gdUserData');
  // }

  // isLoggedIn() {
  //   return !!localStorage.getItem('gdUserData');
  // }

}
