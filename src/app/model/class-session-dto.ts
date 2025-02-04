export interface ClassSessionDto {
  'id': number,
  'branch_id': number,
  'class_id':  number,
  'lesson_id': number,
  'date': string,
  'created_at': string,
  'updated_at': string,
  'deleted_at': string,
  'de_class': {
    'id': number,
    'branch_id': number,
    'category_id': number,
    'starting_theme_id': number,
    'total_enrolled': number,
    'max_slot': number,
    'day': string,
    'start_time': string,
    'end_time': string,
    'commencement_date': string,
    'created_at': string,
    'updated_at': string,
    'deleted_at': string
  }
}
