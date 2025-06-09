import { Router } from 'express';
import { propertyViewController } from '../controllers/propertyViewController';

const router = Router();

/**
 * @swagger
 * /api/property-views:
 *   get:
 *     summary: Obtener todas las visitas
 *     tags: [Visitas]
 *     responses:
 *       200:
 *         description: Lista de visitas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyViewWithDetails'
 */
router.get('/', propertyViewController.getAllViews);

/**
 * @swagger
 * /api/property-views/{id}:
 *   get:
 *     summary: Obtener una visita por ID
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visita
 *     responses:
 *       200:
 *         description: Visita encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyViewWithDetails'
 *       404:
 *         description: Visita no encontrada
 */
router.get('/:id', propertyViewController.getViewById);

/**
 * @swagger
 * /api/property-views:
 *   post:
 *     summary: Crear una nueva visita
 *     tags: [Visitas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyViewCreate'
 *     responses:
 *       201:
 *         description: Visita creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Propiedad, cliente o agente no encontrado
 */
router.post('/', propertyViewController.createView);

/**
 * @swagger
 * /api/property-views/{id}:
 *   put:
 *     summary: Actualizar una visita existente
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyViewUpdate'
 *     responses:
 *       200:
 *         description: Visita actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Visita no encontrada
 */
router.put('/:id', propertyViewController.updateView);

/**
 * @swagger
 * /api/property-views/{id}:
 *   delete:
 *     summary: Eliminar una visita
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la visita
 *     responses:
 *       200:
 *         description: Visita eliminada exitosamente
 *       404:
 *         description: Visita no encontrada
 */
router.delete('/:id', propertyViewController.deleteView);

/**
 * @swagger
 * /api/property-views/property/{propertyId}:
 *   get:
 *     summary: Obtener visitas por propiedad
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propiedad
 *     responses:
 *       200:
 *         description: Lista de visitas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyViewWithDetails'
 */
router.get('/property/:propertyId', propertyViewController.getViewsByProperty);

/**
 * @swagger
 * /api/property-views/client/{clientId}:
 *   get:
 *     summary: Obtener visitas por cliente
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de visitas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyViewWithDetails'
 */
router.get('/client/:clientId', propertyViewController.getViewsByClient);

/**
 * @swagger
 * /api/property-views/agent/{agentId}:
 *   get:
 *     summary: Obtener visitas por agente
 *     tags: [Visitas]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del agente
 *     responses:
 *       200:
 *         description: Lista de visitas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyViewWithDetails'
 */
router.get('/agent/:agentId', propertyViewController.getViewsByAgent);

export default router; 