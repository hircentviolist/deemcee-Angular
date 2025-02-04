export interface LessonThemeDto {
    'id': number;
    'category': {
        'id': number;
        'name': string;
    },
    'name': string;
    'lessons': Lesson[]
}

export interface Lesson {
    id: number;
    name: string;
    order: number;
}
