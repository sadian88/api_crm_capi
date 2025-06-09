import { Request, Response } from 'express';
import { pool } from '../db';
import { Property, PropertyCreate, PropertyUpdate, PropertyWithDetails } from '../models/Property';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const propertyController = {
    // Obtener todas las propiedades
    async getAllProperties(req: Request, res: Response) {
        try {
            const [properties] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                ORDER BY p.created_at DESC`
            );
            res.json(properties as PropertyWithDetails[]);
        } catch (error) {
            console.error('Error al obtener propiedades:', error);
            res.status(500).json({ message: 'Error al obtener propiedades' });
        }
    },

    // Obtener una propiedad por ID
    async getPropertyById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [properties] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.id = ?`,
                [id]
            );

            if (properties.length === 0) {
                return res.status(404).json({ message: 'Propiedad no encontrada' });
            }

            res.json(properties[0] as PropertyWithDetails);
        } catch (error) {
            console.error('Error al obtener propiedad:', error);
            res.status(500).json({ message: 'Error al obtener propiedad' });
        }
    },

    // Crear una nueva propiedad
    async createProperty(req: Request, res: Response) {
        try {
            const propertyData: PropertyCreate = req.body;
            
            // Verificar si la inmobiliaria existe
            const [realEstates] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM real_estates WHERE id = ?',
                [propertyData.real_estate_id]
            );

            if (realEstates.length === 0) {
                return res.status(400).json({ message: 'La inmobiliaria especificada no existe' });
            }

            // Verificar si el proyecto existe si se proporciona
            if (propertyData.project_id) {
                const [projects] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM projects WHERE id = ?',
                    [propertyData.project_id]
                );

                if (projects.length === 0) {
                    return res.status(400).json({ message: 'El proyecto especificado no existe' });
                }
            }

            // Verificar si el agente existe si se proporciona
            if (propertyData.agent_id) {
                const [agents] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM agents WHERE id = ?',
                    [propertyData.agent_id]
                );

                if (agents.length === 0) {
                    return res.status(400).json({ message: 'El agente especificado no existe' });
                }
            }

            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO properties (
                    id, title, description, price, address, type, status,
                    real_estate_id, project_id, agent_id, created_at, updated_at
                ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [
                    propertyData.title,
                    propertyData.description,
                    propertyData.price,
                    propertyData.address,
                    propertyData.type,
                    propertyData.status,
                    propertyData.real_estate_id,
                    propertyData.project_id || null,
                    propertyData.agent_id || null
                ]
            );

            const [newProperty] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.id = ?`,
                [result.insertId]
            );

            res.status(201).json(newProperty[0] as PropertyWithDetails);
        } catch (error) {
            console.error('Error al crear propiedad:', error);
            res.status(500).json({ message: 'Error al crear propiedad' });
        }
    },

    // Actualizar una propiedad
    async updateProperty(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const propertyData: PropertyUpdate = req.body;

            // Verificar si la propiedad existe
            const [properties] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM properties WHERE id = ?',
                [id]
            );

            if (properties.length === 0) {
                return res.status(404).json({ message: 'Propiedad no encontrada' });
            }

            // Verificar si la inmobiliaria existe si se proporciona
            if (propertyData.real_estate_id) {
                const [realEstates] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM real_estates WHERE id = ?',
                    [propertyData.real_estate_id]
                );

                if (realEstates.length === 0) {
                    return res.status(400).json({ message: 'La inmobiliaria especificada no existe' });
                }
            }

            // Verificar si el proyecto existe si se proporciona
            if (propertyData.project_id) {
                const [projects] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM projects WHERE id = ?',
                    [propertyData.project_id]
                );

                if (projects.length === 0) {
                    return res.status(400).json({ message: 'El proyecto especificado no existe' });
                }
            }

            // Verificar si el agente existe si se proporciona
            if (propertyData.agent_id) {
                const [agents] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM agents WHERE id = ?',
                    [propertyData.agent_id]
                );

                if (agents.length === 0) {
                    return res.status(400).json({ message: 'El agente especificado no existe' });
                }
            }

            await pool.query(
                `UPDATE properties SET 
                    title = COALESCE(?, title),
                    description = COALESCE(?, description),
                    price = COALESCE(?, price),
                    address = COALESCE(?, address),
                    type = COALESCE(?, type),
                    status = COALESCE(?, status),
                    real_estate_id = COALESCE(?, real_estate_id),
                    project_id = COALESCE(?, project_id),
                    agent_id = COALESCE(?, agent_id),
                    updated_at = NOW()
                WHERE id = ?`,
                [
                    propertyData.title,
                    propertyData.description,
                    propertyData.price,
                    propertyData.address,
                    propertyData.type,
                    propertyData.status,
                    propertyData.real_estate_id,
                    propertyData.project_id,
                    propertyData.agent_id,
                    id
                ]
            );

            const [updatedProperty] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.id = ?`,
                [id]
            );

            res.json(updatedProperty[0] as PropertyWithDetails);
        } catch (error) {
            console.error('Error al actualizar propiedad:', error);
            res.status(500).json({ message: 'Error al actualizar propiedad' });
        }
    },

    // Eliminar una propiedad
    async deleteProperty(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si la propiedad existe
            const [properties] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM properties WHERE id = ?',
                [id]
            );

            if (properties.length === 0) {
                return res.status(404).json({ message: 'Propiedad no encontrada' });
            }

            // Verificar si la propiedad tiene vistas o favoritos
            const [views] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM property_views WHERE property_id = ?',
                [id]
            );

            const [favorites] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM property_favorites WHERE property_id = ?',
                [id]
            );

            if (views.length > 0 || favorites.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar la propiedad porque tiene vistas o favoritos asociados' 
                });
            }

            await pool.query('DELETE FROM properties WHERE id = ?', [id]);

            res.json({ message: 'Propiedad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar propiedad:', error);
            res.status(500).json({ message: 'Error al eliminar propiedad' });
        }
    },

    // Obtener propiedades por inmobiliaria
    async getPropertiesByRealEstate(req: Request, res: Response) {
        try {
            const { realEstateId } = req.params;
            const [properties] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.real_estate_id = ?
                ORDER BY p.created_at DESC`,
                [realEstateId]
            );

            res.json(properties as PropertyWithDetails[]);
        } catch (error) {
            console.error('Error al obtener propiedades de la inmobiliaria:', error);
            res.status(500).json({ message: 'Error al obtener propiedades de la inmobiliaria' });
        }
    },

    // Obtener propiedades por proyecto
    async getPropertiesByProject(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const [properties] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.project_id = ?
                ORDER BY p.created_at DESC`,
                [projectId]
            );

            res.json(properties as PropertyWithDetails[]);
        } catch (error) {
            console.error('Error al obtener propiedades del proyecto:', error);
            res.status(500).json({ message: 'Error al obtener propiedades del proyecto' });
        }
    },

    // Obtener propiedades por agente
    async getPropertiesByAgent(req: Request, res: Response) {
        try {
            const { agentId } = req.params;
            const [properties] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    pr.name as project_name,
                    u.name as agent_name
                FROM properties p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN projects pr ON p.project_id = pr.id
                LEFT JOIN agents a ON p.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE p.agent_id = ?
                ORDER BY p.created_at DESC`,
                [agentId]
            );

            res.json(properties as PropertyWithDetails[]);
        } catch (error) {
            console.error('Error al obtener propiedades del agente:', error);
            res.status(500).json({ message: 'Error al obtener propiedades del agente' });
        }
    },

    // Obtener estadísticas de propiedades
    async getPropertyStats(req: Request, res: Response) {
        try {
            const [stats] = await pool.query<RowDataPacket[]>(
                `SELECT 
                    COUNT(*) as total_properties,
                    COUNT(DISTINCT real_estate_id) as total_real_estates,
                    COUNT(DISTINCT project_id) as total_projects,
                    COUNT(DISTINCT agent_id) as total_agents,
                    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_properties,
                    SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_properties,
                    SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved_properties
                FROM properties`
            );

            res.json(stats[0]);
        } catch (error) {
            console.error('Error al obtener estadísticas de propiedades:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas de propiedades' });
        }
    }
}; 