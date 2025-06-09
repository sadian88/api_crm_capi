import { RowDataPacket } from 'mysql2';

export interface Module extends RowDataPacket {
    id: string;
    name: string;
    description: string | null;
}

export interface ModuleCreate {
    name: string;
    description?: string;
}

export interface ModuleUpdate {
    name?: string;
    description?: string;
} 