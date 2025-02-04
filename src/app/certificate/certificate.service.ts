import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface Params {
    branch_id: number,
    page: number,
    per_page: number
}
@Injectable({
    providedIn: 'root'
})

export class CertificateService {
    constructor(private http: HttpClient) {}

    getReadyToPrintCertificates({branch_id, page, per_page}: Params) {
        const headers = (new HttpHeaders()).set('Branch-Id', branch_id.toString());
        const params = (new HttpParams()).append('page', page.toString())
            .append('per_page', per_page.toString());

        const url = environment.backendApi + 'certificates/ready_to_print';
        return this.http.get(url, {headers, params});
    }

    getPrintedCertificates({branch_id, page, per_page}: Params) {
        const headers = (new HttpHeaders()).set('Branch-Id', branch_id.toString());
        const params = (new HttpParams()).append('page', page.toString())
            .append('per_page', per_page.toString());

        const url = environment.backendApi + 'certificates/printed';
        return this.http.get(url, {headers, params});
    }

    printCertificate({branch_id, cert_id}) {
        const headers = (new HttpHeaders()).set('Branch-Id', branch_id.toString());
        const url = environment.backendApi + `certificates/${cert_id}/printed`;
        return this.http.put(url, {headers});
    }
}