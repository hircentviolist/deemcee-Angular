export interface TeachersListItemDto {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  ic_number: string;
  branch: {
    id: number;
    name: string;
    role: {
      id: number;
      name: string;
      grade_id: string;
    }
  }
}
