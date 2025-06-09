import { Request, Response } from 'express';
import { pool } from '../db/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { PropertyView, PropertyViewCreate, PropertyViewUpdate, PropertyViewWithDetails } from '../models/PropertyView';

// Obtener todas las vistas de propiedades
export const getAllViews = async (req: Request, res: Response) => {
    try {
        const [views] = await pool.query<RowDataPacket[]>(`
            SELECT pv.*, 
                   p.title as property_title, 
                   p.address as property_address,
                   p.type as property_type,
                   p.status as property_status,
                   u.name as user_name,
                   u.email as user_email,
                   u.phone as user_phone,
                   c.name as client_name,
                   c.email as client_email,
                   c.phone as client_phone,
                   a.name as agent_name,
                   a.email as agent_email,
                   a.phone as agent_phone
            FROM property_views pv
            LEFT JOIN properties p ON pv.property_id = p.id
            LEFT JOIN users u ON pv.user_id = u.id
            LEFT JOIN clients c ON pv.client_id = c.id
            LEFT JOIN agents ag ON pv.agent_id = ag.id
            LEFT JOIN users a ON ag.user_id = a.id
            ORDER BY pv.view_date DESC
        `);

        res.json(views as PropertyViewWithDetails[]);
    } catch (error) {
        console.error('Error al obtener las vistas:', error);
        res.status(500).json({ message: 'Error al obtener las vistas de propiedades' });
    }
};

// Obtener una vista por ID
export const getViewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [views] = await pool.query<RowDataPacket[]>(`
            SELECT pv.*, 
                   p.title as property_title, 
                   p.address as property_address,
                   p.type as property_type,
                   p.status as property_status,
                   u.name as user_name,
                   u.email as user_email,
                   u.phone as user_phone,
                   c.name as client_name,
                   c.email as client_email,
                   c.phone as client_phone,
                   a.name as agent_name,
                   a.email as agent_email,
                   a.phone as agent_phone
            FROM property_views pv
            LEFT JOIN properties p ON pv.property_id = p.id
            LEFT JOIN users u ON pv.user_id = u.id
            LEFT JOIN clients c ON pv.client_id = c.id
            LEFT JOIN agents ag ON pv.agent_id = ag.id
            LEFT JOIN users a ON ag.user_id = a.id
            WHERE pv.id = ?
        `, [id]);

        if (views.length === 0) {
            return res.status(404).json({ message: 'Vista no encontrada' });
        }

        res.json(views[0] as PropertyViewWithDetails);
    } catch (error) {
        console.error('Error al obtener la vista:', error);
        res.status(500).json({ message: 'Error al obtener la vista de la propiedad' });
    }
};

// Crear una nueva vista
export const createView = async (req: Request, res: Response) => {
    try {
        const viewData: PropertyViewCreate = req.body;
        const [result] = await pool.query<ResultSetHeader>(`
            INSERT INTO property_views (
                id,
                property_id, 
                user_id, 
                client_id, 
                agent_id, 
                source, 
                ip_address, 
                view_date,
                created_at, 
                updated_at
            ) VALUES (
                UUID(),
                ?, ?, ?, ?, ?, ?, 
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP, 
                CURRENT_TIMESTAMP
            )
        `, [
            viewData.property_id,
            viewData.user_id || null,
            viewData.client_id || null,
            viewData.agent_id || null,
            viewData.source,
            viewData.ip_address
        ]);

        const [newView] = await pool.query<RowDataPacket[]>(`
            SELECT * FROM property_views WHERE id = ?
        `, [result.insertId]);

        res.status(201).json(newView[0] as PropertyView);
    } catch (error) {
        console.error('Error al crear la vista:', error);
        res.status(500).json({ message: 'Error al crear la vista de la propiedad' });
    }
};

// Actualizar una vista
export const updateView = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const viewData: PropertyViewUpdate = req.body;
        const [result] = await pool.query<ResultSetHeader>(`
            UPDATE property_views 
            SET property_id = ?,
                user_id = ?,
                client_id = ?,
                agent_id = ?,
                source = ?,
                ip_address = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            viewData.property_id || null,
            viewData.user_id || null,
            viewData.client_id || null,
            viewData.agent_id || null,
            viewData.source || null,
            viewData.ip_address || null,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vista no encontrada' });
        }

        const [updatedView] = await pool.query<RowDataPacket[]>(`
            SELECT * FROM property_views WHERE id = ?
        `, [id]);

        res.json(updatedView[0] as PropertyView);
    } catch (error) {
        console.error('Error al actualizar la vista:', error);
        res.status(500).json({ message: 'Error al actualizar la vista de la propiedad' });
    }
};

// Eliminar una vista
export const deleteView = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query<ResultSetHeader>(`
            DELETE FROM property_views WHERE id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vista no encontrada' });
        }

        res.json({ message: 'Vista eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la vista:', error);
        res.status(500).json({ message: 'Error al eliminar la vista de la propiedad' });
    }
};

