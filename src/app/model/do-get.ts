export interface DoGet {
    'id': number;
    'number': string;
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
    'status': string;
    'pdf': string;
}
