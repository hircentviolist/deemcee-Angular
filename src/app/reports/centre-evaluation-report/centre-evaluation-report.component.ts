import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultBranchService } from 'app/default-branch.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { Credentials } from 'app/model/credentials';
import { DataForSelect } from 'app/model/data-for-select';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { NewEvaluationComponent } from '../modal/new-evaluation/new-evaluation.component';
import { ReportsService } from '../reports.service';

@Component({
	selector: 'app-centre-evaluation-report',
	templateUrl: './centre-evaluation-report.component.html',
	styleUrls: ['./centre-evaluation-report.component.css']
})
export class CentreEvaluationReportComponent implements OnInit {
	@Input() cred: Credentials;
	isLoading: boolean = false;
	evaluations: any;

	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;
	branch_id: number;

  	constructor(
		private licenseeService: LicenseeService,
		private reportsService: ReportsService,
		private modalService: NgbModal,
		private defaultBranchService: DefaultBranchService,
  	) {	}

	ngOnInit(): void {
		this.isLoading = true;
		this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
		this.defaultBranch$$ =
		this.defaultBranchService.defaultBranch$.subscribe(branch_id => {
			if (branch_id) {
				this.branch_id = branch_id;
			}
			
			this.getReport();
		});
	}

	getReport() {
		this.isLoading = true;
		this.evaluations = [];

		const isAdmin = this.cred.role === 'superadmin' || this.cred.role === 'admin';
		const branchId = !isAdmin ? this.branch_id : null;

		this.reportsService.getCentreEvaluationReport(branchId).subscribe(res => {
			this.evaluations = this.formatData(res);
			this.isLoading = false;
		}, err => {
			console.log(err)
		})
	}
	
	formatData(data) {
		data.forEach(d => {
			d.graded_on = moment(d.created_at).format('ddd, DD MMM YYYY, hh:mm A');
		})

		return data;
	}

	createEvaluation() {
		const modalRef = this.modalService.open(NewEvaluationComponent);

		modalRef.result.then((res) => {
			if (res === 'success') {
				this.getReport();
			} else {
				alert(res)
			}
		}, err => {
			console.log(err)
		})
	}
	
	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
