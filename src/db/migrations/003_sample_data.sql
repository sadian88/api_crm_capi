-- Insertar inmobiliarias de ejemplo
INSERT INTO real_estates (id, name, address, phone, email, website, status) VALUES
('1', 'Inmobiliaria Central', 'Av. Principal 123, Lima', '01-1234567', 'info@inmocentral.com', 'www.inmocentral.com', 'active'),
('2', 'Real Estate Premium', 'Calle Los Olivos 456, Lima', '01-7654321', 'contacto@premium.com', 'www.premium.com', 'active'),
('3', 'Inmobiliaria Express', 'Av. La Marina 789, Lima', '01-9876543', 'ventas@express.com', 'www.express.com', 'active');

-- Insertar usuarios de ejemplo
INSERT INTO users (id, name, email, password, phone, role_id, status) VALUES
-- Administradores
('1', 'Admin Principal', 'admin@inmocentral.com', '$2b$10$your_hashed_password', '999888777', '1', 'active'),
('2', 'Admin Premium', 'admin@premium.com', '$2b$10$your_hashed_password', '999888666', '1', 'active'),

-- Agentes
('3', 'Juan Pérez', 'juan@inmocentral.com', '$2b$10$your_hashed_password', '999888555', '2', 'active'),
('4', 'María García', 'maria@premium.com', '$2b$10$your_hashed_password', '999888444', '2', 'active'),
('5', 'Carlos López', 'carlos@express.com', '$2b$10$your_hashed_password', '999888333', '2', 'active'),

-- Clientes
('6', 'Ana Martínez', 'ana@email.com', '$2b$10$your_hashed_password', '999888222', '3', 'active'),
('7', 'Roberto Sánchez', 'roberto@email.com', '$2b$10$your_hashed_password', '999888111', '3', 'active'),
('8', 'Laura Torres', 'laura@email.com', '$2b$10$your_hashed_password', '999888000', '3', 'active');

-- Insertar agentes
INSERT INTO agents (id, user_id, real_estate_id, status) VALUES
('1', '3', '1', 'active'),
('2', '4', '2', 'active'),
('3', '5', '3', 'active');

-- Insertar clientes
INSERT INTO clients (id, name, email, phone, document_type, document_number, address, real_estate_id, agent_id, status) VALUES
('1', 'Ana Martínez', 'ana@email.com', '999888222', 'dni', '12345678', 'Av. Los Jardines 123, Lima', '1', '1', 'active'),
('2', 'Roberto Sánchez', 'roberto@email.com', '999888111', 'dni', '87654321', 'Calle Las Flores 456, Lima', '2', '2', 'active'),
('3', 'Laura Torres', 'laura@email.com', '999888000', 'dni', '11223344', 'Av. Los Pinos 789, Lima', '3', '3', 'active');

-- Insertar proyectos
INSERT INTO projects (id, name, description, real_estate_id, status) VALUES
('1', 'Residencial Los Olivos', 'Conjunto residencial con áreas verdes y seguridad 24/7', '1', 'active'),
('2', 'Torre Premium', 'Edificio de departamentos de lujo en zona exclusiva', '2', 'active'),
('3', 'Condominio Express', 'Complejo residencial con amenities modernos', '3', 'active');

-- Insertar propiedades
INSERT INTO properties (id, title, description, address, price, type, status, bedrooms, bathrooms, area, real_estate_id, project_id) VALUES
-- Propiedades en Residencial Los Olivos
('1', 'Casa Moderna 3 Dormitorios', 'Hermosa casa con acabados de lujo', 'Calle Los Olivos 123', 350000.00, 'house', 'available', 3, 2, 150.00, '1', '1'),
('2', 'Departamento 2 Dormitorios', 'Departamento con vista panorámica', 'Calle Los Olivos 456', 250000.00, 'apartment', 'available', 2, 2, 90.00, '1', '1'),

-- Propiedades en Torre Premium
('3', 'Penthouse de Lujo', 'Penthouse con terraza y vista al mar', 'Av. Premium 789', 500000.00, 'apartment', 'available', 4, 3, 200.00, '2', '2'),
('4', 'Local Comercial', 'Local en zona de alto tráfico', 'Av. Premium 101', 300000.00, 'commercial', 'available', 0, 1, 120.00, '2', '2'),

-- Propiedades en Condominio Express
('5', 'Casa Familiar', 'Casa ideal para familia', 'Calle Express 202', 400000.00, 'house', 'available', 4, 3, 180.00, '3', '3'),
('6', 'Terreno Comercial', 'Terreno para desarrollo comercial', 'Calle Express 303', 250000.00, 'land', 'available', 0, 0, 500.00, '3', '3');

-- Insertar interacciones con clientes
INSERT INTO client_interactions (id, client_id, agent_id, property_id, type, status, notes) VALUES
('1', '1', '1', '1', 'visit', 'completed', 'Cliente interesado en la casa, solicita información adicional'),
('2', '2', '2', '3', 'call', 'pending', 'Cliente consulta sobre financiamiento'),
('3', '3', '3', '5', 'email', 'completed', 'Cliente solicita fotos adicionales');

-- Insertar vistas de propiedades
INSERT INTO property_views (id, property_id, user_id, client_id, agent_id, source, ip_address) VALUES
('1', '1', '6', '1', '1', 'web', '192.168.1.1'),
('2', '3', '7', '2', '2', 'mobile', '192.168.1.2'),
('3', '5', '8', '3', '3', 'web', '192.168.1.3');

-- Insertar favoritos de propiedades
INSERT INTO property_favorites (id, property_id, user_id) VALUES
('1', '1', '6'),
('2', '3', '7'),
('3', '5', '8'); 