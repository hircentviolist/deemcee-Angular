export interface CategoryGet {
    'id': number;
    'name': string;
    'current_version': {
      'id': number;
      'name': string;
      'start_date': string;
      'end_date': string;
    },
    'versions': Version[];
}

interface Version {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}
