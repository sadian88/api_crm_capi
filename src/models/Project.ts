import { RowDataPacket } from 'mysql2';
import { RealEstate } from './RealEstate';

export interface Project extends RowDataPacket {
    id: string;
    name: string;
    description: string;
    real_estate_id: string;
    status: 'active' | 'completed' | 'cancelled';
    created_at: Date;
    updated_at: Date;
}

export interface ProjectCreate {
    name: string;
    description: string;
    real_estate_id: string;
    status: 'active' | 'completed' | 'cancelled';
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
    real_estate_id?: string;
    status?: 'active' | 'completed' | 'cancelled';
}

export interface ProjectWithDetails extends Project {
    real_estate_name: string;
    total_properties: number;
} 