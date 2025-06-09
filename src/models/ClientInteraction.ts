import { RowDataPacket } from 'mysql2';

export interface ClientInteraction extends RowDataPacket {
    id: string;
    client_id: string;
    agent_id: string;
    property_id: string | null;
    type: 'call' | 'email' | 'meeting' | 'visit' | 'other';
    status: 'pending' | 'completed' | 'cancelled';
    notes: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ClientInteractionCreate {
    client_id: string;
    agent_id: string;
    property_id?: string;
    type: 'call' | 'email' | 'meeting' | 'visit' | 'other';
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
}

export interface ClientInteractionUpdate {
    client_id?: string;
    agent_id?: string;
    property_id?: string;
    type?: 'call' | 'email' | 'meeting' | 'visit' | 'other';
    status?: 'pending' | 'completed' | 'cancelled';
    notes?: string;
}

export interface ClientInteractionWithDetails extends ClientInteraction {
    client_document: string | null;
    agent_name: string | null;
    property_title: string | null;
} 