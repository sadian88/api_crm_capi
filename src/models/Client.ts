import { RowDataPacket } from 'mysql2';

export interface Client extends RowDataPacket {
    id: string;
    name: string;
    email: string;
    phone: string;
    document_type: 'dni' | 'ruc' | 'ce' | 'passport';
    document_number: string;
    address: string;
    real_estate_id: string;
    agent_id: string;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
}

export interface ClientCreate {
    name: string;
    email: string;
    phone: string;
    document_type: 'dni' | 'ruc' | 'ce' | 'passport';
    document_number: string;
    address: string;
    real_estate_id: string;
    agent_id: string;
    status?: 'active' | 'inactive';
}

export interface ClientUpdate {
    name?: string;
    email?: string;
    phone?: string;
    document_type?: 'dni' | 'ruc' | 'ce' | 'passport';
    document_number?: string;
    address?: string;
    real_estate_id?: string;
    agent_id?: string;
    status?: 'active' | 'inactive';
}

export interface ClientWithDetails extends Client {
    agent_name: string;
    agent_email: string;
    agent_phone: string;
    real_estate_name: string;
    total_interactions: number;
} 