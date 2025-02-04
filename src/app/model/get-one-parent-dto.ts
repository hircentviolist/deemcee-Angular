export interface GetOneParentDto {
    'id': number;
    'first_name': string;
    'last_name': string;
    'name': string;
    'email': string;
    'phone': string;
    'dob': string;
    'gender': 'Male' | 'Female';
    'occupation': string;
    'spouse_name': string;
    'spouse_phone': string;
    'spouse_occupation': string;
    'no_of_children': number;
    'branch_id': number;
    'address': {
        'id': number;
        'address_line_1': string;
        'address_line_2': string;
        'address_line_3': string;
        'postcode': string;
        'city': string;
        'state': string;
    },
    'how_did_you_know_about_us': string;
    'referral': string;
    'branch': {
        'id': number;
        'name': string;
    }
    kids: Kid[];
}

export interface Kid {
    'branch_id': number;
    'commencement_date': string;
    'created_at': string;
    'deemcee_starting_grade': string;
    'starting_grade': string;
    'deleted_at': string;
    'dob': string;
    'end_date': string;
    'enrolment_date': string;
    'first_name': string;
    'gender': string;
    'grade_id': number;
    'current_grade': string;
    'id': number;
    'last_name': string;
    'last_payment_datetime': string;
    'parent_id': number;
    'referral': string;
    'referral_channel_id': number;
    'referral_channel': string;
    'school': string;
    'starter_kit_id': number;
    'status': string;
    'updated_at': string;
    'voucher': string;
}
