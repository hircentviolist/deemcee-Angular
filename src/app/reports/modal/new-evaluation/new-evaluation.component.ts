import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { ReportsService } from 'app/reports/reports.service';
import * as moment from 'moment';

const PAST_YEAR_COUNT = 3;
const MIN_PAST_YEAR = 2019;

@Component({
	selector: 'app-new-evaluation',
	templateUrl: './new-evaluation.component.html',
	styleUrls: ['./new-evaluation.component.css']
})
export class NewEvaluationComponent implements OnInit {
	@ViewChild('uploader') uploader: ElementRef;
	
	isLoading: boolean = false;
	form: FormGroup;

	years: {label: string, value: number} [] = [];

	months = [];
	monthList = moment.monthsShort();

	branches: any;

	file: any;

  	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private licenseeService: LicenseeService,
		private reportsService: ReportsService,
	) {
		this.form = this.fb.group({
			year: new FormControl('', Validators.required),
			month: new FormControl('', Validators.required),
			rating: new FormControl('', Validators.required),
			branch_id: new FormControl('', Validators.required),
		});

		this.generateYear();
	}

	ngOnInit(): void {
		this.licenseeService.getBranchForSelect().subscribe(res => {
			this.branches = res;
		}, err => {
			console.log(err)
			alert('Error in getting branch list')
		})
	}

	generateYear() {
		const now = moment();

		for (let i = 0; i < PAST_YEAR_COUNT; i++) {
			this.years.push(
				{
					label: now.format('YYYY'),
					value: +now.format('YYYY')
				}
			);
			now.subtract(1, 'years');

			if (Number(now.format('YYYY')) < MIN_PAST_YEAR) break;
		}

		this.form.controls['year'].setValue(this.years[0].value);
		this.generateMonth(+this.years[0].value);
	}

	generateMonth(selectedYear: number) {
		this.months = [];
		const now = moment();

		if (+now.format('YYYY') === selectedYear) {
			let isFound = false;
			const end = now.clone();

			this.months = this.monthList.filter(month => {
				if (isFound) return false;

				if (month === end.format('MMM')) {
					isFound = true;
				}
				return true;
			}).map(filtered => {
				return {
					label: filtered,
					value: this.monthList.indexOf(filtered) + 1
				}
			});
		} else {
			this.months = this.monthList.map(month => {
				return {
					label: month,
					value: this.monthList.indexOf(month) + 1
				}
			})
		}

		this.months.reverse();
		this.form.controls['month'].setValue(this.months[0].value);
	}

	onYearChange(e) {
		this.generateMonth(+e.target.value);
	}

	onFileChange(e) {
		const file = e.target.files[0];

		if (file) {
			this.file = file;
		}
	}

	removeFile() {
		this.file = null;
	}

	submit() {
		if (this.isLoading) {
			return;
		}

		if (this.form.invalid) {
			alert('Please fill all the fields')
			return;
		} else if (!this.file) {
			alert('Please upload one file')
			return;
		}
		this.isLoading = true;

		const formData = new FormData();
		formData.append('file', this.file);

		this.reportsService.uploadFile(formData).subscribe(filePath => {
			const body = {
				...this.form.value,
				...filePath
			}
			
			this.reportsService.createCentreEvaluationReport(body).subscribe(res => {
				this.activeModal.close('success');
			}, err => {
				this.activeModal.close('Fail to evaluate');
				console.log(err);
			})
		}, err => {
			this.activeModal.close('Fail to upload file');
			console.log(err);
		})
	}
}
