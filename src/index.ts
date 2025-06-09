import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { pool } from './db';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import agentRoutes from './routes/agentRoutes';
import realEstateRoutes from './routes/realEstateRoutes';
import projectRoutes from './routes/projectRoutes';
import propertyRoutes from './routes/propertyRoutes';
import clientRoutes from './routes/clientRoutes';
import clientInteractionRoutes from './routes/clientInteractionRoutes';
import propertyViewRoutes from './routes/propertyViewRoutes';
import propertyFavoriteRoutes from './routes/propertyFavoriteRoutes';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API CRM Inmobiliario',
      version: '1.0.0',
      description: 'API para sistema CRM Inmobiliario con IA y WhatsApp',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/real-estates', realEstateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/client-interactions', clientInteractionRoutes);
app.use('/api/property-views', propertyViewRoutes);
app.use('/api/property-favorites', propertyFavoriteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API CRM Inmobiliario' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
}); 