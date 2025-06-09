import { Router } from 'express';
import { propertyFavoriteController } from '../controllers/propertyFavoriteController';

const router = Router();

/**
 * @swagger
 * /api/property-favorites:
 *   get:
 *     summary: Obtener todos los favoritos
 *     tags: [Favoritos]
 *     responses:
 *       200:
 *         description: Lista de favoritos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyFavoriteWithDetails'
 *       500:
 *         description: Error al obtener favoritos
 */
router.get('/', propertyFavoriteController.getAllFavorites);

/**
 * @swagger
 * /api/property-favorites/{id}:
 *   get:
 *     summary: Obtener un favorito por ID
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del favorito
 *     responses:
 *       200:
 *         description: Favorito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyFavoriteWithDetails'
 *       404:
 *         description: Favorito no encontrado
 *       500:
 *         description: Error al obtener favorito
 */
router.get('/:id', propertyFavoriteController.getFavoriteById);

/**
 * @swagger
 * /api/property-favorites:
 *   post:
 *     summary: Crear un nuevo favorito
 *     tags: [Favoritos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyFavoriteCreate'
 *     responses:
 *       201:
 *         description: Favorito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyFavorite'
 *       400:
 *         description: Datos inválidos o propiedad ya en favoritos
 *       404:
 *         description: Propiedad o cliente no encontrado
 *       500:
 *         description: Error al crear favorito
 */
router.post('/', propertyFavoriteController.createFavorite);

/**
 * @swagger
 * /api/property-favorites/{id}:
 *   put:
 *     summary: Actualizar un favorito
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del favorito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyFavoriteUpdate'
 *     responses:
 *       200:
 *         description: Favorito actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyFavorite'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Favorito no encontrado
 *       500:
 *         description: Error al actualizar favorito
 */
router.put('/:id', propertyFavoriteController.updateFavorite);

/**
 * @swagger
 * /api/property-favorites/{id}:
 *   delete:
 *     summary: Eliminar un favorito
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del favorito
 *     responses:
 *       200:
 *         description: Favorito eliminado exitosamente
 *       404:
 *         description: Favorito no encontrado
 *       500:
 *         description: Error al eliminar favorito
 */
router.delete('/:id', propertyFavoriteController.deleteFavorite);

/**
 * @swagger
 * /api/property-favorites/client/{clientId}:
 *   get:
 *     summary: Obtener favoritos por cliente
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de favoritos del cliente obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyFavoriteWithDetails'
 *       500:
 *         description: Error al obtener favoritos del cliente
 */
router.get('/client/:clientId', propertyFavoriteController.getFavoritesByClient);

/**
 * @swagger
 * /api/property-favorites/property/{propertyId}:
 *   get:
 *     summary: Obtener favoritos por propiedad
 *     tags: [Favoritos]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la propiedad
 *     responses:
 *       200:
 *         description: Lista de favoritos de la propiedad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyFavoriteWithDetails'
 *       500:
 *         description: Error al obtener favoritos de la propiedad
 */
router.get('/property/:propertyId', propertyFavoriteController.getFavoritesByProperty);

export default router; 