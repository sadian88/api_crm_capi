-- Insertar roles básicos
INSERT INTO roles (id, name, description) VALUES
('1', 'admin', 'Administrador del sistema'),
('2', 'agent', 'Agente inmobiliario'),
('3', 'client', 'Cliente');

-- Insertar módulos básicos
INSERT INTO modules (id, name, description) VALUES
('1', 'users', 'Gestión de usuarios'),
('2', 'properties', 'Gestión de propiedades'),
('3', 'clients', 'Gestión de clientes'),
('4', 'projects', 'Gestión de proyectos'),
('5', 'reports', 'Reportes y estadísticas');

-- Insertar permisos básicos
INSERT INTO permissions (id, module_id, name, description) VALUES
-- Permisos de usuarios
('1', '1', 'create_user', 'Crear usuarios'),
('2', '1', 'read_user', 'Ver usuarios'),
('3', '1', 'update_user', 'Actualizar usuarios'),
('4', '1', 'delete_user', 'Eliminar usuarios'),

-- Permisos de propiedades
('5', '2', 'create_property', 'Crear propiedades'),
('6', '2', 'read_property', 'Ver propiedades'),
('7', '2', 'update_property', 'Actualizar propiedades'),
('8', '2', 'delete_property', 'Eliminar propiedades'),

-- Permisos de clientes
('9', '3', 'create_client', 'Crear clientes'),
('10', '3', 'read_client', 'Ver clientes'),
('11', '3', 'update_client', 'Actualizar clientes'),
('12', '3', 'delete_client', 'Eliminar clientes'),

-- Permisos de proyectos
('13', '4', 'create_project', 'Crear proyectos'),
('14', '4', 'read_project', 'Ver proyectos'),
('15', '4', 'update_project', 'Actualizar proyectos'),
('16', '4', 'delete_project', 'Eliminar proyectos'),

-- Permisos de reportes
('17', '5', 'view_reports', 'Ver reportes'),
('18', '5', 'export_reports', 'Exportar reportes');

-- Asignar permisos al rol de administrador
INSERT INTO role_permissions (role_id, permission_id)
SELECT '1', id FROM permissions;

-- Asignar permisos al rol de agente
INSERT INTO role_permissions (role_id, permission_id)
SELECT '2', id FROM permissions 
WHERE name IN (
    'read_user',
    'read_property',
    'create_property',
    'update_property',
    'create_client',
    'read_client',
    'update_client',
    'read_project',
    'view_reports'
);

-- Asignar permisos al rol de cliente
INSERT INTO role_permissions (role_id, permission_id)
SELECT '3', id FROM permissions 
WHERE name IN (
    'read_property',
    'read_project'
);

-- Crear usuario administrador por defecto
-- Nota: La contraseña debe ser hasheada en la aplicación
INSERT INTO users (id, name, email, password, role_id, status) VALUES
('1', 'Administrador', 'admin@example.com', '$2b$10$your_hashed_password', '1', 'active'); 