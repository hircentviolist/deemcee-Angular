import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DPointService {
    branch$: Observable<DataForSelect[]>;
  
    constructor(private http: HttpClient) {}

    getAccumulations() {
        const url = environment.backendApi + 'dpoint/accumulations'
        return this.http.get(url);
    }

    updateAccumulation(body) {
        const url = environment.backendApi + 'dpoint/accumulations'
        return this.http.put(url, body);
    }

    getRedemptions() {
        const url = environment.backendApi + 'dpoint/vouchers'
        return this.http.get(url);
    }
    
    createRedemptions(body) {
        const url = environment.backendApi + 'dpoint/vouchers'
        return this.http.post(url, body);
    }
    
    updateRedemptions(body) {
        const url = environment.backendApi + 'dpoint/vouchers'
        return this.http.put(url, body);
    }

    getCampaigns(id: number = null) {
        const campaignId = id ? `/${id}` : '';
        const url = environment.backendApi + 'dpoint/campaign' + campaignId
        return this.http.get(url);
    }

    createCampaign(body) {
        const url = environment.backendApi + 'dpoint/campaign'
        return this.http.post(url, body);
    }

    updateCampaign(body, id) {
        const url = environment.backendApi + 'dpoint/campaign/' + id.toString();
        return this.http.put(url, body);
    }

    getTransactions(body) {
        const url = environment.backendApi + 'dpoint/branch/transactions'
        return this.http.post(url, body);
    }

    getBranchPoint(branch_id: number) {
        const url = environment.backendApi + 'dpoint/branch/transactions/' + branch_id;
        return this.http.get(url);
    }

    getPointList() {
        const url = environment.backendApi + 'dpoint/branch/price';
        return this.http.get(url);
    }

    purchasePoint(body) {
        const url = environment.backendApi + 'dpoint/branch/purchase';
        return this.http.post(url, body);
    }

    getPurchasedPoint(branchId: number) {
        const headers = new HttpHeaders({'Branch-Id': branchId.toString()});
        const url = environment.backendApi + 'dpoint/branch/purchase';
        return this.http.get(url, {headers: headers});
    }

    rewardParent(body, branchId: number) {
        const headers = new HttpHeaders({'Branch-Id': branchId.toString()});
        const url = environment.backendApi + 'dpoint/branch/reward-parent';
        return this.http.post(url, body, {headers: headers});
    }

    getParentTransactions(body = null) {
        const url = environment.backendApi + 'dpoint/parent/transactions';
        return this.http.post(url, body);
    }

    getParentTransactionHistory(parent_id: number) {
        const url = environment.backendApi + 'dpoint/parent/transactions/' + parent_id;
        return this.http.get(url);
    }

    getPointBalance(parent_id: number) {
        const url = environment.backendApi + 'dpoint/parent/balance/' + parent_id;
        return this.http.get(url);
    }

    titleCase(str: string): string {
		const splitStr = str.toLowerCase().split(' ');

		for (let i = 0; i < splitStr.length; i++) {
			splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
		}
		
		return splitStr.join(' '); 
	}
}