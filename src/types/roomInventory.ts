export interface RoomInventoryResponse {
  status?: string;
  room_detail?: RoomDetail[];
  price_detail?: PriceDetail[];
  promotion_detail?: PromotionDetail[];
}

export interface PriceDetail {
  room?: number;
  plan?: number;
  sbr_rate?: number;
  dbr_rate?: number;
  extra_bed_rate?: number;
  child_2_5_rate?: number;
  child_6_10_rate?: number;
  season_start?: Date;
  season_end?: null;
}

export interface PromotionDetail {
  best_promotion?: BestPromotionInfo;
  has_promotion?: boolean;
  type_of_offer?: "Fixed" | "Percentage";
  promotion_discount?: number;
}

export interface BestPromotionInfo {
  type?: string;
  rate_or_percentage?: number;
  type_of_offer?: "Fixed" | "Percentage";
  details?: PromotionDetailsInfo;
  promotion_id?: number;
}

export interface PromotionDetailsInfo {
  id?: number;
  created?: string;
  property?: number;
  promotion_rooms?: PromotionRoomInfo[];
  deleted?: boolean;
  type_of_offer?: "Fixed" | "Percentage";
  rate_or_percentage?: number;
  booking_start?: string;
  booking_end?: string;
  stay_start?: string;
  stay_end?: string;
  back_out_start?: string | null;
  back_out_end?: string | null;
  name?: string;
  name_hindi?: string | null;
  status?: boolean;
  status_remark?: string;
  created_by?: number;
  full_name?: string;
}

export interface PromotionRoomInfo {
  id?: number;
  basic_promotion?: number;
  rooms?: number;
  room_name?: string;
  plans?: number[];
  plan_details?: PlanDetailInfo[];
}

export interface PlanDetailInfo {
  id?: number;
  name?: string;
  created?: string;
  created_by?: number;
}

export interface RoomDetail {
  id?: number;
  created?: Date;
  season_start?: Date;
  season_end?: null;
  value?: number;
  room?: number;
  property?: number;
  sold?: number;
  customer_type?: string;
  available_rooms?: number; // Calculated field: value - sold
}

export interface AvailabilityResponse {
  status: string;
  available: string; // "yes" or "no"
  min_stay: number;
  booking_rules?: BookingRules | null;
}

export interface BookingRules {
  closed_to_arrival?: boolean;
  closed_to_departure?: boolean;
  stop_sell?: boolean;
  max_los?: number;
  [key: string]: any; // Allow for additional custom rules
}
