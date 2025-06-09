import { Request, Response } from 'express';
import { pool } from '../db/db';
import { ClientInteraction, ClientInteractionCreate, ClientInteractionUpdate, ClientInteractionWithDetails } from '../models/ClientInteraction';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const clientInteractionController = {
    // Obtener todas las interacciones
    async getAllInteractions(req: Request, res: Response) {
        try {
            const [interactions] = await pool.query<RowDataPacket[]>(
                `SELECT ci.*, 
                    c.document_number as client_document,
                    u.username as agent_name,
                    p.title as property_title
                FROM client_interactions ci
                LEFT JOIN clients c ON ci.client_id = c.id
                LEFT JOIN agents a ON ci.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN properties p ON ci.property_id = p.id
                ORDER BY ci.created_at DESC`
            );
            res.json(interactions as ClientInteractionWithDetails[]);
        } catch (error) {
            console.error('Error al obtener interacciones:', error);
            res.status(500).json({ message: 'Error al obtener interacciones' });
        }
    },

    // Obtener una interacción por ID
    async getInteractionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [interactions] = await pool.query<RowDataPacket[]>(
                `SELECT ci.*, 
                    c.document_number as client_document,
                    u.username as agent_name,
                    p.title as property_title
                FROM client_interactions ci
                LEFT JOIN clients c ON ci.client_id = c.id
                LEFT JOIN agents a ON ci.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN properties p ON ci.property_id = p.id
                WHERE ci.id = ?`,
                [id]
            );

            if (!interactions.length) {
                return res.status(404).json({ message: 'Interacción no encontrada' });
            }

            res.json(interactions[0] as ClientInteractionWithDetails);
        } catch (error) {
            console.error('Error al obtener interacción:', error);
            res.status(500).json({ message: 'Error al obtener interacción' });
        }
    },

    // Crear una nueva interacción
    async createInteraction(req: Request, res: Response) {
        try {
            const interactionData: ClientInteractionCreate = req.body;

            // Verificar si el cliente existe
            const [clients] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM clients WHERE id = ?',
                [interactionData.client_id]
            );

            if (!clients.length) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // Verificar si el agente existe
            const [agents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE id = ?',
                [interactionData.agent_id]
            );

            if (!agents.length) {
                return res.status(404).json({ message: 'Agente no encontrado' });
            }

            // Verificar si la propiedad existe si se proporciona
            if (interactionData.property_id) {
                const [properties] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM properties WHERE id = ?',
                    [interactionData.property_id]
                );

                if (!properties.length) {
                    return res.status(404).json({ message: 'Propiedad no encontrada' });
                }
            }

            // Insertar interacción
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO client_interactions (
                    id, client_id, agent_id, property_id, 
                    type, status, notes, created_at, updated_at
                ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [
                    interactionData.client_id,
                    interactionData.agent_id,
                    interactionData.property_id || null,
                    interactionData.type,
                    interactionData.status,
                    interactionData.notes || null
                ]
            );

            const [newInteraction] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM client_interactions WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newInteraction[0] as ClientInteraction);
        } catch (error) {
            console.error('Error al crear interacción:', error);
            res.status(500).json({ message: 'Error al crear interacción' });
        }
    },

    // Actualizar una interacción
    async updateInteraction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const interactionData: ClientInteractionUpdate = req.body;

            // Verificar si la interacción existe
            const [interactions] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM client_interactions WHERE id = ?',
                [id]
            );

            if (!interactions.length) {
                return res.status(404).json({ message: 'Interacción no encontrada' });
            }

            // Verificar si el cliente existe si se proporciona
            if (interactionData.client_id) {
                const [clients] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM clients WHERE id = ?',
                    [interactionData.client_id]
                );

                if (!clients.length) {
                    return res.status(404).json({ message: 'Cliente no encontrado' });
                }
            }

            // Verificar si el agente existe si se proporciona
            if (interactionData.agent_id) {
                const [agents] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM agents WHERE id = ?',
                    [interactionData.agent_id]
                );

                if (!agents.length) {
                    return res.status(404).json({ message: 'Agente no encontrado' });
                }
            }

            // Verificar si la propiedad existe si se proporciona
            if (interactionData.property_id) {
                const [properties] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM properties WHERE id = ?',
                    [interactionData.property_id]
                );

                if (!properties.length) {
                    return res.status(404).json({ message: 'Propiedad no encontrada' });
                }
            }

            // Actualizar interacción
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE client_interactions 
                SET client_id = COALESCE(?, client_id),
                    agent_id = COALESCE(?, agent_id),
                    property_id = ?,
                    type = COALESCE(?, type),
                    status = COALESCE(?, status),
                    notes = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    interactionData.client_id,
                    interactionData.agent_id,
                    interactionData.property_id || null,
                    interactionData.type,
                    interactionData.status,
                    interactionData.notes || null,
                    id
                ]
            );

            const [updatedInteraction] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM client_interactions WHERE id = ?',
                [id]
            );

            res.json(updatedInteraction[0] as ClientInteraction);
        } catch (error) {
            console.error('Error al actualizar interacción:', error);
            res.status(500).json({ message: 'Error al actualizar interacción' });
        }
    },

    // Eliminar una interacción
    async deleteInteraction(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM client_interactions WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Interacción no encontrada' });
            }

            res.json({ message: 'Interacción eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar interacción:', error);
            res.status(500).json({ message: 'Error al eliminar interacción' });
        }
    },

    // Obtener interacciones por cliente
    async getInteractionsByClient(req: Request, res: Response) {
        try {
            const { clientId } = req.params;
            const [interactions] = await pool.query<RowDataPacket[]>(
                `SELECT ci.*, 
                    c.document_number as client_document,
                    u.username as agent_name,
                    p.title as property_title
                FROM client_interactions ci
                LEFT JOIN clients c ON ci.client_id = c.id
                LEFT JOIN agents a ON ci.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN properties p ON ci.property_id = p.id
                WHERE ci.client_id = ?
                ORDER BY ci.created_at DESC`,
                [clientId]
            );

            res.json(interactions as ClientInteractionWithDetails[]);
        } catch (error) {
            console.error('Error al obtener interacciones del cliente:', error);
            res.status(500).json({ message: 'Error al obtener interacciones del cliente' });
        }
    },

    // Obtener interacciones por agente
    async getInteractionsByAgent(req: Request, res: Response) {
        try {
            const { agentId } = req.params;
            const [interactions] = await pool.query<RowDataPacket[]>(
                `SELECT ci.*, 
                    c.document_number as client_document,
                    u.username as agent_name,
                    p.title as property_title
                FROM client_interactions ci
                LEFT JOIN clients c ON ci.client_id = c.id
                LEFT JOIN agents a ON ci.agent_id = a.id
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN properties p ON ci.property_id = p.id
                WHERE ci.agent_id = ?
                ORDER BY ci.created_at DESC`,
                [agentId]
            );

            res.json(interactions as ClientInteractionWithDetails[]);
        } catch (error) {
            console.error('Error al obtener interacciones del agente:', error);
            res.status(500).json({ message: 'Error al obtener interacciones del agente' });
        }
    },

    // Obtener estadísticas de interacciones
    async getInteractionStats(req: Request, res: Response) {
        try {
            const [stats] = await pool.query<RowDataPacket[]>(
                `SELECT 
                    COUNT(*) as total_interactions,
                    COUNT(DISTINCT client_id) as unique_clients,
                    COUNT(DISTINCT agent_id) as unique_agents,
                    COUNT(DISTINCT property_id) as unique_properties,
                    type,
                    status
                FROM client_interactions
                GROUP BY type, status`
            );

            res.json(stats);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas' });
        }
    }
}; 