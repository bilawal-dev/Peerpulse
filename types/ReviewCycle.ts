export interface ReviewCycle {
    review_cycle_id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    max_peer_selection: number;
    max_reviews_allowed: number;
    is_peer_selection_enabled: boolean;
    is_review_enabled: boolean;
    created_at: string;
    updated_at: string;
}