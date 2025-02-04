export interface ClassListItemDto {
    'id': number;
    'category': {
        'id': number;
        'name': string;
        'current_version': {
            'id': number;
            'name': string;
            'start_date': string;
            'end_date': string;
        };
        'versions': Version[];
    },
    'day': string;
    'start_time': string;
    'end_time': string;
    'max_class_size': string;
    'number_enrolled': string;
    'enrolments_count': string;
    'commencement_date': Date;
    'label': string;
}

interface Version {
    'id': number;
    'name': string;
    'start_date': string;
    'end_date': string;
}
