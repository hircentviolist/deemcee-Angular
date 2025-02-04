import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefaultBranchService } from '../../default-branch.service';
import { EnrollmentService } from '../../enrollment.service';
import { shareReplay, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EnrollmentListItem } from '../../model/enrollment-list-item';
import { PastEnrolmentListItem } from '../../model/past-enrolment-list-item';
import * as moment from 'moment';
import { StructureService } from 'app/structure/structure.service';
import { AuthService } from 'app/auth/auth.service';
import { VideoAssignmentComponent } from '../modal/video-assignment/video-assignment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-past-enrollment',
	templateUrl: './past-enrollment.component.html',
	styleUrls: ['./past-enrollment.component.css'],
})
export class PastEnrollmentComponent implements OnInit {
	id: number;
	branch_id: number;
	pastEnrollment$: Observable<PastEnrolmentListItem[]>;
	studentName: string;
	studentGrade: string;
	role: string;
	classDetailsCount;

	constructor(
		private route: ActivatedRoute,
		private defaultBranchService: DefaultBranchService,
		private enrollmentService: EnrollmentService,
		private structureService: StructureService,
		private authService: AuthService,
		private router: Router,
		private modalService: NgbModal
	) {
		this.authService.credential$.pipe(take(1)).subscribe((auth) => {
			this.role = auth.role;
		});
	}

	ngOnInit(): void {
		this.id = +this.route.snapshot.params.id;
		this.defaultBranchService.defaultBranch$.subscribe((branch_id) => {
			if (branch_id) {
				this.branch_id = branch_id;
			}
		});
		if (this.id) {
			this.pastEnrollment$ = this.enrollmentService
				.getPastEnrolmentById(this.id, this.branch_id)
				.pipe(shareReplay());
		}
		this.pastEnrollment$.subscribe((enrolments) => {
			enrolments.map((enrolment) => {
				if (enrolment.payment.updated_at) {
					enrolment.payment.updated_at = moment(enrolment.payment.updated_at).format('YYYY-MM-DD');
				}
				enrolment.video_array.forEach((video, i) => {
					video.label = video.submission_date
						? `Video ${video.video_number}`
						: `V${video.video_number} (${video.submit_before})`;
				});
			});
		});
		this.getStudentDetail();
	}

	getStudentDetail() {
		// this.enrollmentService.getById(this.id, this.branch_id).subscribe(enrolment => {
		//   this.studentName = enrolment.name;
		//   this.structureService.getAllGrades().subscribe(grades => {
		//     this.studentGrade = grades.find(grade => {
		//       return +grade.id === +enrolment.grade_id;
		//     }).name;
		//   });
		//   this.classDetailsCount = {
		//     remaining_class_count: enrolment.remaining_class_count,
		//     total_attended_count: enrolment.total_attended_count,
		//     total_rescheduled_count: enrolment.total_rescheduled_count,
		//     total_absent_count: enrolment.total_absent_count,
		//     total_class_count: enrolment.total_class_count,
		//     freezed_class_count: enrolment.freezed_class_count,
		//   }
		// });
	}

	onVideoClicked(enr, video) {
		if (video.submission_date) {
			this.router.navigate(['../../video/' + video.id], { relativeTo: this.route });
		} else {
			const data = {
				...video,
				student_id: enr.student.id,
				student_name: enr.student.first_name,
				category_id: enr.grade.category_id,
			};
			console.log(data);
			const modalRef = this.modalService.open(VideoAssignmentComponent);
			modalRef.componentInstance.data = data;

			modalRef.result.then(
				(resp) => {
					this.enrollmentService.updateVideoAssignment(this.branch_id, resp).subscribe((res) => {
						this.ngOnInit();
					});
				},
				(err) => {}
			);
		}
	}
}
