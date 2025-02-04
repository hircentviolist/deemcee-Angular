import { Component, OnInit } from '@angular/core';
import { DPointService } from '../dpoints.service';

@Component({
	selector: 'app-parents-transaction',
	templateUrl: './parents-transaction.component.html',
	styleUrls: ['./parents-transaction.component.css']
})
export class ParentsTransactionComponent implements OnInit {
	parents: any;
	isLoading: boolean = false;

	constructor(
		private dPointService: DPointService,
	) { }

	ngOnInit(): void {
		this.getParentTransactions();
	}

	getParentTransactions(filter = null) {
		this.parents = [];
		this.isLoading = true;

		this.dPointService.getParentTransactions(filter).subscribe((data: any) => {
			this.parents = data;
			this.isLoading = false;
		})
	}
}
