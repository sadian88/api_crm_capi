import { Router } from 'express';
import { agentController } from '../controllers/agentController';

const router = Router();

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: Obtener todos los agentes
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: Lista de agentes obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', agentController.getAllAgents);

/**
 * @swagger
 * /api/agents/{id}:
 *   get:
 *     summary: Obtener un agente por ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       404:
 *         description: Agente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', agentController.getAgentById);

/**
 * @swagger
 * /api/agents:
 *   post:
 *     summary: Crear un nuevo agente
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agente creado exitosamente
 *       400:
 *         description: El usuario ya es un agente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', agentController.createAgent);

/**
 * @swagger
 * /api/agents/{id}:
 *   put:
 *     summary: Actualizar un agente
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agente actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', agentController.updateAgent);

/**
 * @swagger
 * /api/agents/{id}:
 *   delete:
 *     summary: Eliminar un agente
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agente eliminado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', agentController.deleteAgent);

/**
 * @swagger
 * /api/agents/{id}/stats:
 *   get:
 *     summary: Obtener estadísticas del agente
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_leads:
 *                   type: number
 *                 leads_by_status:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: number
 *                 total_visits:
 *                   type: number
 *                 total_interactions:
 *                   type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/stats', agentController.getAgentStats);

export default router; 