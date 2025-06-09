import { Router } from 'express';
import { clientController } from '../controllers/clientController';

const router = Router();

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientWithDetails'
 */
router.get('/', clientController.getAllClients);

/**
 * @swagger
 * /api/clients/stats:
 *   get:
 *     summary: Obtener estadísticas de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients_by_status:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: number
 *                 total_clients:
 *                   type: number
 */
router.get('/stats', clientController.getClientStats);

/**
 * @swagger
 * /api/clients/user/{userId}:
 *   get:
 *     summary: Obtener clientes por usuario
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientWithDetails'
 */
router.get('/user/:userId', clientController.getClientsByUser);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientWithDetails'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', clientController.getClientById);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientCreate'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos o cliente ya existe
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/', clientController.createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientUpdate'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos o cliente ya existe
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', clientController.updateClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', clientController.deleteClient);

export default router; 