export interface ReviewCycle {
    review_cycle_id: number;
    name: string;
    max_peer_selection: number;
    max_reviews_allowed: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    is_peer_selection_enabled: boolean;
    is_review_enabled: boolean;
    cost_amount: number;
    paid_amount: number;
    payment_status: 'unpaid' | 'partial' | 'paid';
    access_blocked: boolean;
    created_at: string;
    updated_at: string;
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PARTIAL = 'partial',
    PAID = 'paid'
}