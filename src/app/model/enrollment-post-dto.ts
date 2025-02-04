export interface EnrollmentPostDto {
'parent': {
    'branch_id': number;
    'first_name': string;
    'last_name': string;
    'email': string;
    'phone': string;
    'dob': string;
    'gender': string;
    'occupation': string;
    'spouse_name': string;
    'spouse_phone': string;
    'spouse_occupation': string;
    'address': {
        'id': number;
        'address_line_1': string;
        'address_line_2': string;
        'address_line_3'?: string;
        'postcode': string;
        'city': string;
        'state': string;
    },
    'how_did_you_know_about_us': string;
    'referral': string,
    'branch': {
        'id': number;
        'name': string;
    }
},
'first_name': string;
'last_name': string;
'gender': string;
'dob': string;
'school': string;
'deemcee_starting_grade': string;
'commencement_date': string;
'enrolment_date': string;
'status': string
}
