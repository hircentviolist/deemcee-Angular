export interface StockRequestListItem {
    'data': Data[];
    'links': {
      'first': string;
      'last': string;
      'next': string;
      'prev': string; 
    };
    'meta': {
      'current_page': number;
      'last_page': number;
      'from': number;
      'to': number;
      'total': number;
      'per_page': number;
      'path': string;
    };
  }

  interface Data {
    'id': number;
    'branch': {
      'id': number;
      'name': string;
    },
    'user': {
      'id': number;
      'first_name': string;
      'last_name': string;
      'full_name': string;
    },
    'billing': {
      'id': number;
      'address_line_1': string;
      'address_line_2': string;
      'address_line_3': string;
      'postcode': string;
      'city': string;
      'state': string;
    },
    'shipping': {
      'id': number;
      'address_line_1': string;
      'address_line_2': string;
      'address_line_3': string;
      'postcode': string;
      'city': string;
      'state': string;
    },
    'request_date': string;
    'status': string;
    'customer_notes': string;
    'staff_notes': string;
  }
