import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MerchandiseUpdate } from 'app/model/merchandise-update';
import { MerchandisePost } from 'app/model/merchandise-post';
import { environment } from 'environments/environment';
import { MerchandiseListItem } from 'app/model/merchandise-list-item';
import { MerchandiseGet } from 'app/model/merchandise-get';
import { StockRequestPost } from 'app/model/stock-request-post';
import { StockRequestListItem } from 'app/model/stock-request-list-item';
import { StockRequestGet } from 'app/model/stock-request-get';
import { StockRequestUpdate } from 'app/model/stock-request-update';
import { StockRequestPatchStatus } from 'app/model/stock-request-patch-status';
import { ImageUploadResponse } from 'app/model/image-upload-response';
import { OrderPostDto } from 'app/model/order-post-dto';
import { OrderListItem } from 'app/model/order-list-item';
import { OrderGetDto } from 'app/model/order-get-dto';
import { InventoryGetDto } from 'app/model/inventory-get-dto';
import { DataForSelect } from 'app/model/data-for-select';
import { Adjustment } from 'app/model/adjustment.model';
import { Movement } from 'app/model/movement';
import { InvoiceGet } from 'app/model/invoice-get';
import { DoGet } from 'app/model/do-get';

@Injectable({
	providedIn: 'root',
})
export class MerchandiseService {
	constructor(private http: HttpClient) {}

	getAllProducts(branch_id: number, page: number, per_page: number) {
		const params = new HttpParams()
			.append('branch_id', branch_id?.toString())
			.append('page', page.toString())
			.append('per_page', per_page.toString());

		const url = environment.backendApi + 'merchandise/merchandise';
		return this.http.get<MerchandiseListItem[]>(url, { params });
	}

	getOneProduct(id: number, branch_id: number) {
		const url = environment.backendApi + 'merchandise/merchandise/' + id.toString() + '?branch_id=' + branch_id;
		return this.http.get<MerchandiseListItem>(url);
	}

	updateProduct(id: Number, branch_id: number, product: MerchandiseUpdate) {
		const url = environment.backendApi + 'merchandise/merchandise/' + id.toString() + '?branch_id=' + branch_id;
		return this.http.put(url, product);
	}

	addProduct(product: MerchandisePost) {
		const url = environment.backendApi + 'merchandise/merchandise';
		return this.http.post<MerchandisePost>(url, product);
	}

	deleteProduct(id: number) {
		const url = environment.backendApi + 'merchandise/merchandise/' + id.toString();
		return this.http.delete<MerchandiseGet>(url);
	}

	// Order
	getAllOrders(branch_id: number, page: number, per_page: number, sort_date: string = 'desc') {
		const params = new HttpParams()
			.append('branch_id', branch_id?.toString())
			.append('page', page.toString())
			.append('per_page', per_page.toString())
			.append('sort_date', sort_date);

		const url = environment.backendApi + 'merchandise/stock_requests';
		return this.http.get<StockRequestListItem[]>(url, { params });
	}

	getOneOrder(id: number) {
		const url = environment.backendApi + 'merchandise/stock_requests/' + id.toString();
		return this.http.get<StockRequestGet>(url);
	}

	updateOrder(id: Number, order: StockRequestUpdate) {
		const url = environment.backendApi + 'merchandise/stock_requests/' + id.toString();
		return this.http.put(url, order);
	}

	addOrder(order: StockRequestPost) {
		console.log('addOrder');
		const url = environment.backendApi + 'merchandise/stock_requests';
		return this.http.post(url, order);
	}

	updateOrderStatus(id: number, body: StockRequestPatchStatus) {
		const url = environment.backendApi + 'merchandise/stock_requests/' + id.toString() + '/status';
		return this.http.patch(url, body);
	}

	getInventoryByProductId(id: number) {
		const url = environment.backendApi + 'merchandise/merchandise/' + id.toString() + '/inventory';
		return this.http.get<InventoryGetDto[]>(url);
	}

	uploadProductImage(filename: string, file: File) {
		const url = environment.backendApi + 'media';
		const upload = new FormData();
		upload.append('image', file, filename);
		return this.http.post<ImageUploadResponse>(url, upload);
	}

	createSales(body: OrderPostDto) {
		const url = environment.backendApi + 'merchandise/orders';
		return this.http.post(url, body);
	}

	getAllSales() {
		const url = environment.backendApi + 'merchandise/orders';
		return this.http.get<OrderListItem[]>(url);
	}

	getOneSale(id: number) {
		const url = environment.backendApi + 'merchandise/orders/' + id.toString();
		return this.http.get<OrderGetDto>(url);
	}

	getInventory(branch_id: number) {
		const url = environment.backendApi + 'merchandise/inventory/?branch_id=' + branch_id.toString();
		return this.http.get<InventoryGetDto>(url);
	}

	listReasons() {
		const url = environment.backendApi + 'merchandise/merchandise/stock_adjustment/reasons';
		return this.http.get<DataForSelect[]>(url);
	}

	adjustStock(branch_id: number, adjustment: Adjustment) {
		const url =
			environment.backendApi + 'merchandise/merchandise/stock_adjustment?branch_id=' + branch_id.toString();
		return this.http.post(url, adjustment);
	}

	stockMovement(branch_id: number, product_id: number) {
		const url = environment.backendApi + `merchandise/merchandise/${product_id}/movements?branch_id=${branch_id}`;
		return this.http.get<Movement>(url);
	}

	getAllInvoice(
		branch_id: number,
		page: number,
		per_page: number,
		filters: { sort_date: string; year: number; month: number }
	) {
		let params = new HttpParams()
			.append('branch_id', branch_id?.toString())
			.append('page', page.toString())
			.append('per_page', per_page.toString());

		Object.keys(filters).forEach((key) => {
			params = params.append(key, filters[key].toString());
		});

		const url = environment.backendApi + 'merchandise/invoices';
		return this.http.get<InvoiceGet[]>(url, { params });
	}

	updateInvoice(id: number, status: { status: string }) {
		const url = environment.backendApi + 'merchandise/invoices/' + id.toString() + '/status';
		return this.http.patch(url, status);
	}

	getAllDo(branch_id: number, page: number, per_page: number) {
		const params = new HttpParams()
			.append('branch_id', branch_id?.toString())
			.append('page', page.toString())
			.append('per_page', per_page.toString());

		const url = environment.backendApi + 'merchandise/delivery_orders';
		return this.http.get<DoGet[]>(url, { params });
	}

	updateDo(id: number, status: { status: string }) {
		const url = environment.backendApi + 'merchandise/delivery_orders/' + id.toString() + '/status';
		return this.http.patch(url, status);
	}
}
