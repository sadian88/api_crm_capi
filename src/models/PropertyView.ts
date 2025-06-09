import { RowDataPacket } from 'mysql2';

export interface PropertyView extends RowDataPacket {
    id: string;
    property_id: string;
    user_id: string | null;
    client_id: string | null;
    agent_id: string | null;
    source: string;
    ip_address: string;
    user_agent: string | null;
    view_date: Date;
    created_at: Date;
    updated_at: Date;
}

export interface PropertyViewCreate {
    property_id: string;
    user_id?: string;
    client_id?: string;
    agent_id?: string;
    source: string;
    ip_address: string;
    user_agent?: string;
}

export interface PropertyViewUpdate {
    property_id?: string;
    user_id?: string;
    client_id?: string;
    agent_id?: string;
    source?: string;
    ip_address?: string;
    user_agent?: string;
}

export interface PropertyViewWithDetails extends PropertyView {
    property_title: string | null;
    property_address: string | null;
    property_type: string | null;
    property_status: string | null;
    client_document: string | null;
    agent_name: string | null;
    real_estate_name: string | null;
} 