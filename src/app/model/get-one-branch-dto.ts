export interface GetOneBranchDto {
    'id': number;
    'name': string;
    'operation_date': Date;
    'ownership_type': 'HQ' | 'Licensee';
    'branch_id': number;
    'address': {
      'id': number;
      'address_line_1': string;
      'address_line_2': string
      'address_line_3': string;
      'postcode': string;
      'city': string;
      'state': string;
    }
}
