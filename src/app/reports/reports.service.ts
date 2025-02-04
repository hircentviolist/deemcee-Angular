import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ReportsService {
    branch$: Observable<DataForSelect[]>;

    constructor(private http: HttpClient) { }

    getLicenseeReport(body) {
        const url = environment.backendApi + 'reports/overall'
        return this.http.post(url, body);
    }

    getOneLicenseeReport(body) {
        const url = environment.backendApi + 'reports';
        return this.http.post(url, body);
    }

    generateInvoice(body) {
        const url = environment.backendApi + 'reports/invoice';
        return this.http.post(url, body);
    }

    getMonthlyProgressionReportTotal(body) {
        const url = environment.backendApi + 'reports/progression/total';
        return this.http.post(url, body);
    }

    getMonthlyProgressionReport(body) {
        const url = environment.backendApi + 'reports/progression';
        return this.http.post(url, body);
    }

    getReferralReport(body) {
        const url = environment.backendApi + 'reports/referral';
        return this.http.post(url, body);
    }

    getReferralChannels() {
        const url = environment.backendApi + 'enrolments/referral/channels';
        return this.http.get(url);
    }

    getCentreEvaluationReport(branch_id = null) {
        const branchId = branch_id ? `/${branch_id}` : '';
        const url = environment.backendApi + 'reports/evaluation' + branchId;
        return this.http.get(url);
    }

    createCentreEvaluationReport(form) {
        const body = {
            year: form.year,
            month: form.month,
            rating: form.rating,
            file_path: form.file_path
        };

        const url = environment.backendApi + 'reports/evaluation/' + form.branch_id;
        return this.http.post(url, body);
    }

    uploadFile(body) {
        const url = environment.backendApi + 'uploads';
        return this.http.post(url, body);
    }

    getFinanceReport(body) {
        const url = environment.backendApi + 'reports/finance';
        return this.http.post(url, body);
    }
}
