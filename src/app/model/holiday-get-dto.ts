export interface HolidayGetDto {
    'id': number;
    'branch': {
        'name': string;
        'id': number
    }
    'year': string;
    'status': 'Published' | 'Draft';
    'dates': DatesItem[];
}

interface DatesItem {
    id?: number;
    title: string;
    start: string;
    end: string;
}
