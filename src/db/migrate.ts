import { pool } from './db';
import * as fs from 'fs';
import * as path from 'path';
import { RowDataPacket } from 'mysql2';

async function runMigrations() {
    try {
        // Leer archivos de migración
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // Crear tabla de migraciones si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Obtener migraciones ya ejecutadas
        const [executedMigrations] = await pool.query<RowDataPacket[]>(
            'SELECT name FROM migrations'
        );
        const executedMigrationNames = executedMigrations.map((m: RowDataPacket) => m.name);

        // Ejecutar migraciones pendientes
        for (const file of migrationFiles) {
            if (!executedMigrationNames.includes(file)) {
                console.log(`Ejecutando migración: ${file}`);
                const migrationPath = path.join(migrationsDir, file);
                const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

                // Ejecutar migración
                await pool.query(migrationSQL);

                // Registrar migración ejecutada
                await pool.query(
                    'INSERT INTO migrations (name) VALUES (?)',
                    [file]
                );

                console.log(`Migración ${file} completada`);
            }
        }

        console.log('Todas las migraciones han sido ejecutadas');
    } catch (error) {
        console.error('Error al ejecutar migraciones:', error);
        throw error;
    }
}

// Ejecutar migraciones
runMigrations()
    .then(() => {
        console.log('Proceso de migración completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error en el proceso de migración:', error);
        process.exit(1);
    }); 