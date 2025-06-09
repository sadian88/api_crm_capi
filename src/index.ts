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
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role_id: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            document_type: { type: 'string', enum: ['dni', 'ruc', 'ce', 'passport'] },
            document_number: { type: 'string' },
            address: { type: 'string' },
            real_estate_id: { type: 'string' },
            agent_id: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ClientCreate: {
          type: 'object',
          required: ['name', 'email', 'phone', 'document_type', 'document_number', 'real_estate_id', 'agent_id'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            document_type: { type: 'string', enum: ['dni', 'ruc', 'ce', 'passport'] },
            document_number: { type: 'string' },
            address: { type: 'string' },
            real_estate_id: { type: 'string' },
            agent_id: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        ClientWithDetails: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/Client' },
            {
              properties: {
                real_estate: { $ref: '#/components/schemas/RealEstate' },
                agent: { $ref: '#/components/schemas/User' }
              }
            }
          ]
        },
        RealEstate: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            contact_email: { type: 'string' },
            phone: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            address: { type: 'string' },
            type: { type: 'string', enum: ['house', 'apartment', 'land', 'commercial'] },
            status: { type: 'string', enum: ['available', 'sold', 'reserved'] },
            real_estate_id: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PropertyCreate: {
          type: 'object',
          required: ['title', 'price', 'type', 'real_estate_id'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            address: { type: 'string' },
            type: { type: 'string', enum: ['house', 'apartment', 'land', 'commercial'] },
            status: { type: 'string', enum: ['available', 'sold', 'reserved'] },
            real_estate_id: { type: 'string' }
          }
        },
        PropertyWithDetails: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/Property' },
            {
              properties: {
                real_estate: { $ref: '#/components/schemas/RealEstate' }
              }
            }
          ]
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'completed', 'cancelled'] },
            real_estate_id: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ProjectCreate: {
          type: 'object',
          required: ['name', 'real_estate_id'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'completed', 'cancelled'] },
            real_estate_id: { type: 'string' }
          }
        },
        ProjectWithDetails: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/Project' },
            {
              properties: {
                real_estate: { $ref: '#/components/schemas/RealEstate' }
              }
            }
          ]
        },
        PropertyView: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            property_id: { type: 'string' },
            client_id: { type: 'string' },
            agent_id: { type: 'string' },
            view_date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
            notes: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PropertyViewCreate: {
          type: 'object',
          required: ['property_id', 'client_id', 'agent_id', 'view_date'],
          properties: {
            property_id: { type: 'string' },
            client_id: { type: 'string' },
            agent_id: { type: 'string' },
            view_date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
            notes: { type: 'string' }
          }
        },
        PropertyViewWithDetails: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/PropertyView' },
            {
              properties: {
                property: { $ref: '#/components/schemas/Property' },
                client: { $ref: '#/components/schemas/Client' },
                agent: { $ref: '#/components/schemas/User' }
              }
            }
          ]
        },
        ClientInteraction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            client_id: { type: 'string' },
            agent_id: { type: 'string' },
            type: { type: 'string', enum: ['call', 'email', 'meeting', 'whatsapp'] },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ClientInteractionCreate: {
          type: 'object',
          required: ['client_id', 'agent_id', 'type', 'description'],
          properties: {
            client_id: { type: 'string' },
            agent_id: { type: 'string' },
            type: { type: 'string', enum: ['call', 'email', 'meeting', 'whatsapp'] },
            description: { type: 'string' }
          }
        },
        ClientInteractionWithDetails: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/ClientInteraction' },
            {
              properties: {
                client: { $ref: '#/components/schemas/Client' },
                agent: { $ref: '#/components/schemas/User' }
              }
            }
          ]
        }
      }
    }
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