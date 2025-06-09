import { RowDataPacket } from 'mysql2';

export interface Permission extends RowDataPacket {
    id: string;
    name: string;
    description: string | null;
}

export interface PermissionCreate {
    name: string;
    description?: string;
}

export interface PermissionUpdate {
    name?: string;
    description?: string;
} 