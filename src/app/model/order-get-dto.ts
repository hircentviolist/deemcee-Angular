export interface OrderGetDto {
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
    },
    'user': {
      'id': number;
      'first_name': string;
      'last_name': string;
      'full_name': string;
    },
    'status': string;
    'customer_notes': string;
    'staff_notes': string;
    'promo_code': {
      'amount': string;
      'code': string;
      'created_at': string;
      'expired_at': string;
      'id': number;
      'min_purchase_amount': string;
      'quantity': number;
      'type': string;
    };
    'items': [
      {
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
        'price': number;
        'quantity': number;
        'subtotal': number;
      },
      {
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
        'price': number;
        'quantity': number;
        'subtotal': number;
      }
    ]
  }
