export interface MerchandiseListItem {
    'id': number;
    'name': string;
    'short_description': string;
    'long_description'?: string;
    'regular_price': string;
    'sale_price': string;
    'price': string;
    'quantity_per_set': number;
    'price_per_set': number;
    'sku': string;
    'thumbnail': {
      'file': string;
      'width': number;
      'height': number;
      'mime-type': string;
      'url': string;
    },
    'branch': {
      'id': number;
      'name': string;
    },
    'stock': number;
    'branch_stock': number;
}


