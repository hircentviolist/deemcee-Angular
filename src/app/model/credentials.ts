export interface Credentials {
    email: string;
    role: 'superadmin' | 'admin' | 'principal' | 'manager' | 'teacher' | 'parent' | '';
    access_token: string;
    refresh_token: string;
    expires_in: number;
    full_name: string;
}
