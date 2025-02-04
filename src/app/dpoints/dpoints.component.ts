import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/auth.service';
import { Credentials } from 'app/model/credentials';
import { TitleService } from 'app/shared/title.service';
import { take } from 'rxjs/operators';
import { DPointService } from './dpoints.service';
import { PointValueComponent } from './modal/point-value/point-value.component';

@Component({
	selector: 'app-dpoints',
	templateUrl: './dpoints.component.html',
	styleUrls: ['./dpoints.component.css']
})
export class DPointsComponent implements OnInit {
	cred: Credentials;
	active = 1;
	accumulations: {no: number, key: string, subject: string, points: number, section: string} [] = [];

	pointToRM: number = 0;
	pointLabel: string = '';

	constructor(
		private titleService: TitleService,
		private route: ActivatedRoute,
		private router: Router,
		private dPointService: DPointService,
		private modalService: NgbModal,
		private authService: AuthService
	) {
		this.titleService.postTitle('D-Points');
		this.authService.credential$.pipe(take(1)).subscribe(c => this.cred = c);

		if (this.cred.role !== 'superadmin' && this.cred.role !== 'admin') {
			this.active = 2;
		} else {
			this.route.queryParams.subscribe(params => {
				if (params.active) {
					this.active = isNaN(params.active) ? 1 : Number(params.active);
					this.onChangeTab();
				}
			})
		}
	}

	ngOnInit(): void {
		this.getPointValue();
	}

	onChangeTab() {
		this.router.navigate([], {
			queryParams: {
			  	active: this.active
			},
			queryParamsHandling: 'merge',
		});
	}

	getPointValue() {
		this.dPointService.getAccumulations().subscribe((data: any) => {
			this.updatePoint(data.point_to_RM);
		})
	}

	updatePointValue() {
		const modalRef = this.modalService.open(PointValueComponent);

		modalRef.componentInstance.data = {
			key: 'point_to_RM', 
			points: this.pointToRM,
		};
		modalRef.result.then(result => {
			if (result.isSuccess) {
				this.updatePoint(result.pointToRM);
			} else {
				alert('Oops something wrong somewhere, unable to update D-Point Value.');
			}
		}, err => {
			console.log('err: ', err)
		})
	}

	updatePoint(point: number) {
		this.pointToRM = point;
		this.pointLabel = `RM 1 = ${point} D-Point`;
	}
}
