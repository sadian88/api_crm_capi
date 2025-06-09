/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - id
 *         - real_estate_id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del proyecto
 *         real_estate_id:
 *           type: string
 *           description: ID de la inmobiliaria a la que pertenece el proyecto
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción detallada del proyecto
 *         start_date:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del proyecto
 *         end_date:
 *           type: string
 *           format: date
 *           description: Fecha de finalización del proyecto
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del registro
 * 
 *     ProjectCreate:
 *       type: object
 *       required:
 *         - real_estate_id
 *         - name
 *       properties:
 *         real_estate_id:
 *           type: string
 *           description: ID de la inmobiliaria a la que pertenece el proyecto
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción detallada del proyecto
 *         start_date:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del proyecto
 *         end_date:
 *           type: string
 *           format: date
 *           description: Fecha de finalización del proyecto
 * 
 *     ProjectUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del proyecto
 *         description:
 *           type: string
 *           description: Descripción detallada del proyecto
 *         start_date:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del proyecto
 *         end_date:
 *           type: string
 *           format: date
 *           description: Fecha de finalización del proyecto
 * 
 *     ProjectWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Project'
 *         - type: object
 *           properties:
 *             real_estate_name:
 *               type: string
 *               description: Nombre de la inmobiliaria
 *             real_estate_address:
 *               type: string
 *               description: Dirección de la inmobiliaria
 *             total_properties:
 *               type: number
 *               description: Número total de propiedades en el proyecto
 *             properties_by_status:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Estado de las propiedades
 *                   count:
 *                     type: number
 *                     description: Cantidad de propiedades en este estado
 * 
 *     Property:
 *       type: object
 *       required:
 *         - id
 *         - real_estate_id
 *         - name
 *         - description
 *         - type
 *         - status
 *         - price
 *         - currency
 *         - address
 *         - city
 *         - state
 *         - country
 *         - postal_code
 *         - area
 *         - area_unit
 *         - features
 *         - images
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la propiedad
 *         real_estate_id:
 *           type: string
 *           description: ID de la inmobiliaria
 *         name:
 *           type: string
 *           description: Nombre de la propiedad
 *         description:
 *           type: string
 *           description: Descripción de la propiedad
 *         type:
 *           type: string
 *           enum: [casa, apartamento, local, terreno]
 *           description: Tipo de propiedad
 *         status:
 *           type: string
 *           enum: [disponible, reservado, vendido, alquilado]
 *           description: Estado de la propiedad
 *         price:
 *           type: number
 *           description: Precio de la propiedad
 *         currency:
 *           type: string
 *           description: Moneda del precio
 *         address:
 *           type: string
 *           description: Dirección de la propiedad
 *         city:
 *           type: string
 *           description: Ciudad
 *         state:
 *           type: string
 *           description: Estado/Provincia
 *         country:
 *           type: string
 *           description: País
 *         postal_code:
 *           type: string
 *           description: Código postal
 *         bedrooms:
 *           type: number
 *           description: Número de habitaciones
 *         bathrooms:
 *           type: number
 *           description: Número de baños
 *         area:
 *           type: number
 *           description: Área de la propiedad
 *         area_unit:
 *           type: string
 *           enum: [m2, ft2]
 *           description: Unidad de medida del área
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Características de la propiedad
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 * 
 *     PropertyCreate:
 *       type: object
 *       required:
 *         - real_estate_id
 *         - name
 *         - description
 *         - type
 *         - status
 *         - price
 *         - currency
 *         - address
 *         - city
 *         - state
 *         - country
 *         - postal_code
 *         - area
 *         - area_unit
 *         - features
 *         - images
 *       properties:
 *         real_estate_id:
 *           type: string
 *           description: ID de la inmobiliaria
 *         name:
 *           type: string
 *           description: Nombre de la propiedad
 *         description:
 *           type: string
 *           description: Descripción de la propiedad
 *         type:
 *           type: string
 *           enum: [casa, apartamento, local, terreno]
 *           description: Tipo de propiedad
 *         status:
 *           type: string
 *           enum: [disponible, reservado, vendido, alquilado]
 *           description: Estado de la propiedad
 *         price:
 *           type: number
 *           description: Precio de la propiedad
 *         currency:
 *           type: string
 *           description: Moneda del precio
 *         address:
 *           type: string
 *           description: Dirección de la propiedad
 *         city:
 *           type: string
 *           description: Ciudad
 *         state:
 *           type: string
 *           description: Estado/Provincia
 *         country:
 *           type: string
 *           description: País
 *         postal_code:
 *           type: string
 *           description: Código postal
 *         bedrooms:
 *           type: number
 *           description: Número de habitaciones
 *         bathrooms:
 *           type: number
 *           description: Número de baños
 *         area:
 *           type: number
 *           description: Área de la propiedad
 *         area_unit:
 *           type: string
 *           enum: [m2, ft2]
 *           description: Unidad de medida del área
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Características de la propiedad
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes
 * 
 *     PropertyUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la propiedad
 *         description:
 *           type: string
 *           description: Descripción de la propiedad
 *         type:
 *           type: string
 *           enum: [casa, apartamento, local, terreno]
 *           description: Tipo de propiedad
 *         status:
 *           type: string
 *           enum: [disponible, reservado, vendido, alquilado]
 *           description: Estado de la propiedad
 *         price:
 *           type: number
 *           description: Precio de la propiedad
 *         currency:
 *           type: string
 *           description: Moneda del precio
 *         address:
 *           type: string
 *           description: Dirección de la propiedad
 *         city:
 *           type: string
 *           description: Ciudad
 *         state:
 *           type: string
 *           description: Estado/Provincia
 *         country:
 *           type: string
 *           description: País
 *         postal_code:
 *           type: string
 *           description: Código postal
 *         bedrooms:
 *           type: number
 *           description: Número de habitaciones
 *         bathrooms:
 *           type: number
 *           description: Número de baños
 *         area:
 *           type: number
 *           description: Área de la propiedad
 *         area_unit:
 *           type: string
 *           enum: [m2, ft2]
 *           description: Unidad de medida del área
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Características de la propiedad
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs de las imágenes
 * 
 *     PropertyWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Property'
 *         - type: object
 *           properties:
 *             real_estate_name:
 *               type: string
 *               description: Nombre de la inmobiliaria
 *             real_estate_email:
 *               type: string
 *               description: Email de la inmobiliaria
 *             real_estate_phone:
 *               type: string
 *               description: Teléfono de la inmobiliaria
 *             assigned_agent_name:
 *               type: string
 *               description: Nombre del agente asignado
 *             assigned_agent_email:
 *               type: string
 *               description: Email del agente asignado
 *             assigned_agent_phone:
 *               type: string
 *               description: Teléfono del agente asignado
 *             total_views:
 *               type: number
 *               description: Total de visitas a la propiedad
 *             total_favorites:
 *               type: number
 *               description: Total de favoritos de la propiedad
 *             last_interaction_date:
 *               type: string
 *               format: date-time
 *               description: Fecha de la última interacción
 *             last_interaction_type:
 *               type: string
 *               description: Tipo de la última interacción
 * 
 *     Client:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - phone
 *         - document_type
 *         - document_number
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del cliente
 *         name:
 *           type: string
 *           description: Nombre completo del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         address:
 *           type: string
 *           description: Dirección del cliente
 *         document_type:
 *           type: string
 *           enum: [dni, ruc, passport]
 *           description: Tipo de documento de identidad
 *         document_number:
 *           type: string
 *           description: Número de documento de identidad
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del cliente
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el cliente
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del registro
 * 
 *     ClientCreate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - document_type
 *         - document_number
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         address:
 *           type: string
 *           description: Dirección del cliente
 *         document_type:
 *           type: string
 *           enum: [dni, ruc, passport]
 *           description: Tipo de documento de identidad
 *         document_number:
 *           type: string
 *           description: Número de documento de identidad
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del cliente
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el cliente
 * 
 *     ClientUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del cliente
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente
 *         phone:
 *           type: string
 *           description: Número de teléfono del cliente
 *         address:
 *           type: string
 *           description: Dirección del cliente
 *         document_type:
 *           type: string
 *           enum: [dni, ruc, passport]
 *           description: Tipo de documento de identidad
 *         document_number:
 *           type: string
 *           description: Número de documento de identidad
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del cliente
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el cliente
 * 
 *     ClientWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Client'
 *         - type: object
 *           properties:
 *             total_properties:
 *               type: number
 *               description: Número total de propiedades asociadas al cliente
 *             properties_by_status:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: Estado de las propiedades
 *                   count:
 *                     type: number
 *                     description: Cantidad de propiedades en este estado
 *             last_interaction:
 *               type: string
 *               format: date-time
 *               description: Fecha de la última interacción con el cliente
 *             assigned_agent:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del agente asignado
 *                 name:
 *                   type: string
 *                   description: Nombre del agente asignado
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email del agente asignado
 *                 phone:
 *                   type: string
 *                   description: Teléfono del agente asignado
 * 
 *     ClientInteraction:
 *       type: object
 *       required:
 *         - id
 *         - client_id
 *         - agent_id
 *         - type
 *         - status
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la interacción
 *         client_id:
 *           type: string
 *           description: ID del cliente
 *         agent_id:
 *           type: string
 *           description: ID del agente
 *         type:
 *           type: string
 *           enum: [llamada, reunión, email, visita]
 *           description: Tipo de interacción
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la interacción
 *         description:
 *           type: string
 *           description: Descripción de la interacción
 *         notes:
 *           type: string
 *           description: Notas adicionales
 *         scheduled_date:
 *           type: string
 *           format: date-time
 *           description: Fecha programada
 *         completed_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de completado
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     
 *     ClientInteractionCreate:
 *       type: object
 *       required:
 *         - client_id
 *         - agent_id
 *         - type
 *         - status
 *         - description
 *       properties:
 *         client_id:
 *           type: string
 *           description: ID del cliente
 *         agent_id:
 *           type: string
 *           description: ID del agente
 *         type:
 *           type: string
 *           enum: [llamada, reunión, email, visita]
 *           description: Tipo de interacción
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la interacción
 *         description:
 *           type: string
 *           description: Descripción de la interacción
 *         notes:
 *           type: string
 *           description: Notas adicionales
 *         scheduled_date:
 *           type: string
 *           format: date-time
 *           description: Fecha programada
 *         completed_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de completado
 *     
 *     ClientInteractionUpdate:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [llamada, reunión, email, visita]
 *           description: Tipo de interacción
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la interacción
 *         description:
 *           type: string
 *           description: Descripción de la interacción
 *         notes:
 *           type: string
 *           description: Notas adicionales
 *         scheduled_date:
 *           type: string
 *           format: date-time
 *           description: Fecha programada
 *         completed_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de completado
 *     
 *     ClientInteractionWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/ClientInteraction'
 *         - type: object
 *           properties:
 *             client_name:
 *               type: string
 *               description: Nombre del cliente
 *             client_email:
 *               type: string
 *               description: Email del cliente
 *             client_phone:
 *               type: string
 *               description: Teléfono del cliente
 *             agent_name:
 *               type: string
 *               description: Nombre del agente
 *             agent_email:
 *               type: string
 *               description: Email del agente
 *             agent_phone:
 *               type: string
 *               description: Teléfono del agente
 *             property_name:
 *               type: string
 *               description: Nombre de la propiedad
 *             property_address:
 *               type: string
 *               description: Dirección de la propiedad
 *     
 *     PropertyView:
 *       type: object
 *       required:
 *         - id
 *         - property_id
 *         - client_id
 *         - agent_id
 *         - view_date
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la visita
 *         property_id:
 *           type: string
 *           description: ID de la propiedad
 *         client_id:
 *           type: string
 *           description: ID del cliente
 *         agent_id:
 *           type: string
 *           description: ID del agente
 *         view_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de la visita
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la visita
 *         notes:
 *           type: string
 *           description: Notas sobre la visita
 *         feedback:
 *           type: string
 *           description: Comentarios del cliente
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Calificación de la visita
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     
 *     PropertyViewCreate:
 *       type: object
 *       required:
 *         - property_id
 *         - client_id
 *         - agent_id
 *         - view_date
 *         - status
 *       properties:
 *         property_id:
 *           type: string
 *           description: ID de la propiedad
 *         client_id:
 *           type: string
 *           description: ID del cliente
 *         agent_id:
 *           type: string
 *           description: ID del agente
 *         view_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de la visita
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la visita
 *         notes:
 *           type: string
 *           description: Notas sobre la visita
 *         feedback:
 *           type: string
 *           description: Comentarios del cliente
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Calificación de la visita
 *     
 *     PropertyViewUpdate:
 *       type: object
 *       properties:
 *         view_date:
 *           type: string
 *           format: date-time
 *           description: Fecha de la visita
 *         status:
 *           type: string
 *           enum: [programada, completada, cancelada]
 *           description: Estado de la visita
 *         notes:
 *           type: string
 *           description: Notas sobre la visita
 *         feedback:
 *           type: string
 *           description: Comentarios del cliente
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Calificación de la visita
 *     
 *     PropertyViewWithDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/PropertyView'
 *         - type: object
 *           properties:
 *             property_name:
 *               type: string
 *               description: Nombre de la propiedad
 *             property_address:
 *               type: string
 *               description: Dirección de la propiedad
 *             property_type:
 *               type: string
 *               description: Tipo de propiedad
 *             property_status:
 *               type: string
 *               description: Estado de la propiedad
 *             client_name:
 *               type: string
 *               description: Nombre del cliente
 *             client_email:
 *               type: string
 *               description: Email del cliente
 *             client_phone:
 *               type: string
 *               description: Teléfono del cliente
 *             agent_name:
 *               type: string
 *               description: Nombre del agente
 *             agent_email:
 *               type: string
 *               description: Email del agente
 *             agent_phone:
 *               type: string
 *               description: Teléfono del agente
 *             real_estate_name:
 *               type: string
 *               description: Nombre de la inmobiliaria
 *             real_estate_email:
 *               type: string
 *               description: Email de la inmobiliaria
 *             real_estate_phone:
 *               type: string
 *               description: Teléfono de la inmobiliaria
 * 
 *     PropertyFavorite:
 *       type: object
 *       required:
 *         - id
 *         - property_id
 *         - client_id
 *         - created_at
 *         - updated_at
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del favorito
 *         property_id:
 *           type: integer
 *           description: ID de la propiedad
 *         client_id:
 *           type: integer
 *           description: ID del cliente
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el favorito
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 * 
 *     PropertyFavoriteCreate:
 *       type: object
 *       required:
 *         - property_id
 *         - client_id
 *       properties:
 *         property_id:
 *           type: integer
 *           description: ID de la propiedad
 *         client_id:
 *           type: integer
 *           description: ID del cliente
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el favorito
 * 
 *     PropertyFavoriteUpdate:
 *       type: object
 *       properties:
 *         notes:
 *           type: string
 *           description: Notas adicionales sobre el favorito
 * 
 *     PropertyFavoriteWithDetails:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/PropertyFavorite'
 *         - type: object
 *           properties:
 *             property:
 *               $ref: '#/components/schemas/Property'
 *             client:
 *               $ref: '#/components/schemas/Client'
 */ 