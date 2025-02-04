export interface InvoiceGet {
    'id': number;
    'number': string;
    'request_date': string;
    'branch': {
        'id': number;
        'name': string;
    },
    'creator': {
        'id': number;
        'first_name': string;
        'last_name': string;
        'full_name': string;
        'email': string;
    },
    'total': string;
    'status': string;
    'pdf': string;
}
