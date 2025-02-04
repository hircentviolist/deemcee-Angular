export interface StockRequestUpdate {
    'branch_id': number;
    'billing_address_id': number;
    'shipping_address_id': number;
    'request_date': string;
    'customer_notes': string;
    'staff_notes': string;
    'status'?: string;
    'items': Item[];
}

interface Item {
    product_id: number;
    quantity: number;
}

