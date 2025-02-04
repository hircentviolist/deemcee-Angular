export interface StockRequestPost {
    'branch_id': number;
    'delivery_type': 'Self Pickup';
    'delivery_address': string;
    'customer_notes': string;
    'staff_notes': string;
    'items': Item[];
}

interface Item {
    product_id: number;
    no_of_sets: number;
}
