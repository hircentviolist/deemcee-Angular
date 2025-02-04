import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TitleService } from 'app/shared/title.service';
import { SettingService } from './settings.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	changePasswordForm: FormGroup;
	isLoading: boolean = false;

	constructor(
		private titleService: TitleService,
		private settingService: SettingService,
	) {
		this.titleService.postTitle('Settings')
		this.changePasswordForm = new FormGroup({
			current_password: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
			password_confirmation: new FormControl('', Validators.required)
		}, { validators: this.checkPasswords })
	}

	ngOnInit(): void {
	}

	submit() {
		this.dirtyForm()
		
		if (this.isLoading || this.changePasswordForm.invalid) {
			return;
		}
		this.isLoading = true;

		this.settingService.changPassword(this.changePasswordForm.value).subscribe((res: any) => {
			this.isLoading = false;
			Swal.fire({
				icon: 'success',
				title: 'Good job!',
				text: res.data,
			})
			this.changePasswordForm.reset();
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
		Object.keys(this.changePasswordForm.controls).forEach(key => {
			this.changePasswordForm.controls[key].markAsTouched();
			console.log(key)
		})
	}

	checkPasswords(group: FormGroup) {
		const pass = group.get('password').value;
		const confirmPass = group.get('password_confirmation').value;

		return pass === confirmPass ? null : { passwordNotMatch: true }     
	}
}
