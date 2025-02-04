export interface OrderListItem {
    'id': number;
    'branch': {
        'id': number;
        'name': string;
    },
    'customer': {
        'id': number;
        'first_name': string;
        'last_name': string;
        'full_name': string;
        'email': string;
    },
    'invoice': {
        'branch_id': number;
        'created_at': string;
        'file_path': string;
        'id': number;
        'invoice_sequence_id': number;
        'sequence': {
            id: number;
            branch_id: number;
            number: string;
        }
        'updated_at': string;
    }
    'user': {
        'id': number;
        'first_name': string;
        'last_name': string;
        'full_name': string;
    },
    total: string;
    'request_date': string;
    'status': string;
    'customer_notes': string;
    'staff_notes': string;
}
