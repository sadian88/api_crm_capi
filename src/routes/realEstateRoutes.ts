import { Router } from 'express';
import { realEstateController } from '../controllers/realEstateController';

const router = Router();

/**
 * @swagger
 * /api/real-estates:
 *   get:
 *     summary: Obtener todas las inmobiliarias
 *     tags: [RealEstates]
 *     responses:
 *       200:
 *         description: Lista de inmobiliarias obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', realEstateController.getAllRealEstates);

/**
 * @swagger
 * /api/real-estates/{id}:
 *   get:
 *     summary: Obtener una inmobiliaria por ID
 *     tags: [RealEstates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inmobiliaria encontrada
 *       404:
 *         description: Inmobiliaria no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', realEstateController.getRealEstateById);

/**
 * @swagger
 * /api/real-estates:
 *   post:
 *     summary: Crear una nueva inmobiliaria
 *     tags: [RealEstates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inmobiliaria creada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/', realEstateController.createRealEstate);

/**
 * @swagger
 * /api/real-estates/{id}:
 *   put:
 *     summary: Actualizar una inmobiliaria
 *     tags: [RealEstates]
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
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inmobiliaria actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', realEstateController.updateRealEstate);

/**
 * @swagger
 * /api/real-estates/{id}:
 *   delete:
 *     summary: Eliminar una inmobiliaria
 *     tags: [RealEstates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inmobiliaria eliminada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', realEstateController.deleteRealEstate);

/**
 * @swagger
 * /api/real-estates/{id}/stats:
 *   get:
 *     summary: Obtener estadísticas de la inmobiliaria
 *     tags: [RealEstates]
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
 *                 total_projects:
 *                   type: number
 *                 total_properties:
 *                   type: number
 *                 properties_by_status:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/stats', realEstateController.getRealEstateStats);

export default router; 