export interface ManagerListItem {
  'id': number;
  'first_name': string;
  'last_name': string;
  'name': string;
  'email': string;
  'phone': string;
  'dob': Date;
  'ic_number': string;
  'terminated_at': string;
  'branch': {
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
  }; // Useless data
  branches: Branch[];
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
