import { Request, Response } from 'express';
import { pool } from '../db/db';
import { Agent, AgentCreate, AgentUpdate, AgentWithDetails } from '../models/Agent';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const agentController = {
    // Obtener todos los agentes
    async getAllAgents(req: Request, res: Response) {
        try {
            const [agents] = await pool.query<RowDataPacket[]>(
                `SELECT a.*, 
                  u.name as user_name,
                  u.email as user_email,
                  r.name as real_estate_name
                FROM agents a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN real_estates r ON a.real_estate_id = r.id
                ORDER BY a.created_at DESC`
            );
            res.json(agents as AgentWithDetails[]);
        } catch (error) {
            console.error('Error al obtener agentes:', error);
            res.status(500).json({ message: 'Error al obtener agentes' });
        }
    },

    // Obtener un agente por ID
    async getAgentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [agents] = await pool.query<RowDataPacket[]>(
                `SELECT a.*, 
                  u.name as user_name,
                  u.email as user_email,
                  r.name as real_estate_name
                FROM agents a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN real_estates r ON a.real_estate_id = r.id
                WHERE a.id = ?`,
                [id]
            );

            if (!agents.length) {
                return res.status(404).json({ message: 'Agente no encontrado' });
            }

            res.json(agents[0] as AgentWithDetails);
        } catch (error) {
            console.error('Error al obtener agente:', error);
            res.status(500).json({ message: 'Error al obtener agente' });
        }
    },

    // Crear un nuevo agente
    async createAgent(req: Request, res: Response) {
        try {
            const agentData: AgentCreate = req.body;

            // Verificar si el usuario existe
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM users WHERE id = ?',
                [agentData.user_id]
            );

            if (!users.length) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar si ya existe un agente para este usuario
            const [existingAgents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE user_id = ?',
                [agentData.user_id]
            );

            if (existingAgents.length > 0) {
                return res.status(400).json({ message: 'Ya existe un agente para este usuario' });
            }

            // Verificar si la inmobiliaria existe
            if (agentData.real_estate_id) {
                const [realEstates] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM real_estates WHERE id = ?',
                    [agentData.real_estate_id]
                );

                if (!realEstates.length) {
                    return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
                }
            }

            // Insertar agente
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO agents (user_id, real_estate_id, phone) VALUES (?, ?, ?)',
                [agentData.user_id, agentData.real_estate_id, agentData.phone]
            );

            const [newAgent] = await pool.query<RowDataPacket[]>(
                `SELECT a.*, 
                  u.name as user_name,
                  u.email as user_email,
                  r.name as real_estate_name
                FROM agents a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN real_estates r ON a.real_estate_id = r.id
                WHERE a.id = ?`,
                [result.insertId]
            );

            res.status(201).json(newAgent[0] as AgentWithDetails);
        } catch (error) {
            console.error('Error al crear agente:', error);
            res.status(500).json({ message: 'Error al crear agente' });
        }
    },

    // Actualizar un agente
    async updateAgent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const agentData: AgentUpdate = req.body;

            // Verificar si el agente existe
            const [agents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE id = ?',
                [id]
            );

            if (!agents.length) {
                return res.status(404).json({ message: 'Agente no encontrado' });
            }

            // Actualizar agente
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE agents 
                SET user_id = COALESCE(?, user_id),
                    real_estate_id = COALESCE(?, real_estate_id),
                    phone = COALESCE(?, phone),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [agentData.user_id, agentData.real_estate_id, agentData.phone, id]
            );

            const [updatedAgent] = await pool.query<RowDataPacket[]>(
                `SELECT a.*, 
                  u.name as user_name,
                  u.email as user_email,
                  r.name as real_estate_name
                FROM agents a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN real_estates r ON a.real_estate_id = r.id
                WHERE a.id = ?`,
                [id]
            );

            res.json(updatedAgent[0] as AgentWithDetails);
        } catch (error) {
            console.error('Error al actualizar agente:', error);
            res.status(500).json({ message: 'Error al actualizar agente' });
        }
    },

    // Eliminar un agente
    async deleteAgent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM agents WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Agente no encontrado' });
            }

            res.json({ message: 'Agente eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar agente:', error);
            res.status(500).json({ message: 'Error al eliminar agente' });
        }
    },

    // Obtener agentes por inmobiliaria
    async getAgentsByRealEstate(req: Request, res: Response) {
        try {
            const { realEstateId } = req.params;
            const [agents] = await pool.query<RowDataPacket[]>(
                `SELECT a.*, 
                  u.name as user_name,
                  u.email as user_email,
                  r.name as real_estate_name
                FROM agents a
                LEFT JOIN users u ON a.user_id = u.id
                LEFT JOIN real_estates r ON a.real_estate_id = r.id
                WHERE a.real_estate_id = ?
                ORDER BY a.created_at DESC`,
                [realEstateId]
            );

            res.json(agents as AgentWithDetails[]);
        } catch (error) {
            console.error('Error al obtener agentes de la inmobiliaria:', error);
            res.status(500).json({ message: 'Error al obtener agentes de la inmobiliaria' });
        }
    },

    // Obtener estadísticas del agente
    async getAgentStats(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Total de clientes asignados
            const [clientsResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_clients FROM clients WHERE agent_id = ?',
                [id]
            );

            // Total de visitas
            const [visitsResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_visits FROM property_views WHERE agent_id = ?',
                [id]
            );

            // Total de interacciones
            const [interactionsResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as total_interactions FROM client_interactions WHERE agent_id = ?',
                [id]
            );

            res.json({
                total_clients: parseInt(clientsResult[0]?.total_clients || '0'),
                total_visits: parseInt(visitsResult[0]?.total_visits || '0'),
                total_interactions: parseInt(interactionsResult[0]?.total_interactions || '0')
            });
        } catch (error) {
            console.error('Error al obtener estadísticas del agente:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas del agente' });
        }
    }
}; 