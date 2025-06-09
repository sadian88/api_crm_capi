import { RowDataPacket } from 'mysql2';

export interface PropertyFavorite extends RowDataPacket {
  id: string;
  property_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyFavoriteCreate {
  property_id: string;
  user_id: string;
}

export interface PropertyFavoriteUpdate {
  property_id?: string;
  user_id?: string;
}

export interface PropertyFavoriteWithDetails extends PropertyFavorite {
  property_title: string | null;
  property_address: string | null;
  property_type: string | null;
  property_status: string | null;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
} 