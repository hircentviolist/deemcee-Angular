export interface HolidayPostDto {
    'id'?: number;
    'branch_id': number;
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
