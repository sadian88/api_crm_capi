import { Router } from 'express';
import { clientInteractionController } from '../controllers/clientInteractionController';

const router = Router();

/**
 * @swagger
 * /api/client-interactions:
 *   get:
 *     summary: Obtener todas las interacciones
 *     tags: [Interacciones]
 *     responses:
 *       200:
 *         description: Lista de interacciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientInteractionWithDetails'
 */
router.get('/', clientInteractionController.getAllInteractions);

/**
 * @swagger
 * /api/client-interactions/{id}:
 *   get:
 *     summary: Obtener una interacción por ID
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción
 *     responses:
 *       200:
 *         description: Interacción encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientInteractionWithDetails'
 *       404:
 *         description: Interacción no encontrada
 */
router.get('/:id', clientInteractionController.getInteractionById);

/**
 * @swagger
 * /api/client-interactions:
 *   post:
 *     summary: Crear una nueva interacción
 *     tags: [Interacciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInteractionCreate'
 *     responses:
 *       201:
 *         description: Interacción creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente o agente no encontrado
 */
router.post('/', clientInteractionController.createInteraction);

/**
 * @swagger
 * /api/client-interactions/{id}:
 *   put:
 *     summary: Actualizar una interacción existente
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInteractionUpdate'
 *     responses:
 *       200:
 *         description: Interacción actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Interacción no encontrada
 */
router.put('/:id', clientInteractionController.updateInteraction);

/**
 * @swagger
 * /api/client-interactions/{id}:
 *   delete:
 *     summary: Eliminar una interacción
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la interacción
 *     responses:
 *       200:
 *         description: Interacción eliminada exitosamente
 *       404:
 *         description: Interacción no encontrada
 */
router.delete('/:id', clientInteractionController.deleteInteraction);

/**
 * @swagger
 * /api/client-interactions/client/{clientId}:
 *   get:
 *     summary: Obtener interacciones por cliente
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de interacciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientInteractionWithDetails'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/client/:clientId', clientInteractionController.getInteractionsByClient);

/**
 * @swagger
 * /api/client-interactions/agent/{agentId}:
 *   get:
 *     summary: Obtener interacciones por agente
 *     tags: [Interacciones]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del agente
 *     responses:
 *       200:
 *         description: Lista de interacciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientInteractionWithDetails'
 *       404:
 *         description: Agente no encontrado
 */
router.get('/agent/:agentId', clientInteractionController.getInteractionsByAgent);

export default router; 