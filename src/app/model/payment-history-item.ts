export interface PaymentHistoryItem {
  amount: number;
  created_at: string;
  date: string;
  description: string;
  discount: number;
  discount_code: string;
  id: number;
  paid_amount: string;
  parent_id: number;
  invoice: {
    branch_id: number;
    created_at: string;
    file_path: string;
    id: number;
    invoice_sequence_id: number;
    updated_at: string;
  };
  payable: {
    class_id: number;
    created_at: string;
    end_date: string;
    grade: {
      category_id: number;
      created_at: string;
      description: string;
      display_name: string;
      id: number;
      name: string;
      price: number;
      updated_at: string;
    };
    id: number;
    is_active: number;
    remarks: string
    start_date: string;
    status: string;
    student_id: number;
    updated_at: string;
  };
  payable_id: number;
  payable_type: string;
  payment_invoice_id: number;
  post_outstanding: string;
  pre_outstanding: number;
  remarks: string
  start_date: string;
  status: string;
  student_id: number;
  updated_at: string;
}
