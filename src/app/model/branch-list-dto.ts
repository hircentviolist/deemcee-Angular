export interface BranchListDto {
    id: number;
    name: string;
    operation_date: Date;
    ownership_type: 'HQ' | 'Licensee',
    principal: {
      id: number;
      name: string;
    };
    grade: {
      id: number;
      name: string;
      percentage: number;
    }
}
