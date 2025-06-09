import { Request, Response } from 'express';
import { pool } from '../db';
import { RealEstate, RealEstateCreate, RealEstateUpdate, RealEstateWithDetails } from '../models/RealEstate';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const realEstateController = {
    // Obtener todas las inmobiliarias
    async getAllRealEstates(req: Request, res: Response) {
        try {
            const [realEstates] = await pool.query<RowDataPacket[]>(
                `SELECT r.*, 
                  COUNT(DISTINCT a.id) as total_agents,
                  COUNT(DISTINCT p.id) as total_properties
                FROM real_estates r
                LEFT JOIN agents a ON r.id = a.real_estate_id
                LEFT JOIN properties p ON r.id = p.real_estate_id
                GROUP BY r.id
                ORDER BY r.created_at DESC`
            );
            res.json(realEstates as RealEstateWithDetails[]);
        } catch (error) {
            console.error('Error al obtener inmobiliarias:', error);
            res.status(500).json({ message: 'Error al obtener inmobiliarias' });
        }
    },

    // Obtener una inmobiliaria por ID
    async getRealEstateById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [realEstates] = await pool.query<RowDataPacket[]>(
                `SELECT r.*, 
                  COUNT(DISTINCT a.id) as total_agents,
                  COUNT(DISTINCT p.id) as total_properties
                FROM real_estates r
                LEFT JOIN agents a ON r.id = a.real_estate_id
                LEFT JOIN properties p ON r.id = p.real_estate_id
                WHERE r.id = ?
                GROUP BY r.id`,
                [id]
            );

            if (!realEstates.length) {
                return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
            }

            res.json(realEstates[0] as RealEstateWithDetails);
        } catch (error) {
            console.error('Error al obtener inmobiliaria:', error);
            res.status(500).json({ message: 'Error al obtener inmobiliaria' });
        }
    },

    // Crear una nueva inmobiliaria
    async createRealEstate(req: Request, res: Response) {
        try {
            const realEstateData: RealEstateCreate = req.body;

            // Verificar si ya existe una inmobiliaria con el mismo nombre
            const [existingRealEstates] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM real_estates WHERE name = ?',
                [realEstateData.name]
            );

            if (existingRealEstates.length > 0) {
                return res.status(400).json({ message: 'Ya existe una inmobiliaria con ese nombre' });
            }

            // Insertar inmobiliaria
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO real_estates (name, address, phone, email, website) VALUES (?, ?, ?, ?, ?)',
                [
                    realEstateData.name,
                    realEstateData.address,
                    realEstateData.phone,
                    realEstateData.email,
                    realEstateData.website
                ]
            );

            const [newRealEstate] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM real_estates WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newRealEstate[0] as RealEstate);
        } catch (error) {
            console.error('Error al crear inmobiliaria:', error);
            res.status(500).json({ message: 'Error al crear inmobiliaria' });
        }
    },

    // Actualizar una inmobiliaria
    async updateRealEstate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const realEstateData: RealEstateUpdate = req.body;

            // Verificar si la inmobiliaria existe
            const [realEstates] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM real_estates WHERE id = ?',
                [id]
            );

            if (!realEstates.length) {
                return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
            }

            // Verificar si el nuevo nombre ya existe
            if (realEstateData.name) {
                const [existingRealEstates] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM real_estates WHERE name = ? AND id != ?',
                    [realEstateData.name, id]
                );

                if (existingRealEstates.length > 0) {
                    return res.status(400).json({ message: 'Ya existe una inmobiliaria con ese nombre' });
                }
            }

            // Actualizar inmobiliaria
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE real_estates 
                SET name = COALESCE(?, name),
                    address = COALESCE(?, address),
                    phone = COALESCE(?, phone),
                    email = COALESCE(?, email),
                    website = COALESCE(?, website),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    realEstateData.name,
                    realEstateData.address,
                    realEstateData.phone,
                    realEstateData.email,
                    realEstateData.website,
                    id
                ]
            );

            const [updatedRealEstate] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM real_estates WHERE id = ?',
                [id]
            );

            res.json(updatedRealEstate[0] as RealEstate);
        } catch (error) {
            console.error('Error al actualizar inmobiliaria:', error);
            res.status(500).json({ message: 'Error al actualizar inmobiliaria' });
        }
    },

    // Eliminar una inmobiliaria
    async deleteRealEstate(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si hay agentes asociados
            const [agents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE real_estate_id = ?',
                [id]
            );

            if (agents.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar la inmobiliaria porque tiene agentes asociados' 
                });
            }

            // Verificar si hay propiedades asociadas
            const [properties] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM properties WHERE real_estate_id = ?',
                [id]
            );

            if (properties.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar la inmobiliaria porque tiene propiedades asociadas' 
                });
            }

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM real_estates WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
            }

            res.json({ message: 'Inmobiliaria eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar inmobiliaria:', error);
            res.status(500).json({ message: 'Error al eliminar inmobiliaria' });
        }
    },

    // Obtener estadísticas de una inmobiliaria
    async getRealEstateStats(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Obtener total de proyectos
            const [projectsResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_projects FROM projects WHERE real_estate_id = ?',
                [id]
            );

            // Obtener total de propiedades
            const [propertiesResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_properties FROM properties WHERE real_estate_id = ?',
                [id]
            );

            // Obtener total de agentes
            const [agentsResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_agents FROM agents WHERE real_estate_id = ?',
                [id]
            );

            res.json({
                total_projects: parseInt(projectsResult[0]?.total_projects || '0'),
                total_properties: parseInt(propertiesResult[0]?.total_properties || '0'),
                total_agents: parseInt(agentsResult[0]?.total_agents || '0')
            });
        } catch (error) {
            console.error('Error al obtener estadísticas de la inmobiliaria:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas de la inmobiliaria' });
        }
    }
}; 