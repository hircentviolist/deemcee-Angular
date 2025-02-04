export interface OrderPostDto {
    'branch_id': number;
    'customer_id': number;
    'promo_code': string;
    'items': Item[];
}

interface Item {
    product_id: number;
    quantity: number;
}
