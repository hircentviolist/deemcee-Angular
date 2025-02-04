export interface Branch {
    id: number;
    ownership_type: 'HQ' | 'Licensee';
    branch_id: number;
    name: string;
    operation_date: Date;
    address: {
        id: number;
        address_line_1: string;
        address_line_2: string;
        address_line_3: string;
        city: string;
        postcode: string;
        state: string;
    };
}
