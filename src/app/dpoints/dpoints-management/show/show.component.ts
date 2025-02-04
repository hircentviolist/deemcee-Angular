import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DPointService } from 'app/dpoints/dpoints.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PointValueComponent } from 'app/dpoints/modal/point-value/point-value.component';

@Component({
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
	isLoading: boolean = false;
	key: string;
	details: any;

	constructor(
		private route: ActivatedRoute,
		private location: Location,
		private dPointService: DPointService,
		private modalService: NgbModal,
	) {
		this.route.params.subscribe(params => {
			if (params.key) {
				this.key = params.key;
			}
		})
	}

	ngOnInit(): void {
		this.getAccumulationRecord();
	}

	getAccumulationRecord() {
		this.isLoading = true;

		this.dPointService.getAccumulations().subscribe(data => {
			this.details = Object.keys(data)
				.filter(key => key === this.key)
				.map(key => {
					return {
						key,
						subject: this.titleCase(key.split('_').join(' ')),
						points: data[key],
						section: 'DeLIVE'
					}
				})[0];
				
			this.isLoading = false;
			
			if (!this.details) {
				this.goBack();
				alert('Accumulation not found.');
			}
		})
	}
	
	edit() {
		const modalRef = this.modalService.open(PointValueComponent);

		modalRef.componentInstance.data = {
			key: this.details.key, 
			points: this.details.points
		}

		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.getAccumulationRecord();
			} else {
				alert(`Oops something wrong somewhere, unable to update ${this.details.subject} points value.`);
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	goBack() {
		this.location.back();
	}

	private titleCase(str: string): string {
		const splitStr = str.toLowerCase().split(' ');

		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
		}
		
		return splitStr.join(' '); 
	}
}
