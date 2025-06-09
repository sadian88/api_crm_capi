import { Router } from 'express';
import { propertyController } from '../controllers/propertyController';

const router = Router();

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Obtener todas las propiedades
 *     tags: [Propiedades]
 *     responses:
 *       200:
 *         description: Lista de propiedades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyWithDetails'
 */
router.get('/', propertyController.getAllProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Obtener una propiedad por ID
 *     tags: [Propiedades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propiedad
 *     responses:
 *       200:
 *         description: Propiedad encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyWithDetails'
 *       404:
 *         description: Propiedad no encontrada
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Crear una nueva propiedad
 *     tags: [Propiedades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyCreate'
 *     responses:
 *       201:
 *         description: Propiedad creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Inmobiliaria no encontrada
 */
router.post('/', propertyController.createProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Actualizar una propiedad existente
 *     tags: [Propiedades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propiedad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyUpdate'
 *     responses:
 *       200:
 *         description: Propiedad actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Propiedad no encontrada
 */
router.put('/:id', propertyController.updateProperty);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Eliminar una propiedad
 *     tags: [Propiedades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la propiedad
 *     responses:
 *       200:
 *         description: Propiedad eliminada exitosamente
 *       404:
 *         description: Propiedad no encontrada
 */
router.delete('/:id', propertyController.deleteProperty);

/**
 * @swagger
 * /api/properties/real-estate/{realEstateId}:
 *   get:
 *     summary: Obtener propiedades por inmobiliaria
 *     tags: [Propiedades]
 *     parameters:
 *       - in: path
 *         name: realEstateId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inmobiliaria
 *     responses:
 *       200:
 *         description: Lista de propiedades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyWithDetails'
 */
router.get('/real-estate/:realEstateId', propertyController.getPropertiesByRealEstate);

/**
 * @swagger
 * /api/properties/agent/{agentId}:
 *   get:
 *     summary: Obtener propiedades por agente
 *     tags: [Propiedades]
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del agente
 *     responses:
 *       200:
 *         description: Lista de propiedades obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyWithDetails'
 */
router.get('/agent/:agentId', propertyController.getPropertiesByAgent);

export default router; 