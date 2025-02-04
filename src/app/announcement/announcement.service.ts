import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AnnouncementDto} from '../model/announcement-dto';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(private http: HttpClient) {}

  getAllAnnouncement() {
    const url = environment.backendApi + 'announcements/admin';
    return this.http.get<AnnouncementDto[]>(url);
  }

  createAnnouncement(body) {
    const url = environment.backendApi + 'announcements';
    return this.http.post(url, body);
  }

  updateAnnouncement(body) {
    const url = environment.backendApi + 'announcements';
    return this.http.put(url, body);
  }

  getBranchAnnouncements(branchId: number) {
    const headers = new HttpHeaders({'Branch-Id': branchId.toString()});
    const url = environment.backendApi + 'announcements/branch';
    return this.http.get<AnnouncementDto[]>(url, {headers});
  }
}
