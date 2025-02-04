export interface Movement {
    'branch': {
        'id': number;
        'name': string;
      },
      'product': {
        'id': number;
        'name': string;
      },
      'movements': Move[] 
}

interface Move {
    'old': number;
    'amount': number;
    'new': number;
    'reason_id': number
    'reason_text': string;
    'creator': {
      'id': number;
      'first_name': string;
      'last_name': string;
      'full_name': string;
      'email': string;
    },
    'created_at': string;
}
