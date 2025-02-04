
interface BranchItem {
    id: number,
    name: string;
    operation_date: Date,
    ownership_type: 'HQ' | 'Licensee',
    franchisee: string;
}
