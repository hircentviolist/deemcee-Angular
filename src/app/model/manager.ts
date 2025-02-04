export interface Manager {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: Date;
    ic_number: string;
    branch_id: number[];
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    address: {
        address_line_1: string;
        address_line_2: string;
        address_line_3: string;
        city: string;
        postcode: string;
        state: string;
    };
    grade_id: number;
}
