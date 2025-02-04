export interface Parent {
    first_name
    last_name
    email
    phone
    dob
    gender: 'Male' | 'Female'
    occupation: string;
    spouse_name: string;
    spouse_phone: string;
    address: {
        address_line_1: string;
        address_line_2: string;
        address_line_3: string;
        address_city: string;
        address_postcode: string;
        address_state: string;
    };
    how_did_you_know_about_us: string;
    referral: string;
}
