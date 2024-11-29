import { Component , HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbaar',
  templateUrl: './navbaar.component.html',
  styleUrls: ['./navbaar.component.scss']
})
export class NavbaarComponent {

  searchToggle: boolean = false;
  showSignOutBox: boolean = false;

  // Toggle the mobile menu visibility
  showMobileMenu: boolean = false;

  constructor(private router: Router, private apiServiceService: ApiServiceService) { }

  // Toggle the mobile menu
  toggleMobileMenu() {
    this.showMobileMenu = true;
  }
  toggleMobileMenuClose() {
    this.showMobileMenu = false;
  }

  toggleSignOutBox(event: MouseEvent) {
    event.stopPropagation(); // Prevent event propagation to document click
    this.showSignOutBox = !this.showSignOutBox; // Toggle box visibility
  }

  // Hides the sign-out dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (this.showSignOutBox) {
      this.showSignOutBox = false;
    }
  }

  logout() {

    // this.apiServiceService.logout1()
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      // text: "You won't be able to logout this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      allowOutsideClick: false,   // Prevent closing when clicking outside
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Logout Successfully!",
          text: "You are now logged out..",
          icon: "success",
          allowOutsideClick: false,   // Prevent closing when clicking outside
          allowEscapeKey: false       // Prevent closing on pressing Escape

        });
        this.apiServiceService.isActivate = false
        localStorage.removeItem("token");
        localStorage.removeItem("r_token");
        localStorage.removeItem("UserData");
        localStorage.clear();
        this.router.navigate(['/login']);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your are now current page:)",
          icon: "error",
          allowOutsideClick: false,   // Prevent closing when clicking outside
          allowEscapeKey: false       // Prevent closing on pressing Escape
        });
      }
    });
  }

  searchEnable = (value: any) => {
    this.searchToggle = value
  }

}
