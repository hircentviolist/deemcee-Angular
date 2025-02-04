import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { OrderListItem } from './model/order-list-item';
import { OrderPostDto } from './model/order-post-dto';
import { OrderGetDto } from './model/order-get-dto';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  createSales(body: OrderPostDto) {
    const url = environment.backendApi + 'merchandise/orders';
    return this.http.post(url, body);
  }

  getAllSales(branch_id: number) {
    const url = environment.backendApi + 'merchandise/orders?branch_id=' + branch_id.toString();
    return this.http.get<OrderListItem[]>(url);
  }

  getOneSale(id: number) {
    const url = environment.backendApi + 'merchandise/orders/' + id.toString();
    return this.http.get<OrderGetDto>(url);
  }
}
