export interface MerchandiseGet {
    'id': number;
    'name': string;
    'description': string;
    'price': string;
    'd_point': number;
    'minimum_order': number;
    'image_url': string;
    'inventory': {
        'id': number;
        'branch': {
            'id': number;
            'name': string;
        };
        'quantity': number;
    }
}
