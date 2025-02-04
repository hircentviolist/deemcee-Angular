import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'environments/environment';
import { EnrollmentListItem } from './model/enrollment-list-item';
import {EnrollmentListPayment, EnrollmentListPaymentDto} from './model/enrollment-list-payment';
import {PastEnrolmentListItem} from './model/past-enrolment-list-item';
import {PaymentHistoryItem} from './model/payment-history-item';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  getAll() {
    const url = environment.backendApi + 'students';
    return this.http.get<EnrollmentListItem[]>(url);
  }

  getListPayment(branch_id: number, filter: any) {
    console.log('getListPayment: ', filter);
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/list';
    if (filter) {
      let params = new HttpParams();

      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          params = params.set(key, String(filter[key]));
        }
      });

      return this.http.get<EnrollmentListPaymentDto>(url, {headers, params});
    } else {
      return this.http.get<EnrollmentListPaymentDto>(url, {headers});
    }
  }

  getInactiveEnrolments(branch_id: number, filter: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/inactive';
    if (filter) {
      let params = new HttpParams();

      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          params = params.set(key, String(filter[key]));
        }
      });

      return this.http.get<EnrollmentListPaymentDto>(url, {headers, params});
    } else {
      return this.http.get<EnrollmentListPaymentDto>(url, {headers});
    }
  }

  getFreezedEnrolments(branch_id: number, filter: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/freezed';
    if (filter) {
      let params = new HttpParams();

      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          params = params.set(key, String(filter[key]));
        }
      });

      return this.http.get<EnrollmentListPaymentDto>(url, {headers, params});
    } else {
      return this.http.get<EnrollmentListPaymentDto>(url, {headers});
    }
  }

  getById(id: number, branch_id: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + id.toString();
    return this.http.get<EnrollmentListItem>(url, {headers});
  }

  getPastEnrolmentById(id: number, branch_id: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + id.toString() + '/past_enrolments';
    return this.http.get<PastEnrolmentListItem[]>(url, {headers});
  }

  create(body, branch_id: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students';
    return this.http.post(url, body, {headers});
  }

  pay(id: number, body) {
    const url = environment.backendApi + 'payments/' + id.toString();
    return this.http.put(url, body);
  }

  editPayment(id: number, body) {
    const url = environment.backendApi + 'payments/' + id.toString() + '/date';
    return this.http.put(url, body);
  }

  reschedule(enrolmentId, body) {
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/schedule';
    return this.http.put(url, body)
  }

  advance(enrolmentId, body) {
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/advance';
    return this.http.post(url, body)
  }

  extend(enrolmentId, body) {
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/extend';
    return this.http.post(url, body)
  }

  extendUpdate(enrolmentId, body) {
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/extend/update';
    return this.http.put(url, body)
  }

  freeze(enrolmentId, body) {
    console.log('freeze');
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/freeze';
    return this.http.post(url, body)
  }

  unFreeze(enrolmentId, body, branchId) {
    const headers = (new HttpHeaders()).set('Branch-Id', String(branchId));
    const url = environment.backendApi + 'enrolments/' + enrolmentId.toString() + '/unfreeze';
    return this.http.post(url, body, {headers})
  }

  changeClass(enrolmentId, body, branchId) {
    const headers = (new HttpHeaders()).set('Branch-Id', String(branchId));
    const url = environment.backendApi + `enrolments/${enrolmentId}/change_class`;

    return this.http.post<any[]>(url, body, {headers});
  }

  graduate(studentId) {
    console.log('graduate');
    const url = environment.backendApi + 'students/' + studentId.toString() + '/graduate';
    return this.http.put(url, null)
  }

  dropout(studentId) {
    console.log('dropout');
    const url = environment.backendApi + 'students/' + studentId.toString() + '/dropout';
    return this.http.put(url, null)
  }

  transferOut(studentId, body) {
    const url = environment.backendApi + 'students/' + studentId.toString() + '/transfer_out';
    return this.http.post(url, body)
  }

  getTransferInList(branch_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/transfer_in';
    return this.http.get<any[]>(url, {headers});
  }

  transferIn(branch_id, student_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + student_id + '/transfer_in';
    return this.http.post<any[]>(url, body, {headers});
  };

  submitVideoAssignment(branch_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'video-assignment';
    return this.http.post<any>(url, body, {headers});
  }

  updateVideoAssignment(branch_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'video-assignment';
    return this.http.put<any>(url, body, {headers});
  }

  getVideoAssignment(branch_id, video_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'video-assignment/' + video_id;
    return this.http.get<any>(url, {headers});
  }

  deleteVideoAssignment(branch_id, video_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'video-assignment/' + video_id;
    return this.http.delete<any>(url, {headers});
  }

  delete(branch_id, student_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + student_id;
    return this.http.delete<any>(url, {headers});
  }

  getReferralChannelList() {
    const url = environment.backendApi + 'enrolments/referral/channels';
    return this.http.get<any>(url);
  }

  updateStudentInfo(branch_id, student_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + student_id;
    return this.http.put<any>(url, body, {headers});
  }

  updateStudentNotes(student_id, body) {
    const url = environment.backendApi + 'students/' + student_id + '/update_remark';
    return this.http.put<any>(url, body);
  }

  updateEnrolment(branch_id, enrolment_id, body) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'enrolments/' + enrolment_id;
    return this.http.put<any>(url, body, {headers});
  }

  getOneEnrolmentById(id: number, branch_id: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'enrolments/' + id.toString();
    return this.http.get<PastEnrolmentListItem[]>(url, {headers});
  }

  getPaymentListByStudent(branch_id, student_id) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/' + student_id + '/payments';
    return this.http.get<PaymentHistoryItem[]>(url, {headers});
  }

  getAvailableStarterKits(branch_id: number) {
    const url = environment.backendApi + 'merchandise/merchandise/available-product?branch_id=' + branch_id.toString();
    return this.http.get<any[]>(url);
  }

  exportStudents(branch_id: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Branch-Id', String(branch_id));
    const url = environment.backendApi + 'students/export';
    return this.http.get<any>(url, {headers});
  }
}
