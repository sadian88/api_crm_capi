import { Request, Response } from 'express';
import { pool } from '../db/db';
import { Client, ClientCreate, ClientUpdate, ClientWithDetails } from '../models/Client';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const clientController = {
    // Obtener todos los clientes
    async getAllClients(req: Request, res: Response) {
        try {
            const [clients] = await pool.query<RowDataPacket[]>(
                `SELECT c.*, 
                    a.name as agent_name,
                    a.email as agent_email,
                    a.phone as agent_phone,
                    re.name as real_estate_name,
                    (SELECT COUNT(*) FROM client_interactions WHERE client_id = c.id) as total_interactions
                FROM clients c
                LEFT JOIN agents ag ON c.agent_id = ag.id
                LEFT JOIN users a ON ag.user_id = a.id
                LEFT JOIN real_estates re ON c.real_estate_id = re.id
                ORDER BY c.created_at DESC`
            );
            res.json(clients as ClientWithDetails[]);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            res.status(500).json({ message: 'Error al obtener clientes' });
        }
    },

    // Obtener un cliente por ID
    async getClientById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const [clients] = await pool.query<RowDataPacket[]>(
                `SELECT c.*, 
                    a.name as agent_name,
                    a.email as agent_email,
                    a.phone as agent_phone,
                    re.name as real_estate_name,
                    (SELECT COUNT(*) FROM client_interactions WHERE client_id = c.id) as total_interactions
                FROM clients c
                LEFT JOIN agents ag ON c.agent_id = ag.id
                LEFT JOIN users a ON ag.user_id = a.id
                LEFT JOIN real_estates re ON c.real_estate_id = re.id
                WHERE c.id = ?`,
                [id]
            );

            if (!clients.length) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.json(clients[0] as ClientWithDetails);
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            res.status(500).json({ message: 'Error al obtener cliente' });
        }
    },

    // Crear un nuevo cliente
    async createClient(req: Request, res: Response) {
        try {
            const clientData: ClientCreate = req.body;

            // Verificar si el agente existe
            const [agents] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM agents WHERE id = ?',
                [clientData.agent_id]
            );

            if (!agents.length) {
                return res.status(404).json({ message: 'Agente no encontrado' });
            }

            // Verificar si la inmobiliaria existe
            const [realEstates] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM real_estates WHERE id = ?',
                [clientData.real_estate_id]
            );

            if (!realEstates.length) {
                return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
            }

            // Verificar si el documento ya está registrado
            const [existingDocuments] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM clients WHERE document_type = ? AND document_number = ?',
                [clientData.document_type, clientData.document_number]
            );

            if (existingDocuments.length > 0) {
                return res.status(400).json({ message: 'El número de documento ya está registrado' });
            }

            // Insertar cliente
            const [result] = await pool.query<ResultSetHeader>(
                `INSERT INTO clients (
                    id,
                    name,
                    email,
                    phone,
                    document_type,
                    document_number,
                    address,
                    real_estate_id,
                    agent_id,
                    status
                ) VALUES (
                    UUID(),
                    ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                [
                    clientData.name,
                    clientData.email,
                    clientData.phone,
                    clientData.document_type,
                    clientData.document_number,
                    clientData.address,
                    clientData.real_estate_id,
                    clientData.agent_id,
                    clientData.status || 'active'
                ]
            );

            const [newClient] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM clients WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newClient[0] as Client);
        } catch (error) {
            console.error('Error al crear cliente:', error);
            res.status(500).json({ message: 'Error al crear cliente' });
        }
    },

    // Actualizar un cliente
    async updateClient(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const clientData: ClientUpdate = req.body;

            // Verificar si el cliente existe
            const [clients] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM clients WHERE id = ?',
                [id]
            );

            if (!clients.length) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // Verificar si el agente existe si se proporciona
            if (clientData.agent_id) {
                const [agents] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM agents WHERE id = ?',
                    [clientData.agent_id]
                );

                if (!agents.length) {
                    return res.status(404).json({ message: 'Agente no encontrado' });
                }
            }

            // Verificar si la inmobiliaria existe si se proporciona
            if (clientData.real_estate_id) {
                const [realEstates] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM real_estates WHERE id = ?',
                    [clientData.real_estate_id]
                );

                if (!realEstates.length) {
                    return res.status(404).json({ message: 'Inmobiliaria no encontrada' });
                }
            }

            // Verificar si el documento ya está registrado si se proporciona
            if (clientData.document_number && clientData.document_type) {
                const [existingDocuments] = await pool.query<RowDataPacket[]>(
                    'SELECT id FROM clients WHERE document_type = ? AND document_number = ? AND id != ?',
                    [clientData.document_type, clientData.document_number, id]
                );

                if (existingDocuments.length > 0) {
                    return res.status(400).json({ message: 'El número de documento ya está registrado' });
                }
            }

            // Actualizar cliente
            const [result] = await pool.query<ResultSetHeader>(
                `UPDATE clients 
                SET name = ?,
                    email = ?,
                    phone = ?,
                    document_type = ?,
                    document_number = ?,
                    address = ?,
                    real_estate_id = ?,
                    agent_id = ?,
                    status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    clientData.name,
                    clientData.email,
                    clientData.phone,
                    clientData.document_type,
                    clientData.document_number,
                    clientData.address,
                    clientData.real_estate_id,
                    clientData.agent_id,
                    clientData.status,
                    id
                ]
            );

            const [updatedClient] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM clients WHERE id = ?',
                [id]
            );

            res.json(updatedClient[0] as Client);
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            res.status(500).json({ message: 'Error al actualizar cliente' });
        }
    },

    // Eliminar un cliente
    async deleteClient(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar si hay interacciones asociadas
            const [interactions] = await pool.query<RowDataPacket[]>(
                'SELECT id FROM client_interactions WHERE client_id = ?',
                [id]
            );

            if (interactions.length > 0) {
                return res.status(400).json({ 
                    message: 'No se puede eliminar el cliente porque tiene interacciones asociadas' 
                });
            }

            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM clients WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            res.status(500).json({ message: 'Error al eliminar cliente' });
        }
    },

    // Obtener clientes por agente
    async getClientsByAgent(req: Request, res: Response) {
        try {
            const { agentId } = req.params;
            const [clients] = await pool.query<RowDataPacket[]>(
                `SELECT c.*, 
                    a.name as agent_name,
                    a.email as agent_email,
                    a.phone as agent_phone,
                    re.name as real_estate_name,
                    (SELECT COUNT(*) FROM client_interactions WHERE client_id = c.id) as total_interactions
                FROM clients c
                LEFT JOIN agents ag ON c.agent_id = ag.id
                LEFT JOIN users a ON ag.user_id = a.id
                LEFT JOIN real_estates re ON c.real_estate_id = re.id
                WHERE c.agent_id = ?
                ORDER BY c.created_at DESC`,
                [agentId]
            );

            res.json(clients as ClientWithDetails[]);
        } catch (error) {
            console.error('Error al obtener clientes del agente:', error);
            res.status(500).json({ message: 'Error al obtener clientes del agente' });
        }
    },

    // Obtener clientes por usuario
    async getClientsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const [clients] = await pool.query<RowDataPacket[]>(
                `SELECT c.*, 
                    a.name as agent_name,
                    a.email as agent_email,
                    a.phone as agent_phone,
                    re.name as real_estate_name,
                    (SELECT COUNT(*) FROM client_interactions WHERE client_id = c.id) as total_interactions
                FROM clients c
                LEFT JOIN agents ag ON c.agent_id = ag.id
                LEFT JOIN users a ON ag.user_id = a.id
                LEFT JOIN real_estates re ON c.real_estate_id = re.id
                WHERE ag.user_id = ?
                ORDER BY c.created_at DESC`,
                [userId]
            );

            res.json(clients as ClientWithDetails[]);
        } catch (error) {
            console.error('Error al obtener clientes del usuario:', error);
            res.status(500).json({ message: 'Error al obtener clientes del usuario' });
        }
    },

    // Obtener estadísticas de clientes
    async getClientStats(req: Request, res: Response) {
        try {
            // Obtener total de clientes por estado
            const [clientsByStatus] = await pool.query<RowDataPacket[]>(
                `SELECT status, COUNT(*) as total
                FROM clients
                GROUP BY status`
            );

            // Obtener total de clientes por tipo de documento
            const [clientsByDocumentType] = await pool.query<RowDataPacket[]>(
                `SELECT document_type, COUNT(*) as total
                FROM clients
                GROUP BY document_type`
            );

            // Obtener total de clientes por inmobiliaria
            const [clientsByRealEstate] = await pool.query<RowDataPacket[]>(
                `SELECT re.name as real_estate_name, COUNT(c.id) as total
                FROM clients c
                JOIN real_estates re ON c.real_estate_id = re.id
                GROUP BY re.id, re.name`
            );

            res.json({
                byStatus: clientsByStatus,
                byDocumentType: clientsByDocumentType,
                byRealEstate: clientsByRealEstate
            });
        } catch (error) {
            console.error('Error al obtener estadísticas de clientes:', error);
            res.status(500).json({ message: 'Error al obtener estadísticas de clientes' });
        }
    }
}; 