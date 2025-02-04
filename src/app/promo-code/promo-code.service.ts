import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const PREFIX = 'promo_codes';

@Injectable({
    providedIn: 'root'
})
export class PromoCodeService {
    
    constructor(private http: HttpClient) { }
    
    getPromoCodeListAdmin() {
        const url = environment.backendApi + PREFIX
        return this.http.get(url);
    }

    getOnePromoCodeAdmin(promoCodeId: number) {
        const url = environment.backendApi + PREFIX + '/' + promoCodeId
        return this.http.get(url);
    }

    createPromoCode(body) {
        const url = environment.backendApi + PREFIX
        return this.http.post(url, body);
    }

    updatePromoCode(body, promoCodeId: number) {
        const url = environment.backendApi + PREFIX + '/' + promoCodeId
        return this.http.put(url, body);
    }

    deletePromoCode(promoCodeId: number) {
        const url = environment.backendApi + PREFIX + '/' + promoCodeId
        return this.http.delete(url);
    }

    getPromoCodeListBranch(branchId: number, isActive: boolean = false, type: 'enrolment' | 'merchandise' = null) {
        const active = isActive ? '/active' : '';
        const headers = (new HttpHeaders()).set('Branch-Id', String(branchId));
        const params = type ? {type} : {};
        const url = environment.backendApi + PREFIX + '/branch' + active
        
        return this.http.get(url, {headers, params});
    }
}