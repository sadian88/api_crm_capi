-- Agregar columna agent_id a la tabla properties
ALTER TABLE properties
ADD COLUMN agent_id VARCHAR(36),
ADD FOREIGN KEY (agent_id) REFERENCES agents(id);

-- Actualizar las propiedades existentes con un agente por defecto si es necesario
-- Esto es opcional y depende de tu lógica de negocio
-- UPDATE properties p
-- SET agent_id = (
--     SELECT a.id 
--     FROM agents a 
--     JOIN real_estates r ON a.real_estate_id = r.id 
--     WHERE r.id = p.real_estate_id 
--     LIMIT 1
-- )
-- WHERE agent_id IS NULL; 