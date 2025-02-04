import { ClassLessonDto } from './class-lesson-dto';

export interface EnrollmentListItem {
	id: number;
	first_name: string;
	last_name: string;
	name: string;
	commencement_date: string;
	enrolment_date: string;
	deemcee_starting_grade: string;
	grade_id: number;
	current_grade_id: number;
	grade: {
		id: number;
		category_id: number;
		name: string;
		price: string;
	};
	enrolment: {
		class_id: number;
		created_at: string;
		id: number;
		is_active: number;
		remarks: string;
		status: string;
		student_id: number;
		updated_at: string;
		class: DeClass;
	};
	dob: string;
	gender: string;
	school: string;
	status: string;
	referral: string;
	referral_channel: {
		id: number;
		name: string;
	};
	parent: {
		id: number;
		name: string;
		dob: string;
		email: string;
		gender: string;
		occupation: string;
		phone: string;
		referral: string;
		how_did_you_know_about_us: string;
		spouse_name: string;
		spouse_occupation: string;
		spouse_phone: string;
		address: {
			address_line_1: string;
			address_line_2: string;
			address_line_3: string;
			city: string;
			id: number;
			postcode: string;
			state: string;
		};
	};
	payment_details: [
		{
			id: number;
			student_id: number;
			parent_id: number;
			payable_id: number;
			description: string;
			amount: number;
			discount: number;
			discount_code: string;
			total: number;
			status: string;
			date: string;
			remarks: null;
			created_at: string;
			updated_at: string;
			amount_to_pay: string;
			paid_amount: string;
		}
	];
	class_lesson: ClassLessonDto[];
	remaining_class_count: number;
	total_attended_count: number;
	total_rescheduled_count: number;
	total_absent_count: number;
	total_class_count: number;
	freezed_class_count: number;
}

interface DeClass {
	id: number;
	starting_theme_id: number;
	total_enrolled: number;
	branch_id: number;
	category_id: number;
	commencement_date: string;
	day: string;
	label: string;
	start_time: string;
	end_time: string;
	max_slot: number;
}
