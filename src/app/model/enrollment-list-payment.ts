import {Grade} from './grade';
export interface EnrollmentListPaymentDto {
    data: EnrollmentListPayment[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };

}

export interface EnrollmentListPayment {
    'id': number;
    'name': string;
    'commencement_date': string;
    'enrolment_date': string;
    'grade': string;
    'grade_obj': Grade;
    'start_date': string;
    'end_date': string;
    'status': string;
    'video_array': any[];
    'video_one': {
        enrolment_id: number;
        id: number;
        student_id: number;
        submission_date: string;
        theme_id: number;
        video_number: number;
        video_url: string;
    };
    'video_two': {
        enrolment_id: number;
        id: number;
        student_id: number;
        submission_date: string;
        theme_id: number;
        video_number: number;
        video_url: string;
    };
    'video_one_date': string;
    'video_two_date': string;
    'payment_details': {
        'id': number;
        'student_id': number;
        'parent_id': number;
        'payable_id': number;
        'description': string;
        'amount': number;
        'discount': number;
        'amount_to_pay': number;
        'discount_code': string;
        'total': number;
        'status': string;
        'date': string;
        'remarks': null;
        'created_at': string;
        'updated_at': string;
        'paid_at': string;
    }
}
