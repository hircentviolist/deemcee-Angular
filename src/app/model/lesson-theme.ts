import { Lesson } from './lesson-theme-dto';

export interface LessonTheme {
    'id': number;
    'category_id': number;
    'name': string;
    'lessons': Lesson[]
}