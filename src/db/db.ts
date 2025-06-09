import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST || '69.197.145.59',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '##.*Proot2025$$$',
    database: process.env.DB_NAME || 'crm_inmobiliario',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export { pool }; 