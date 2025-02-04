import {ClassLessonDto} from './class-lesson-dto';

export interface PastEnrolmentListItem {
  'class_id': number;
  'created_at': string;
  'id': number;
  'is_active': number;
  'lessons': ClassLessonDto[];
  'grade': {
    'category_id': number;
    'display_name': string;
  };
  'payment': {
    'id': number;
    'student_id': number;
    'parent_id': number;
    'payable_id': number;
    'description': string;
    'amount': number;
    'discount': number;
    'discount_code': string;
    'total': number;
    'status': string;
    'date': string;
    'remarks': string;
    'created_at': string;
    'updated_at': string;
  };
  'remarks': string;
  'status': string;
  'student_id': number;
  'updated_at': string;
  'start_date': string;
  'end_date': string;
  'video_array': Video[],
  'remaining_class_count': number,
  'total_attended_count': number,
  'total_rescheduled_count': number,
  'total_absent_count': number,
}

interface Video {
  id: number,
  enrolment_id: number,
  student_id: number,
  video_number: number,
  theme_id: number,
  submission_date: string,
  submit_before: string,
  video_url: string,
  label: string,
}
