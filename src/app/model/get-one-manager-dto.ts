export interface GetOneManagerDto {
    'id': number;
    'first_name': string;
    'last_name': string;
    'name': string;
    'email': string;
    'phone': string;
    'dob': string;
    'ic_number': string;
    'bank_name': string;
    'bank_account_name': string;
    'bank_account_number': string;
    'address': {
      'id': number;
      'address_line_1': string;
      'address_line_2': string;
      'address_line_3': string;
      'postcode': string;
      'city': string;
      'state': string;
    },
    'branch_id': number; // Useless Data
    'branches': Branch[];
    'grade_id': number;
}

interface Branch {
  'id': number;
    'name': string;
    'role': {
      'id': number;
      'name': string;
    },
    'grade': {
      'id': number;
      'name': string;
    }
}
