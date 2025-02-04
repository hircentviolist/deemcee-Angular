import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DPointService } from 'app/dpoints/dpoints.service';

@Component({
	selector: 'app-create-campaign',
	templateUrl: './create-campaign.component.html',
	styleUrls: ['./create-campaign.component.css']
})
export class CreateCampaignComponent implements OnInit {
	@Input() data;
	
	title: string = 'Create new Campaign';
	submitted: boolean = false;
	isLoading: boolean = false;
	form: FormGroup;
	
	bonusMultiplyOptions: {label: string, value: number}[] = [
		{label: '1x', value: 1},
		{label: '2x', value: 2},
		{label: '3x', value: 3},
	];

	accumulations: {label: string, value: string} [] = [];

	startDate: NgbDateStruct;
	endDate: NgbDateStruct;

	startTime: {
		hour: number,
		minute: number,
	};
	endTime: {
		hour: number,
		minute: number,
	};

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private dPointService: DPointService,
		private config: NgbTimepickerConfig,
	) {
		this.config.seconds = false;
		this.config.spinners = false;
		this.config.minuteStep = 15;
		this.config.size = 'medium';
	}

	ngOnInit(): void {
		if (this.data?.id) {
			this.dPointService.getCampaigns(this.data.id).subscribe((res: any) => {
				this.title = res.title;
				this.form.patchValue(this.patchValueFormat(res));
			});
		}
		
		this.getAccumulations();
		this.initForm();
	}

	initForm() {
		this.form = this.fb.group({
			accumulation: new FormControl('', Validators.required),
			title: new FormControl('', Validators.required),
			points: new FormControl('', Validators.required),
			bonus_multiply: new FormControl('', Validators.required),
			start_date: new FormControl('', Validators.required),
			end_date: new FormControl('', Validators.required),
			start_time: new FormControl('', Validators.required),
			end_time: new FormControl('', Validators.required),
		});
	}

	patchValueFormat(data) {
		return {
			...data,
			start_date: this.convertToDatePickerFormat(data.start_datetime.split(' ')[0]),
			end_date: this.convertToDatePickerFormat(data.end_datetime.split(' ')[0]),
			start_time: this.convertToTimePickerFormat(data.start_datetime.split(' ')[1]),
			end_time: this.convertToTimePickerFormat(data.end_datetime.split(' ')[1]),
		}
	}

	getAccumulations() {
		this.dPointService.getAccumulations().subscribe((data: any) => {
			this.accumulations = Object.keys(data)
				.filter(key => key !== 'point_to_RM')
				.map(key => {
					return {
						value: key,
						label: this.dPointService.titleCase(key.split('_').join(' ')),
					}
				});
		})
	}

	submit() {
		this.submitted = true;
		this.dirtyForm(this.form);

		if (this.form.invalid) {
			this.submitted = false;
			return alert('Please fill all required fields');
		}

		const body = {
			...this.form.value,
			start_datetime: this.convertDateTimeFormat(this.startDate, this.startTime),
			end_datetime: this.convertDateTimeFormat(this.endDate, this.endTime),
		}
		
		if (this.data?.id) {
			this.dPointService.updateCampaign(body, this.data.id).subscribe(res => {
				this.activeModal.close({
					isSuccess: true,
					response: res
				});
			}, err => {
				this.activeModal.close({
					isSuccess: false,
					error: err
				});
			})
		} else {
			this.dPointService.createCampaign(body).subscribe(res => {
				this.activeModal.close({
					isSuccess: true,
					response: res
				});
			}, err => {
				this.activeModal.close({
					isSuccess: false,
					error: err
				});
			})
		}
	}

	convertDateTimeFormat(date: {year: number, month: number, day: number}, time: {hour: number, minute: number}) {
		const month = ('0' + date.month.toString()).slice(-2);
		const day = ('0' + date.day.toString()).slice(-2);

		const hour = ('0' + time.hour.toString()).slice(-2);
		const minute = ('0' + time.minute.toString()).slice(-2);

		return `${date.year}-${month}-${day} ${hour}:${minute}:00`;
	}

	convertToTimePickerFormat(time: string) {
		const timeArray = time.split(':');

		return {
		  hour: +timeArray[0],
		  minute: +timeArray[1],
		}
	}

	convertToDatePickerFormat(date: string) {
		const dateArray = date.split('-');

		return {
			year: +dateArray[0],
			month: +dateArray[1],
			day: +dateArray[2],
		}
	}

	dirtyForm(formGroup: FormGroup) {
		(<any>Object).values(formGroup.controls).forEach(control => {
			control.markAsTouched();
	  
			if (control.controls) {
			  	this.dirtyForm(control);
			}
		});
	}
}
