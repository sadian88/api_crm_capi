# API CRM

API REST para sistema CRM desarrollada con Node.js, TypeScript y MySQL.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd apicrm
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=crm_db
```

4. Crear la base de datos:
```sql
CREATE DATABASE crm_db;
```

## Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm run build
npm start
```

## Documentación

La documentación de la API está disponible en:
```
http://localhost:3000/api-docs
```

## Estructura del Proyecto

```
src/
  ├── config/         # Configuraciones
  ├── routes/         # Rutas de la API
  ├── controllers/    # Controladores
  ├── models/         # Modelos
  ├── services/       # Servicios
  └── index.ts        # Punto de entrada
```

## Tecnologías Utilizadas

- Node.js
- TypeScript
- Express
- MySQL
- Swagger/OpenAPI
- dotenv
- cors 