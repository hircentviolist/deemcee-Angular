export interface AuthDto {
    user_id: number;
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
    roles: string[];
    is_first_login: boolean;
  }
