import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import { StructureService } from 'app/structure/structure.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RescheduleComponent } from '../modal/reschedule/reschedule.component';
import { ActivatedRoute } from '@angular/router';
import { ClassLessonDto } from '../../model/class-lesson-dto';
import { shareReplay, take } from 'rxjs/operators';
import { EnrollmentService } from '../../enrollment.service';
import { DefaultBranchService } from '../../default-branch.service';
import { ClassDetailsComponent } from './class-details.component';
import { AuthService } from 'app/auth/auth.service';

@Component({
	providers: [ClassDetailsComponent],
	selector: 'app-show',
	templateUrl: './show.component.html',
	styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
	id: number;
	branch$: Observable<DataForSelect[]>;
	enrollment$: Observable<any>;
	showTransfer = false;
	enrolment: any;
	branch_id: number;
	role: string;
	classDetailsCount: any;
	studentName: string;
	studentGrade: string;
	defaultBranch$$: Subscription;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
		private enrollmentService: EnrollmentService,
		private licenseeService: LicenseeService,
		private defaultBranchService: DefaultBranchService,
		private modalService: NgbModal,
		private classDetailsComp: ClassDetailsComponent,
		private structureService: StructureService
	) {
		this.authService.credential$.pipe(take(1)).subscribe((auth) => {
			this.role = auth.role;
		});
	}

	ngOnInit(): void {
		this.id = +this.route.snapshot.params.id;
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$.subscribe((branch_id) => {
			if (branch_id) {
				this.branch_id = branch_id;
				if (this.id) {
					this.enrollmentService
						.getById(this.id, this.branch_id)
						// .pipe(shareReplay())
						.subscribe((enrolment) => {
							this.enrolment = enrolment;

							this.studentName = enrolment.name;
							this.structureService.getAllGrades().subscribe((grades) => {
								this.studentGrade = grades.find((grade) => {
									return +grade.id === +enrolment.grade_id;
								}).name;
							});

							this.classDetailsCount = {
								remaining_class_count: enrolment.remaining_class_count,
								total_attended_count: enrolment.total_attended_count,
								total_rescheduled_count: enrolment.total_rescheduled_count,
								total_absent_count: enrolment.total_absent_count,
								total_class_count: enrolment.total_class_count,
								freezed_class_count: enrolment.freezed_class_count,
							};
						});
				}
			}
		});
	}

	onTransfer() {
		this.showTransfer = !this.showTransfer;
	}

	reschedule() {
		console.log('reschedule: ', this.enrolment.class_lesson);
		if (this.enrolment.class_lesson && this.enrolment.class_lesson.length) {
			const modalRef = this.modalService.open(RescheduleComponent);
			const enrolment = this.enrolment;
			modalRef.componentInstance.data = { enrolment };
			modalRef.result.then(
				(res) => {
					this.enrollmentService.reschedule(enrolment.enrolment.id, res).subscribe(
						(resp) => {
							console.log('reschedule: ', resp);
							this.classDetailsComp.callNgOnInit();
							window.location.reload();
						},
						(err) => {
							console.log('err: ', err);
							alert(err.error.message);
						}
					);
				},
				(err) => {}
			);
		}
	}

	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