// Obtener vistas por propiedad
export const getViewsByProperty = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const [views] = await pool.query<RowDataPacket[]>(`
            SELECT pv.*, 
                   p.title as property_title, 
                   p.address as property_address,
                   p.type as property_type,
                   p.status as property_status,
                   u.name as user_name,
                   u.email as user_email,
                   u.phone as user_phone,
                   c.name as client_name,
                   c.email as client_email,
                   c.phone as client_phone,
                   a.name as agent_name,
                   a.email as agent_email,
                   a.phone as agent_phone
            FROM property_views pv
            LEFT JOIN properties p ON pv.property_id = p.id
            LEFT JOIN users u ON pv.user_id = u.id
            LEFT JOIN clients c ON pv.client_id = c.id
            LEFT JOIN agents ag ON pv.agent_id = ag.id
            LEFT JOIN users a ON ag.user_id = a.id
            WHERE pv.property_id = ?
            ORDER BY pv.view_date DESC
        `, [propertyId]);

        res.json(views as PropertyViewWithDetails[]);
    } catch (error) {
        console.error('Error al obtener las vistas de la propiedad:', error);
        res.status(500).json({ message: 'Error al obtener las vistas de la propiedad' });
    }
};

// Obtener vistas por cliente
export const getViewsByClient = async (req: Request, res: Response) => {
    try {
        const { clientId } = req.params;
        const [views] = await pool.query<RowDataPacket[]>(`
            SELECT pv.*, 
                   p.title as property_title, 
                   p.address as property_address,
                   p.type as property_type,
                   p.status as property_status,
                   u.name as user_name,
                   u.email as user_email,
                   u.phone as user_phone,
                   c.name as client_name,
                   c.email as client_email,
                   c.phone as client_phone,
                   a.name as agent_name,
                   a.email as agent_email,
                   a.phone as agent_phone
            FROM property_views pv
            LEFT JOIN properties p ON pv.property_id = p.id
            LEFT JOIN users u ON pv.user_id = u.id
            LEFT JOIN clients c ON pv.client_id = c.id
            LEFT JOIN agents ag ON pv.agent_id = ag.id
            LEFT JOIN users a ON ag.user_id = a.id
            WHERE pv.client_id = ?
            ORDER BY pv.view_date DESC
        `, [clientId]);

        res.json(views as PropertyViewWithDetails[]);
    } catch (error) {
        console.error('Error al obtener las vistas del cliente:', error);
        res.status(500).json({ message: 'Error al obtener las vistas del cliente' });
    }
};

// Obtener vistas por agente
export const getViewsByAgent = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const [views] = await pool.query<RowDataPacket[]>(`
            SELECT pv.*, 
                   p.title as property_title, 
                   p.address as property_address,
                   p.type as property_type,
                   p.status as property_status,
                   u.name as user_name,
                   u.email as user_email,
                   u.phone as user_phone,
                   c.name as client_name,
                   c.email as client_email,
                   c.phone as client_phone,
                   a.name as agent_name,
                   a.email as agent_email,
                   a.phone as agent_phone
            FROM property_views pv
            LEFT JOIN properties p ON pv.property_id = p.id
            LEFT JOIN users u ON pv.user_id = u.id
            LEFT JOIN clients c ON pv.client_id = c.id
            LEFT JOIN agents ag ON pv.agent_id = ag.id
            LEFT JOIN users a ON ag.user_id = a.id
            WHERE pv.agent_id = ?
            ORDER BY pv.view_date DESC
        `, [agentId]);

        res.json(views as PropertyViewWithDetails[]);
    } catch (error) {
        console.error('Error al obtener las vistas del agente:', error);
        res.status(500).json({ message: 'Error al obtener las vistas del agente' });
    }
};

// Obtener estadísticas de vistas
export const getViewStats = async (req: Request, res: Response) => {
    try {
        const [stats] = await pool.query<RowDataPacket[]>(`
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT property_id) as unique_properties,
                COUNT(DISTINCT client_id) as unique_clients,
                COUNT(DISTINCT agent_id) as unique_agents,
                DATE(view_date) as view_date
            FROM property_views
            GROUP BY DATE(view_date)
            ORDER BY view_date DESC
            LIMIT 30
        `);

        res.json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas de vistas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas de vistas' });
    }
};

export const propertyViewController = {
    getAllViews,
    getViewById,
    createView,
    updateView,
    deleteView,
    getViewsByProperty,
    getViewsByClient,
    getViewsByAgent,
    getViewStats
}; 