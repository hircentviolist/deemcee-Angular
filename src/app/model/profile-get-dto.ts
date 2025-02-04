export interface ProfileGetDto {
    'id': number;
    'first_name': string;
    'last_name': string;
    'name': string;
    'email': string;
    'phone': string;
    'profile': {
    'user_id': number;
    'bank_name': string;
    'bank_account_name': string;
    'bank_account_number': string;
    }
}
