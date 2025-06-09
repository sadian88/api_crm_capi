import { Request, Response } from 'express';
import { pool } from '../db/db';
import { Role, RoleCreate, RoleUpdate } from '../models/Role';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const roleController = {
    // Obtener todos los roles
    async getAllRoles(req: Request, res: Response) {
        try {
            const [roles] = await pool.query<RowDataPacket[]>('SELECT * FROM roles');
            res.json(roles as Role[]);
        } catch (error) {
            console.error('Error al obtener roles:', error);
            res.status(500).json({ message: 'Error al obtener roles' });
        }
    },

    // Obtener un rol por ID
    async getRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [roles] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM roles WHERE id = ?',
                [id]
            );
            
            if (!roles.length) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }
            
            res.json(roles[0] as Role);
        } catch (error) {
            console.error('Error al obtener rol:', error);
            res.status(500).json({ message: 'Error al obtener rol' });
        }
    },

    // Crear un nuevo rol
    async createRole(req: Request, res: Response) {
        try {
            const roleData: RoleCreate = req.body;

            // Verificar si el rol ya existe
            const [existingRoles] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM roles WHERE name = ?',
                [roleData.name]
            );

            if (existingRoles.length > 0) {
                return res.status(400).json({ message: 'Ya existe un rol con ese nombre' });
            }

            // Insertar rol
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO roles (
                    id, name, description, created_at, updated_at
                ) VALUES (UUID(), ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [roleData.name, roleData.description]
            );

            const [newRole] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM roles WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newRole[0] as Role);
        } catch (error) {
            console.error('Error al crear rol:', error);
            res.status(500).json({ message: 'Error al crear rol' });
        }
    },

    // Actualizar un rol
    async updateRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const roleData: RoleUpdate = req.body;

            // Verificar si el rol existe
            const [roles] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM roles WHERE id = ?',
                [id]
            );

            if (!roles.length) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            // Verificar si el nuevo nombre ya existe
            if (roleData.name) {
                const [existingRoles] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM roles WHERE name = ? AND id != ?',
                    [roleData.name, id]
                );

                if (existingRoles.length > 0) {
                    return res.status(400).json({ message: 'Ya existe un rol con ese nombre' });
                }
            }

            // Actualizar rol
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE roles 
                SET name = COALESCE(?, name),
                    description = COALESCE(?, description),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [roleData.name, roleData.description, id]
            );

            const [updatedRole] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM roles WHERE id = ?',
                [id]
            );

            res.json(updatedRole[0] as Role);
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            res.status(500).json({ message: 'Error al actualizar rol' });
        }
    },

    // Eliminar un rol
    async deleteRole(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si el rol está asignado a algún usuario
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE role_id = ?',
                [id]
            );

            if (users.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar el rol porque está asignado a usuarios' 
                });
            }

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM roles WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            res.json({ message: 'Rol eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            res.status(500).json({ message: 'Error al eliminar rol' });
        }
    },

    // Asignar permisos a un rol
    async assignPermissions(req: Request, res: Response) {
        try {
            const { roleId } = req.params;
            const { permissions } = req.body; // Array de { permissionId, moduleId }

            // Verificar si el rol existe
            const [roles] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM roles WHERE id = ?',
                [roleId]
            );

            if (!roles.length) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            // Primero eliminamos los permisos existentes
            await pool.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

            // Insertamos los nuevos permisos
            for (const perm of permissions) {
                await pool.query(
                    `INSERT INTO role_permissions (
                        id, role_id, permission_id, module_id, 
                        created_at, updated_at
                    ) VALUES (
                        UUID(), ?, ?, ?, 
                        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )`,
                    [roleId, perm.permissionId, perm.moduleId]
                );
            }

            res.json({ message: 'Permisos asignados exitosamente' });
        } catch (error) {
            console.error('Error al asignar permisos:', error);
            res.status(500).json({ message: 'Error al asignar permisos' });
        }
    },

    // Obtener permisos de un rol
    async getRolePermissions(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si el rol existe
            const [roles] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM roles WHERE id = ?',
                [id]
            );

            if (!roles.length) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            const [permissions] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, m.name as module_name 
                FROM role_permissions rp 
                JOIN permissions p ON rp.permission_id = p.id 
                JOIN modules m ON rp.module_id = m.id 
                WHERE rp.role_id = ?`,
                [id]
            );
            
            res.json(permissions);
        } catch (error) {
            console.error('Error al obtener permisos del rol:', error);
            res.status(500).json({ message: 'Error al obtener permisos del rol' });
        }
    }
}; 