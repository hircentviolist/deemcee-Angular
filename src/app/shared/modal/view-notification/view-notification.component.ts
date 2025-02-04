import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-view-notification',
	templateUrl: './view-notification.component.html',
	styleUrls: ['./view-notification.component.css']
})
export class ViewNotificationComponent implements OnInit {
	@Input() data;

	constructor(
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		console.log(this.data)
	}

}
