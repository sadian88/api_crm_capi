import { RowDataPacket } from 'mysql2';

export interface Agent extends RowDataPacket {
  id: string;
  user_id: string;
  real_estate_id: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AgentCreate {
  user_id: string;
  real_estate_id?: string;
  phone?: string;
}

export interface AgentUpdate {
  user_id?: string;
  real_estate_id?: string;
  phone?: string;
}

export interface AgentWithDetails extends Agent {
  user_name: string;
  user_email: string;
  real_estate_name: string | null;
} 