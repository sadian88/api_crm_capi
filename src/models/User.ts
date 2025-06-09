import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
    id: string;
    username: string;
    email: string;
    password: string;
    role_id: string | null;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date;
    role_name?: string;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    role_id?: string;
}

export interface UserUpdate {
    username?: string;
    email?: string;
    password?: string;
    role_id?: string;
    status?: 'active' | 'inactive';
} 