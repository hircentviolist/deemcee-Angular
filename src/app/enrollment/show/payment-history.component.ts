import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../enrollment.service';
import { ActivatedRoute } from '@angular/router';
import { DefaultBranchService } from '../../default-branch.service';
import { Observable } from 'rxjs';
import { PaymentHistoryItem } from '../../model/payment-history-item';
import { StructureService } from 'app/structure/structure.service';
import { EditPaymentComponent } from '../modal/edit-payment/edit-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-payment-history',
	templateUrl: './payment-history.component.html',
	styleUrls: ['./payment-history.component.css'],
})
export class PaymentHistoryComponent implements OnInit {
	id: number;
	branch_id: number;
	payment$: Observable<PaymentHistoryItem[]>;
	studentName: string;
	studentGrade: string;
	classDetailsCount;

	constructor(
		private route: ActivatedRoute,
		private enrollmentService: EnrollmentService,
		private defaultBranchService: DefaultBranchService,
		private structureService: StructureService,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.id = +this.route.snapshot.params.id;
		this.defaultBranchService.defaultBranch$.subscribe((branch_id) => {
			if (branch_id) {
				this.branch_id = branch_id;
			}
		});
		this.getPaymentList();
		this.getStudentDetail();
	}

	getPaymentList() {
		this.payment$ = this.enrollmentService.getPaymentListByStudent(this.branch_id, this.id);
	}

	getStudentDetail() {
		this.enrollmentService.getById(this.id, this.branch_id).subscribe((enrolment) => {
			this.studentName = enrolment.name;
			// this.structureService.getAllGrades().subscribe((grades) => {
			// 	this.studentGrade = grades.find((grade) => {
			// 		return +grade.id === +enrolment.grade_id;
			// 	}).name;
			// });

			// this.classDetailsCount = {
			// 	remaining_class_count: enrolment.remaining_class_count,
			// 	total_attended_count: enrolment.total_attended_count,
			// 	total_rescheduled_count: enrolment.total_rescheduled_count,
			// 	total_absent_count: enrolment.total_absent_count,
			// 	total_class_count: enrolment.total_class_count,
			// 	freezed_class_count: enrolment.freezed_class_count,
			// };
		});
	}

	viewInvoice(path) {
		window.open(path, '_blank');
	}

	capitalise(string) {
		const splitStr = string.toLowerCase().split(' ');

		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
		}

		return splitStr.join(' ');
	}

	edit({ id, date }) {
		const modalRef = this.modalService.open(EditPaymentComponent);
		modalRef.componentInstance.data = { id, date };
		modalRef.result.then(() => {
			this.getPaymentList();
			this.getStudentDetail();
		});
	}
}
