import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DPointService } from 'app/dpoints/dpoints.service';
import { UserService } from 'app/user/user.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'app-create-transaction',
	templateUrl: './create-transaction.component.html',
	styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent implements OnInit {
	@Input() data;
	isLoading: boolean = false;
	form: FormGroup;
	email$$: Subscription;
	parentName: string;
	branch: {id: number, name: string};

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private dPointService: DPointService,
		private userService: UserService,
	) {
		this.form = this.fb.group({
			parent_id: new FormControl('', Validators.required),
			email: new FormControl('', Validators.required),
			parent_name: new FormControl('', Validators.required),
			description: new FormControl('', Validators.required),
			points: new FormControl('', Validators.required),
		});
	}

	ngOnInit(): void {
		this.listenToEmail();
		this.branch = this.data.branch;
	}

	submit() {
		if (this.isLoading) {
			return;
		}

		if (this.form.invalid) {
			return alert('Please fill in all the fields');
		}
		this.isLoading = true;
		const body = this.form.value;

		delete body.email;
		delete body.parent_name;
		
		this.dPointService.rewardParent(body, this.branch.id).subscribe(res => {
			this.activeModal.close({
				isSuccess: true,
				response: res
			});
		}, err => {
			this.activeModal.close({
				isSuccess: false,
				response: err
			});
		})
	}

	listenToEmail() {
		this.email$$ = this.form.get('email').valueChanges.pipe(
			debounceTime(250),
			distinctUntilChanged()
		).subscribe(email => {
			if (this.form.get('email').valid) {
				this.email$$ = this.userService.getParentsByEmail(email).subscribe(parent => {
					this.parentName = parent.name;
					this.form.controls['parent_id'].setValue(parent.id);
					this.form.controls['parent_name'].setValue(parent.name);
				}, err => {
					this.parentName = '';
					this.form.controls['parent_id'].setValue('');
					this.form.controls['parent_name'].setValue('');
					console.log('err', err)
				})
			}
		})
	}
}
