import { Router } from 'express';
import { roleController } from '../controllers/roleController';

const router = Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', roleController.getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', roleController.getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/', roleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     tags: [Roles]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', roleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', roleController.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   get:
 *     summary: Obtener permisos de un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permisos del rol obtenidos exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/:id/permissions', roleController.getRolePermissions);

/**
 * @swagger
 * /api/roles/{id}/permissions:
 *   post:
 *     summary: Asignar permisos a un rol
 *     tags: [Roles]
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
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - permissionId
 *                     - moduleId
 *                   properties:
 *                     permissionId:
 *                       type: string
 *                     moduleId:
 *                       type: string
 *     responses:
 *       200:
 *         description: Permisos asignados exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/:id/permissions', roleController.assignPermissions);

export default router; 