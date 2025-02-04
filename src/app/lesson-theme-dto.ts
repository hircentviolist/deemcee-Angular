export interface LessonThemeDto {
    'id': number;
    'category': {
        'id': number,
        'name': string
    },
    'name': string;
    'order': number;
    'lessons': Lesson[];
}

interface Lesson {
    id: number;
    name: string;
    order: number;
}
