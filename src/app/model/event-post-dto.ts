// export interface Event {
//     title: string;
//     description: string;
//     venue: string;
//     time_and_date: string;
//     seats_open: string;
//     price: number;
//     upload_image: string;
//     open_to: 'branch' | 'branch & parent' | 'parent';
// }

export interface EventPostDto {
    'branch_id': number;
    'title': string;
    'start_datetime': string;
    'end_datetime': string;
    'venue': string;
    'maximum_pax': string;
    'image_url': string;
    'status': string;
    'branches': Branch[];
    'parents': Parent[];
}

interface Branch {
    branch_id: number;
}

interface Parent {
    user_id: number;
}
