import { RowDataPacket } from 'mysql2';

export interface Role extends RowDataPacket {
    id: string;
    name: string;
    description: string | null;
}

export interface RoleCreate {
    name: string;
    description?: string;
}

export interface RoleUpdate {
    name?: string;
    description?: string;
} 