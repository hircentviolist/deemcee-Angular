export interface Student {
    id: number;
    branch_id: number;
    parent_id: number;
    parent_name: string;
    first_name: string;
    last_name: string;
    has_attended: boolean;
    dob: Date;
    gender: 'male' | 'female';
    school: string;
    deEmcee_starting_grade_id: string;
    commencement_date: Date;
    enrolment_date: Date;
    status: 'Enrol' | 'Transfer In' | 'Transfer Out' | 'Dropped' | 'Graduated'
}
