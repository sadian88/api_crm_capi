import { Request, Response } from 'express';
import { pool } from '../db/db';
import { User, UserCreate, UserUpdate } from '../models/User';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';

export const userController = {
    // Obtener todos los usuarios
    async getAllUsers(req: Request, res: Response) {
        try {
            const [users] = await pool.query<RowDataPacket[]>(
                `SELECT u.*, r.name as role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id`
            );
            res.json(users as User[]);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error al obtener usuarios' });
        }
    },

    // Obtener un usuario por ID
    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [users] = await pool.query<RowDataPacket[]>(
                `SELECT u.*, r.name as role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.id = ?`,
                [id]
            );
            
            if (!users.length) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            
            res.json(users[0] as User);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ message: 'Error al obtener usuario' });
        }
    },

    // Crear un nuevo usuario
    async createUser(req: Request, res: Response) {
        try {
            const userData: UserCreate = req.body;

            // Verificar si el usuario ya existe
            const [existingUsers] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE email = ?',
                [userData.email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }

            // Verificar si el rol existe
            if (userData.role_id) {
                const [roles] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM roles WHERE id = ?',
                    [userData.role_id]
                );

                if (!roles.length) {
                    return res.status(400).json({ message: 'El rol especificado no existe' });
                }
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Insertar usuario
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO users (
                    id, username, email, password, role_id, 
                    status, created_at, updated_at
                ) VALUES (
                    UUID(), ?, ?, ?, ?, 
                    'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )`,
                [
                    userData.username,
                    userData.email,
                    hashedPassword,
                    userData.role_id || null
                ]
            );

            const [newUser] = await pool.query<RowDataPacket[]>(
                `SELECT u.*, r.name as role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.id = ?`,
                [result.insertId]
            );

            res.status(201).json(newUser[0] as User);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    },

    // Actualizar un usuario
    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userData: UserUpdate = req.body;

            // Verificar si el usuario existe
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE id = ?',
                [id]
            );

            if (!users.length) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar si el rol existe si se proporciona
            if (userData.role_id) {
                const [roles] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM roles WHERE id = ?',
                    [userData.role_id]
                );

                if (!roles.length) {
                    return res.status(400).json({ message: 'El rol especificado no existe' });
                }
            }

            // Si se proporciona una nueva contraseña, encriptarla
            let hashedPassword = null;
            if (userData.password) {
                hashedPassword = await bcrypt.hash(userData.password, 10);
            }

            // Actualizar usuario
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE users 
                SET username = COALESCE(?, username),
                    email = COALESCE(?, email),
                    password = COALESCE(?, password),
                    role_id = COALESCE(?, role_id),
                    status = COALESCE(?, status),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    userData.username,
                    userData.email,
                    hashedPassword,
                    userData.role_id,
                    userData.status,
                    id
                ]
            );

            const [updatedUser] = await pool.query<RowDataPacket[]>(
                `SELECT u.*, r.name as role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.id = ?`,
                [id]
            );

            res.json(updatedUser[0] as User);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error al actualizar usuario' });
        }
    },

    // Eliminar un usuario
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si el usuario está asignado a algún agente
            const [agents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE user_id = ?',
                [id]
            );

            if (agents.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar el usuario porque está asignado a un agente' 
                });
            }

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM users WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    },

    // Login de usuario
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Buscar usuario por email
            const [users] = await pool.query<RowDataPacket[]>(
                `SELECT u.*, r.name as role_name 
                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id
                WHERE u.email = ?`,
                [email]
            );

            if (!users.length) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const user = users[0];

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Obtener permisos del usuario
            const [permissions] = await pool.query<RowDataPacket[]>(
                `SELECT DISTINCT p.*, m.name as module_name
                FROM permissions p
                INNER JOIN role_permissions rp ON p.id = rp.permission_id
                INNER JOIN modules m ON rp.module_id = m.id
                WHERE rp.role_id = ?`,
                [user.role_id]
            );

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: {
                    id: user.role_id,
                    name: user.role_name
                },
                permissions: permissions
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en login' });
        }
    }
}; 