import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/user/user.service';
import { Credentials } from 'app/model/credentials';
import { AuthService } from 'app/auth/auth.service';
import { take } from 'rxjs/operators';
import {Router} from '@angular/router';
import { TitleService } from 'app/shared/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted = false;
  cred: Credentials;
  isLoading = false;

  constructor(
		private titleService: TitleService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
		  this.titleService.postTitle('Edit Profile')
      authService.credential$
      .pipe(
        take(1)
      ).subscribe(cred => this.cred = cred)
    }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  populateForm() {
    this.userService.getProfile()
    .subscribe(data => {
      this.profileForm.setValue({
        profile: {
          bank_name: data.profile.bank_name,
          bank_account_name: data.profile.bank_account_name,
          bank_account_number: data.profile.bank_account_number
        }
      });
    })
  }

  initializeForm() {
    this.profileForm = new FormGroup({
      profile: new FormGroup({
        bank_name: new FormControl('', Validators.required),
        bank_account_name: new FormControl('', Validators.required),
        bank_account_number: new FormControl('', Validators.required)
      })
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.profileForm.valid) {
      return;
    }
    this.isLoading = true;
    this.userService.putProfile(this.profileForm.value).subscribe(res => {
      this.isLoading = false;
      console.log('putProfile: ', res);
      this.router.navigate(['/branch']);
    }, error => {
      this.isLoading = false;
      alert(JSON.stringify(error.error.errors));
    })


  }
}
