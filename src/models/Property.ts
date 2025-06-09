import { RowDataPacket } from 'mysql2';

export interface Property extends RowDataPacket {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    type: string;
    status: string;
    real_estate_id: string;
    project_id: string | null;
    agent_id: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface PropertyCreate {
    title: string;
    description: string;
    price: number;
    address: string;
    type: string;
    status: string;
    real_estate_id: string;
    project_id?: string;
    agent_id?: string;
}

export interface PropertyUpdate {
    title?: string;
    description?: string;
    price?: number;
    address?: string;
    type?: string;
    status?: string;
    real_estate_id?: string;
    project_id?: string;
    agent_id?: string;
}

export interface PropertyWithDetails extends Property {
    real_estate_name: string;
    project_name: string | null;
    agent_name: string | null;
} 