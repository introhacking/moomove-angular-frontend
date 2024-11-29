import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { AuthenticationService } from '../services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginFormData!: FormGroup;
  res: any;
  userData: any;
  responseData: any;
  isRedirect: boolean = false;

  constructor(private route: Router,
    private fb: FormBuilder,
    private apiServiceService: ApiServiceService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loginFormData = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  login() {

    let match = this.loginFormData.value;

    if (match !== this.loginFormData.value) {
      this.isRedirect = true;
    }

    // this.route.navigate(['shipmentQuoteGeneration']);      // yeh delete hoga sirf , then auth.guard.ts file mei !accessToken change to accessToken

    this.authenticationService.proceedLogin(match).subscribe(
      (res: any) => {
        this.isRedirect = true
        if (res) {
          // console.log("Login successful", res);

          this.responseData = res;
          localStorage.setItem('UserData', JSON.stringify(this.responseData));
          setTimeout(() => {
            this.route.navigate(['dashboard']); // shipmentQuoteGeneration
            Swal.fire({
              title: "Login Successful!",
              text: "You are now logged in.",
              icon: "success",
              timer: 1500, // Auto close after 3 seconds
              timerProgressBar: true, // Show timer progress bar
              showConfirmButton: false // Hide the "OK" button
            });
          }, 1000);
          
          const activity_log = localStorage.getItem('UserData');
          const parsedData = activity_log ? JSON.parse(activity_log) : {};

          const log = {
            userId: parsedData.userId,
            action_type: 'Login',
            action_status: true,
            description: 'User logged into the system',
            source_id: null,
            destination_id: null,
          }

          this.apiServiceService.activityLogCreation('/api/activity-log/', log).subscribe((res) => {
            console.log(res)
          })

          // this.isRedirect = true

          // this.isRedirect = true
        } else {
          this.route.navigate(['login']);
          // alert("Username or password is incorrect1.");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Username or password is incorrect.",

          });

          // const log = {
          //   userId: parsedData.userId,
          //   action_type: 'Login',
          //   action_status: false,
          //   description: 'User failed during logged into the system',
          // }

          // this.apiServiceService.activityLogCreation('/api/activity-log/', log).subscribe((res) => {
          //   console.log(res)
          // })
        }
      },
      (error: any) => {
        console.error(error);
        if (error.status == 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Username or password is incorrect.",

          });
          this.isRedirect = false
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Username and password is required",

          });
          this.isRedirect = false
        }
        // alert(error.status == 401 ? 'Username or password is incorrect12.' : "Error: Unknown Error!");
      }
    );
  }
}
