import { Router } from 'express';
import { projectController } from '../controllers/projectController';

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectWithDetails'
 */
router.get('/', projectController.getAllProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectWithDetails'
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', projectController.getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreate'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Inmobiliaria no encontrada
 */
router.post('/', projectController.createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto existente
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdate'
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:id', projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', projectController.deleteProject);

/**
 * @swagger
 * /api/projects/real-estate/{realEstateId}:
 *   get:
 *     summary: Obtener proyectos por inmobiliaria
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: realEstateId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la inmobiliaria
 *     responses:
 *       200:
 *         description: Lista de proyectos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectWithDetails'
 *       404:
 *         description: Inmobiliaria no encontrada
 */
router.get('/real-estate/:realEstateId', projectController.getProjectsByRealEstate);

export default router; 