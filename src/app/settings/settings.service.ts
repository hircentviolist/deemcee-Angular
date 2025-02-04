import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

interface ChangePassword {
    current_password: string,
    password: string,
    password_confirmation: string
}

@Injectable({
    providedIn: 'root'
})    
export class SettingService {
    constructor(private http: HttpClient) { }

    changPassword(body: ChangePassword) {
        const url = environment.backendApi + 'password/change';
        return this.http.post(url, body);
    }
}