export interface ClassGetDto {
    'id': number;
    'day': string;
    'start_time': string;
    'end_time': string;
    'commencement_date': string;
    'label': string,
    'category': {
        'id': number;
        'name': string;
    },
    'lessons': {
        data: Classes[],
        current_page: number,
        last_page: number,
        path: string,
        first_page_url: string,
        last_page_url: string,
        next_page_url: string,
        prev_page_url: string,
        per_page: number,
        from: number,
        to: number,
        total: number
    };
}

export interface Classes {
    id: number;
    lesson: {
        id: number;
        name: string;
        order: number;
        theme?: {
            id: number;
            name: string;
        }
    };
    date: Date;
    start_datetime: string;
    end_datetime: string;
    status: string;
    past: boolean;
}
