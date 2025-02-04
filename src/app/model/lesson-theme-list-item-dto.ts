export interface LessonThemeListItemDto {
    'id': number;
    'category': {
      'id': number;
      'name': string;
    },
    'version': {
      'id': number;
      'name': string;
      'start_date': string;
      'end_date': string;
    },
    'name': string;
    'is_editable': boolean;
    'total_classes': number;
    'versions': Version[];
}

interface Version {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}
