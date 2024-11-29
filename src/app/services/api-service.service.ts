import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  source: any
  destination: any
  equipments: any
  shipment_Date: any
  quotation: any = []
  quantity: any
  comodity: any
  weight: any
  incoterms: any
  manualRate: any
  //baseUrl='http://192.168.120.55:8000'
  // baseUrl='http://csm.augtrans.com:4049'
  baseUrl = 'http://localhost:8000'     // LOCALHOST
  // baseUrl = 'http://35.154.191.16:8000' // AWS
  // baseUrl = 'http://13.234.231.216:8000' // AWS TEST
  accessToken1: any
  refreshToken: any
  parseda: any
  tokenactivate: any
  isActivate: boolean = false
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  // static currentUser: any;
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser") || '') : ''));
    this.currentUser = this.currentUserSubject.asObservable();

    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }
    // console.log("accessToken",this.accessToken1);
  }




  logout1() {
    if (!this.accessToken1) {
      console.error('Access token is missing or invalid.');
      alert('Logout failed. Access token missing.');
      return;
    }
    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken1 // Assuming you have a token stored in localStorage
      })
    };

    const body = {
      refresh_token: this.refreshToken
    };
    // console.log('this.refreshToken',this.accessToken1);

    // Make the HTTP POST request to the logout endpoint
    return this.http.post<any>(`${this.baseUrl}/api/logout/`, body, httpOptions)
      .subscribe(
        response => {
          // console.log('Logout successful:', response);
          // Clear localStorage items on successful logout

          this.isActivate = false


          // Redirect to login page or any other route as needed

        },
        error => {
          // console.error('Logout failed:', error);

          const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to logout this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire({
                title: "Logout Successfully!",
                text: "You are now logged out..",
                icon: "success",

              });
              localStorage.removeItem("token");
              // localStorage.removeItem("r_token");
              // localStorage.removeItem("UserData");
              localStorage.clear();
              this.router.navigate(['/login']);
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your are now current page:)",
                icon: "error"
              });
            }
          });
        }
      );


  }

  getCompanyList(url: any): Observable<any> {
    // Retrieve the access token from localStorage
    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    // Construct the HTTP headers with the Bearer token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.parseda}`
      })
    };

    // Make the HTTP GET request with the constructed headers
    return this.http.get<any>(`${this.baseUrl}/${url}`, httpOptions);
  }
  complanyListDataById(url: any, id: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken1}`
      })
    };
    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    // Make the HTTP GET request with the constructed headers
    return this.http.get<any>(`${this.baseUrl + url + id}/`, httpOptions);
    // return this.http.get(this.baseUrl+url+id+'/')
  }
  submitFileData(url: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.accessToken1}`
      })
    };
    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    // Assuming you want to send data as JSON in a POST request
    return this.http.post<any>(`${this.baseUrl}${url}`, data, httpOptions);
  }

  isLoggedIn() {
    return !!localStorage.getItem('access')
  }



  //
  getShipmentData(source: any, destination: any,) {


    // console.log(source,destination)


    // let shipmentUrl = this.baseUrl + "/api/rates/" + source + "/" + destination + "/" + equipments + "/"
    let shipmentUrl = this.baseUrl + "/api/rates/" + source + "/" + destination + "/"


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken1}`
      })
    };
    const accessToken = (localStorage.getItem('UserData'))
    // console.log('accessToken 123',accessToken);

    if (accessToken) {
      // console.log('accessToken 123',accessToken);
      const parsedUserData = JSON.parse(accessToken);
      this.accessToken1 = parsedUserData.access;
      this.refreshToken = parsedUserData.refresh;
    }

    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }
    // Make the HTTP GET request with the constructed headers
    return this.http.get<any>(shipmentUrl, httpOptions);
    // return this.http.get(shipmentUrl)
  }


  // getRates(): Observable<Rate[]> {
  //   return this.http.get<Rate[]>(this.apiUrl);
  // }

  addManualRate(endpoint: any, manualRate: any): Observable<any> {
    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    // Construct the HTTP headers with the Bearer token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.parseda}`
      })
    };
    return this.http.post<any>(this.baseUrl + endpoint, manualRate, httpOptions);
  }

  updatingManualRate(endpoint: any, updatingManualRateData: any): Observable<any> {
    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }

    // Construct the HTTP headers with the Bearer token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.parseda}`
      })
    };
    return this.http.put<any>(this.baseUrl + endpoint, updatingManualRateData, httpOptions);
  }

  deleteManualRate(endpoint: any): Observable<any> {
    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }
    // Construct the HTTP headers with the Bearer token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.parseda}`
      })
    };
    return this.http.delete<any>(this.baseUrl + endpoint, httpOptions);
  }


  // ACTIVITY LOG CREATION
  activityLogCreation(endpoint: any, activityLog: any): Observable<any> {
    const accessT = (localStorage.getItem('token'))
    if (accessT) {
      this.parseda = JSON.parse(accessT);
    }
    // Construct the HTTP headers with the Bearer token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.parseda}`
      })
    };
    return this.http.post<any>(this.baseUrl + endpoint, activityLog, httpOptions);
  }

}
