import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  focus;
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;
  private toggleButton;
  private sidebarVisible: boolean;

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeForm();
    this.sidebarVisible = false;
  }

  ngOnInit(): void {
    this.checkFullPageBackgroundImage();
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

    setTimeout(function() {
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700)
  }

  checkFullPageBackgroundImage() {
    const $page = $('.full-page');
    const image_src = $page.data('image');

    if (image_src !== undefined) {
      const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  }

  initializeForm() {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required])
    });
  }

  submit() {
    this.dirtyForm();

    if (this.isLoading || this.resetPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.resetPassword(this.resetPasswordForm.value).subscribe((res: any) => {
      this.isLoading = false;
      Swal.fire({
        icon: 'success',
        title: res.data,
        text: 'We\'ve sent your new password to your email',
      });
      this.router.navigate(['/auth/login']);
      console.log(res)
    }, err => {
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.message,
      })
      console.log(err.error.message)
    })
  }

  dirtyForm() {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      this.resetPasswordForm.get(key).markAsTouched();
      this.resetPasswordForm.get(key).markAsDirty();
    })
  }

  sidebarToggle() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    const sidebar = document.getElementsByClassName('navbar-collapse')[0];
    if (this.sidebarVisible === false) {
      setTimeout(function() {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
}
