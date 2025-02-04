export interface EventGetDto {
    'id': string;
    'branch': {
        id: number;
        name: string;
    }
    'title': string;
    'description': string;
    'venue': string;
    'start': {
        'date': string;
        'time': string;
    },
    'end': {
        'date': string;
        'time': string;
    },
    image_url: string;
    maximum_pax: number;
    is_all_day: boolean;
    status: 'Published' | 'Draft';
    invites: {
        branches: Branch[];
        principals: Attendee[];
        managers: Attendee[];
        teachers: Attendee[];
        parents: Attendee[];
    }
    invite_hq: boolean;
}

interface Attendee {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        full_name: string;
    },
    status: string;
}

interface Branch {
    branch: {
        id: number;
        name: string;
    }
}
