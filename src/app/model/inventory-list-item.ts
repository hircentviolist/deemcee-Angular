export interface InventoryListItem {
    'id': number;
    'product': {
      'id': number;
      'name': string;
      'description': string;
      'price': string;
      'd_point': number;
      'minimum_order': number;
      'image_url': string;
    },
    'quantity': number;
}
