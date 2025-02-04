import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    focus;
    focus1;
    focus2;
    test: Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    loginForm: FormGroup;
    submitted = false;
    error = false;
    error$$: Subscription;

    constructor(
        private element: ElementRef,
        private router: Router,
        private authService: AuthService) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {

        this.initializeForm();

        // from template
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
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        if (this.error$$) {
            this.error$$.unsubscribe();
        }
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
    initializeForm(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.email, Validators.required]),
            password: new FormControl('', Validators.required)
        })
    }
    onLogin() {
        this.submitted = true;
        if (!this.loginForm.valid) {
            return;
        }

        this.authService.login(this.loginForm.value)
        .subscribe(
            response => {
                const hq = ['admin', 'superadmin'];
                const branch = ['principal', 'manager', 'teacher', 'parent'];
                if (hq.includes(response.role)) {
                    this.router.navigate(['/hq']);

                    if (response.is_first_login) {
                        this.changePasswordPopup(response.full_name, 'hq');
                    }
                } else if (branch.includes(response.role)) {
                    this.router.navigate(['/branch']);

                    if (response.is_first_login) {
                        this.changePasswordPopup(response.full_name, 'branch');
                    }
                } else {
                    console.log(`${response.role} is unknown`);
                    this.router.navigate(['/'])
                }
            },
            error => {
                this.error = error.error.message;
                this.loginForm.valueChanges
                .pipe(
                    take(1)
                ).subscribe(() => this.error = false)
            }
        )
    }

    changePasswordPopup(name: string, type: 'hq' | 'branch') {
        Swal.fire({
            icon: 'info',
            title: `Hi ${name}`,
            text: 'This is your first time login, please change your password before proceed',
        }).then(_ => {
            this.router.navigate([ `/${type}/settings`]);
        })
    }
}
