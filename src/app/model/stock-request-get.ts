export interface StockRequestGet {
  'id': number;
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
  'delivery_type': 'Self Pickup',
  'delivery_address': string;
  'delivery_fee': string;
  'request_date': string;
  'status': 'Pending' | 'Shipped' | 'Received';
  'items': Item[],
  'staff_notes': string;
  'customer_notes': string;
}

interface Item {
  'id': number;
  'product': {
    'id': number;
    'name': string;
    'thumbnail': {
      'file': string;
      'width': number;
      'height': number;
      'mime-type': string;
      'url': string;
    }
  },
  'price_per_set': number;
  'no_of_sets': number;
  'subtotal': number;
}
