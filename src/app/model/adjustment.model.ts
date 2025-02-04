export interface Adjustment {
    'type': 'Remove' | 'Add',
    'items': Item[]
}

interface Item {
    'product_id': number;
    'quantity': number;
    'reason_id': number;
    'reason_text'?: string;
}
