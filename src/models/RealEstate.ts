import { RowDataPacket } from 'mysql2';

export interface RealEstate extends RowDataPacket {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface RealEstateCreate {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
}

export interface RealEstateUpdate {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
}

export interface RealEstateWithDetails extends RealEstate {
    total_agents: number;
    total_properties: number;
} 