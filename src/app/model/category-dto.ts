export interface CalendarDto {
    'id': string;
    'year': string;
    'status': 'Published' | 'Draft';
    'dates': EventDate[];
}

export interface EventDate {
    id: string;
    start: Date;
    end: Date;
}
