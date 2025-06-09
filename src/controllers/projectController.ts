import { Request, Response } from 'express';
import { pool } from '../db';
import { Project, ProjectCreate, ProjectUpdate, ProjectWithDetails } from '../models/Project';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const projectController = {
    // Obtener todos los proyectos
    async getAllProjects(req: Request, res: Response) {
        try {
            const [projects] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    COUNT(DISTINCT pr.id) as total_properties
                FROM projects p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN properties pr ON p.id = pr.project_id
                GROUP BY p.id
                ORDER BY p.created_at DESC`
            );
            res.json(projects as ProjectWithDetails[]);
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            res.status(500).json({ message: 'Error al obtener proyectos' });
        }
    },

    // Obtener un proyecto por ID
    async getProjectById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [projects] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    COUNT(DISTINCT pr.id) as total_properties
                FROM projects p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                LEFT JOIN properties pr ON p.id = pr.project_id
                WHERE p.id = ?
                GROUP BY p.id`,
                [id]
            );

            if (!projects.length) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }

            res.json(projects[0] as ProjectWithDetails);
        } catch (error) {
            console.error('Error al obtener proyecto:', error);
            res.status(500).json({ message: 'Error al obtener proyecto' });
        }
    },

    // Crear un nuevo proyecto
    async createProject(req: Request, res: Response) {
        try {
            const projectData: ProjectCreate = req.body;

            // Verificar si la inmobiliaria existe
            const [realEstates] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM real_estates WHERE id = ?',
                [projectData.real_estate_id]
            );

            if (!realEstates.length) {
                return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
            }

            // Insertar proyecto
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO projects (name, description, real_estate_id, status) VALUES (?, ?, ?, ?)',
                [
                    projectData.name,
                    projectData.description,
                    projectData.real_estate_id,
                    projectData.status
                ]
            );

            const [newProject] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM projects WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newProject[0] as Project);
        } catch (error) {
            console.error('Error al crear proyecto:', error);
            res.status(500).json({ message: 'Error al crear proyecto' });
        }
    },

    // Actualizar un proyecto
    async updateProject(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const projectData: ProjectUpdate = req.body;

            // Verificar si el proyecto existe
            const [projects] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM projects WHERE id = ?',
                [id]
            );

            if (!projects.length) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }

            // Verificar si la inmobiliaria existe si se proporciona
            if (projectData.real_estate_id) {
                const [realEstates] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM real_estates WHERE id = ?',
                    [projectData.real_estate_id]
                );

                if (!realEstates.length) {
                    return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
                }
            }

            // Actualizar proyecto
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE projects 
                SET name = COALESCE(?, name),
                    description = COALESCE(?, description),
                    real_estate_id = COALESCE(?, real_estate_id),
                    status = COALESCE(?, status),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    projectData.name,
                    projectData.description,
                    projectData.real_estate_id,
                    projectData.status,
                    id
                ]
            );

            const [updatedProject] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM projects WHERE id = ?',
                [id]
            );

            res.json(updatedProject[0] as Project);
        } catch (error) {
            console.error('Error al actualizar proyecto:', error);
            res.status(500).json({ message: 'Error al actualizar proyecto' });
        }
    },

    // Eliminar un proyecto
    async deleteProject(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si hay propiedades asociadas
            const [properties] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM properties WHERE project_id = ?',
                [id]
            );

            if (properties.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar el proyecto porque tiene propiedades asociadas' 
                });
            }

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM projects WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }

            res.json({ message: 'Proyecto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            res.status(500).json({ message: 'Error al eliminar proyecto' });
        }
    },

    // Obtener estadísticas del proyecto
    async getProjectStats(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Obtener total de propiedades por estado
            const [propertiesByStatus] = await pool.query<RowDataPacket[]>(
                `SELECT status, COUNT(*) as count 
                 FROM properties 
                 WHERE project_id = ? 
                 GROUP BY status`,
                [id]
            );

            // Obtener total de propiedades
            const [totalProperties] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM properties WHERE project_id = ?',
                [id]
            );

            res.json({
                properties_by_status: propertiesByStatus,
                total_properties: parseInt(totalProperties[0]?.total || '0')
            });
        } catch (error) {
            console.error('Error al obtener estadísticas del proyecto:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas del proyecto' });
        }
    },

    // Obtener proyectos por inmobiliaria
    async getProjectsByRealEstate(req: Request, res: Response) {
        try {
            const { realEstateId } = req.params;
            const [projects] = await pool.query<RowDataPacket[]>(
                `SELECT p.*, 
                    r.name as real_estate_name,
                    (SELECT COUNT(*) FROM properties WHERE project_id = p.id) as total_properties
                FROM projects p
                LEFT JOIN real_estates r ON p.real_estate_id = r.id
                WHERE p.real_estate_id = ?
                ORDER BY p.created_at DESC`,
                [realEstateId]
            );

            res.json(projects as ProjectWithDetails[]);
        } catch (error) {
            console.error('Error al obtener proyectos de la inmobiliaria:', error);
            res.status(500).json({ message: 'Error al obtener proyectos de la inmobiliaria' });
        }
    }
}; 