import {ClassLessonDto} from './class-lesson-dto';

export interface ThemeLessonItem {
    'has_attended': number;
    'theme_id': number;
    'theme_name': number;
    'lessons': ClassLessonDto[];
}
