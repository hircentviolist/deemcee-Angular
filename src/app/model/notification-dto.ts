export interface NotificationDto {
  'created_at': string;
  'description': string;
  'id': string;
  'sent_to': {
    'notifiable': {
      'id': number;
      'name': string;
      'email': string;
      'is_deshop_user': boolean;
    };
    'notifiable_type': string;
  };
  'status': string;
  'subject': string;
  'type_id': number;
}

export interface NotificationListDto {
  'current_page': number;
  'data': NotificationDto[];
  last_page: number;
  per_page: number;
  total: number;
}
