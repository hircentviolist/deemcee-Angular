export interface EventListItemDTO {
    'id': number;
    'title': string;
    'description': string;
    'venue': string;
    'start': {
      'date': Date;
      'time': string;
    },
    'end': {
      'date': Date;
      'time': string;
    },
    'status'?: 'Published' | 'Draft';
  }
