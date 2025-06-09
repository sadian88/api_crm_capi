import { Request, Response } from 'express';
import { pool } from '../db/db';
import { PropertyFavorite, PropertyFavoriteCreate, PropertyFavoriteUpdate, PropertyFavoriteWithDetails } from '../models/PropertyFavorite';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const propertyFavoriteController = {
    // Obtener todos los favoritos
    async getAllFavorites(req: Request, res: Response) {
        try {
            const [favorites] = await pool.query<RowDataPacket[]>(
                `SELECT f.*, 
                    p.title as property_title,
                    p.address as property_address,
                    p.type as property_type,
                    p.status as property_status,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone
                FROM property_favorites f
                LEFT JOIN properties p ON f.property_id = p.id
                LEFT JOIN users u ON f.user_id = u.id
                ORDER BY f.created_at DESC`
            );
            res.json(favorites as PropertyFavoriteWithDetails[]);
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
            res.status(500).json({ message: 'Error al obtener los favoritos' });
        }
    },

    // Obtener un favorito por ID
    async getFavoriteById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [favorites] = await pool.query<RowDataPacket[]>(
                `SELECT f.*, 
                    p.title as property_title,
                    p.address as property_address,
                    p.type as property_type,
                    p.status as property_status,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone
                FROM property_favorites f
                LEFT JOIN properties p ON f.property_id = p.id
                LEFT JOIN users u ON f.user_id = u.id
                WHERE f.id = ?`,
                [id]
            );

            if (!favorites.length) {
                return res.status(404).json({ message: 'Favorito no encontrado' });
            }

            res.json(favorites[0] as PropertyFavoriteWithDetails);
        } catch (error) {
            console.error('Error al obtener favorito:', error);
            res.status(500).json({ message: 'Error al obtener favorito' });
        }
    },

    // Crear un favorito
    async createFavorite(req: Request, res: Response) {
        try {
            const favoriteData: PropertyFavoriteCreate = req.body;

            // Verificar si la propiedad existe
            const [properties] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM properties WHERE id = ?',
                [favoriteData.property_id]
            );
            if (!properties.length) {
                return res.status(404).json({ message: 'Propiedad no encontrada' });
            }

            // Verificar si el usuario existe
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE id = ?',
                [favoriteData.user_id]
            );
            if (!users.length) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar si ya existe el favorito
            const [existingFavorites] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM property_favorites WHERE property_id = ? AND user_id = ?',
                [favoriteData.property_id, favoriteData.user_id]
            );
            if (existingFavorites.length > 0) {
                return res.status(400).json({ message: 'La propiedad ya está en favoritos' });
            }

            // Insertar el favorito
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO property_favorites (
                    id, property_id, user_id, created_at, updated_at
                ) VALUES (UUID(), ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [favoriteData.property_id, favoriteData.user_id]
            );

            const [newFavorite] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM property_favorites WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newFavorite[0] as PropertyFavorite);
        } catch (error) {
            console.error('Error al crear favorito:', error);
            res.status(500).json({ message: 'Error al crear favorito' });
        }
    },

    // Actualizar un favorito
    async updateFavorite(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const favoriteData: PropertyFavoriteUpdate = req.body;

            // Verificar si el favorito existe
            const [favorites] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM property_favorites WHERE id = ?',
                [id]
            );

            if (!favorites.length) {
                return res.status(404).json({ message: 'Favorito no encontrado' });
            }

            // Verificar si la propiedad existe si se proporciona
            if (favoriteData.property_id) {
                const [properties] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM properties WHERE id = ?',
                    [favoriteData.property_id]
                );
                if (!properties.length) {
                    return res.status(404).json({ message: 'Propiedad no encontrada' });
                }
            }

            // Verificar si el usuario existe si se proporciona
            if (favoriteData.user_id) {
                const [users] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM users WHERE id = ?',
                    [favoriteData.user_id]
                );
                if (!users.length) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
            }

            // Actualizar el favorito
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE property_favorites 
                SET property_id = COALESCE(?, property_id),
                    user_id = COALESCE(?, user_id),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [favoriteData.property_id, favoriteData.user_id, id]
            );

            const [updatedFavorite] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM property_favorites WHERE id = ?',
                [id]
            );

            res.json(updatedFavorite[0] as PropertyFavorite);
        } catch (error) {
            console.error('Error al actualizar favorito:', error);
            res.status(500).json({ message: 'Error al actualizar favorito' });
        }
    },

    // Eliminar un favorito
    async deleteFavorite(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM property_favorites WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Favorito no encontrado' });
            }
            res.json({ message: 'Favorito eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            res.status(500).json({ message: 'Error al eliminar favorito' });
        }
    },

    // Obtener favoritos por usuario
    async getFavoritesByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const [favorites] = await pool.query<RowDataPacket[]>(
                `SELECT f.*, 
                    p.title as property_title, 
                    p.address as property_address,
                    p.type as property_type,
                    p.status as property_status
                FROM property_favorites f
                LEFT JOIN properties p ON f.property_id = p.id
                WHERE f.user_id = ?
                ORDER BY f.created_at DESC`,
                [userId]
            );
            res.json(favorites as PropertyFavoriteWithDetails[]);
        } catch (error) {
            console.error('Error al obtener favoritos del usuario:', error);
            res.status(500).json({ message: 'Error al obtener los favoritos del usuario' });
        }
    },

    // Obtener favoritos por cliente (alias de getFavoritesByUser)
    async getFavoritesByClient(req: Request, res: Response) {
        return this.getFavoritesByUser(req, res);
    },

    // Obtener favoritos por propiedad
    async getFavoritesByProperty(req: Request, res: Response) {
        try {
            const { propertyId } = req.params;
            const [favorites] = await pool.query<RowDataPacket[]>(
                `SELECT f.*, 
                    p.title as property_title, 
                    p.address as property_address,
                    p.type as property_type,
                    p.status as property_status,
                    u.name as user_name,
                    u.email as user_email,
                    u.phone as user_phone
                FROM property_favorites f
                LEFT JOIN properties p ON f.property_id = p.id
                LEFT JOIN users u ON f.user_id = u.id
                WHERE f.property_id = ?
                ORDER BY f.created_at DESC`,
                [propertyId]
            );
            res.json(favorites as PropertyFavoriteWithDetails[]);
        } catch (error) {
            console.error('Error al obtener favoritos de la propiedad:', error);
            res.status(500).json({ message: 'Error al obtener los favoritos de la propiedad' });
        }
    },

    // Obtener estadísticas de favoritos
    async getFavoriteStats(req: Request, res: Response) {
        try {
            const [stats] = await pool.query<RowDataPacket[]>(
                `SELECT 
                    COUNT(*) as total_favorites,
                    COUNT(DISTINCT user_id) as unique_users,
                    COUNT(DISTINCT property_id) as unique_properties
                FROM property_favorites`
            );

            res.json(stats[0]);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas' });
        }
    }
}; 