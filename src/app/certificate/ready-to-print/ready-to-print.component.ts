import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../certificate.service';
import { DefaultBranchService } from 'app/default-branch.service';
import { Observable, Subscription } from 'rxjs';
import { DataForSelect } from 'app/model/data-for-select';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-ready-to-print',
	templateUrl: './ready-to-print.component.html',
	styleUrls: ['./ready-to-print.component.css']
})
export class ReadyToPrintComponent implements OnInit {
	branch_id: number;
	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;
	certificates: any;

	page: number = 1;
	perPage: number = 20;
	pages = [];

	isLoading: boolean = true;

	constructor(
		private certificateService: CertificateService,
		private defaultBranchService: DefaultBranchService,
	) { }

	ngOnInit(): void {
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$
			.subscribe(branch_id => {
				if (branch_id) {
					this.branch_id = branch_id;
					this.page = 1;
					this.pages = [];
					this.getReadyToPrintCertificates();
				}
			});
	}

	getReadyToPrintCertificates() {
		this.isLoading = true;
		this.certificates = null;
		const params = {
			branch_id: this.branch_id,
			page: this.page,
			per_page: this.perPage,
		}
		this.certificateService.getReadyToPrintCertificates(params).subscribe((res: any) => {
			this.certificates = this.formatData(res);
			this.initPagination(this.certificates);
			this.isLoading = false;
		}, err => {
			console.log(err);
			alert(err.error.message);
		})
	}

	formatData(response) {
		response.data = response.data.map((cert: any, i) => {
			const { current_page, per_page } = response;
			cert.number = (i + 1) + ((current_page - 1 ) * per_page);
			cert.display_status = cert.status.split('_').join(' ');
			if (cert.student) {
        cert.student.full_name = (cert.student?.first_name ? cert.student?.first_name : '') + (cert.student?.last_name ? ' ' + cert.student?.last_name : '');
      }
			return cert;
		});
		return response;
	}

	initPagination(response) {
		this.page = +response.current_page;
		this.pages = [];

		if (response.data.length) {
			for (let i = 0; i < response.last_page; i++) {
				this.pages.push({
					number: i + 1,
					is_active: this.page === (i + 1)
				});
			}
		}
	}

	paginationClicked(page) {
		const currentPage = this.pages.find(p => p.is_active);
		let toPage = null;

		if (page === 'next') {
			toPage = +currentPage.number + 1;

			if (toPage > this.pages.length) {
				return;
			}

			this.pages.forEach(p => p.is_active = false);
			this.pages.find(p => {
				p.is_active = +p.number === +toPage
				return p.is_active;
			})
		} else if (page === 'prev') {
			toPage = +currentPage.number - 1;

			if (toPage <= 0) {
				return;
			}

			this.pages.forEach(p => p.is_active = false);
			this.pages.find(p => {
				p.is_active = +p.number === +toPage
				return p.is_active;
			})
		} else {
			this.pages.forEach(p => p.is_active = false);
			page.is_active = true;
			toPage = page.number;
		}

		if (toPage) {
			this.page = +toPage;
			this.getReadyToPrintCertificates();
		}
	}

	print(cert) {
		Swal.fire({
			icon: 'question',
			title: 'Certificate for ' + cert.student?.full_name,
			text: 'Are you sure you want to print this certificate?',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: 'white',
			cancelButtonText: '<span style="color:grey">Cancel<span>',
			confirmButtonText: 'Yes',
		}).then(result => {
			if (result.value) {
				this.certificateService.printCertificate({branch_id: this.branch_id, cert_id: cert.id}).subscribe(() => {
					window.open(cert.file_path, '_blank');
					this.getReadyToPrintCertificates();
				});
			}
		});
	}

	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
