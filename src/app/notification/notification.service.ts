import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';
import {NotificationDto, NotificationListDto} from '../model/notification-dto';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotificationTypes() {
    const url = environment.backendApi + 'notifications/types';
    return this.http.get<DataForSelect[]>(url);
  }

  getAllNotifications(per_page, page_no) {
    const params = new HttpParams()
      .set('per_page', String(per_page))
      .set('page', String(page_no));
    const url = environment.backendApi + 'notifications';
    return this.http.get<NotificationListDto>(url, {params});
  }

  createNotification(body) {
    const url = environment.backendApi + 'notifications';
    return this.http.post(url, body);
  }

  updateNotification(body) {
    const url = environment.backendApi + 'notifications';
    return this.http.put(url, body);
  }

  branchGetNotification(branch_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'notifications/branch/' + branch_id;
    return this.http.get<NotificationDto[]>(url, {headers});
  }

  branchPutNotification(branch_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'notifications/branch/' + branch_id;
    return this.http.put<NotificationDto>(url, body, {headers});
  }

}
