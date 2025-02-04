import { Branch } from './branch';
import { Manager } from './manager';
import { Teacher } from './teacher';

export interface Principal {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    personal_email: string;
    phone: string;
    terminated_at: string;
}

interface BranchForAdmin extends Branch {
    managers: Manager[];
    teachers: Teacher[];
}
