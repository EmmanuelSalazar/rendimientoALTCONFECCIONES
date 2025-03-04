-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 04-03-2025 a las 13:46:27
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `otraotradb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metas`
--

DROP TABLE IF EXISTS `metas`;
CREATE TABLE IF NOT EXISTS `metas` (
  `meta_id` int NOT NULL AUTO_INCREMENT,
  `ref_id` int DEFAULT NULL,
  `meta` int DEFAULT NULL,
  PRIMARY KEY (`meta_id`),
  KEY `ref_id` (`ref_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `metas`
--

INSERT INTO `metas` (`meta_id`, `ref_id`, `meta`) VALUES
(2, 5, 507),
(3, 6, 136),
(4, 7, 546);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `operario` int NOT NULL,
  `tipoNotificacion` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operarios`
--

DROP TABLE IF EXISTS `operarios`;
CREATE TABLE IF NOT EXISTS `operarios` (
  `op_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `modulo` int NOT NULL,
  `activo` int NOT NULL DEFAULT '1',
  `calculadorFinal` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`op_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `operarios`
--

INSERT INTO `operarios` (`op_id`, `nombre`, `modulo`, `activo`, `calculadorFinal`) VALUES
(6, 'Carmen Arelsa Gomez', 1, 1, 0),
(7, 'Claudia Liliana Garcia', 1, 1, 0),
(8, 'Diana Carolina Cantellon Anaya', 1, 1, 0),
(9, 'Maria José Hernandez', 1, 1, 0),
(10, 'Lina Maria Jaramillo restrepo', 1, 1, 0),
(11, 'Milady Andrea Parra Salazar', 1, 1, 0),
(12, 'Daniel Javier Betancur Jurado', 1, 1, 0),
(13, 'Mariela Cordoba palacios', 1, 1, 0),
(14, 'Alba Nelly Loaiza Cruz', 1, 1, 0),
(15, 'Yoryani Alexandra Hernandez', 1, 1, 1),
(16, 'Sandra Milena Vasquez Lopez', 1, 1, 0),
(17, 'Neicy Marina Cuartas', 1, 1, 0),
(18, 'Natalia Agudelo Avendaño', 1, 1, 0),
(31, 'Emmanuel Manrique', 2, 1, 1),
(35, 'Carlos Santaana', 2, 1, 0),
(36, 'Carlitos Perez', 2, 1, 0);

--
-- Disparadores `operarios`
--
DROP TRIGGER IF EXISTS `recalcular_meta_al_actualizar_operarios`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_actualizar_operarios` AFTER UPDATE ON `operarios` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;

    -- Verificar si el módulo o el estado del operario ha cambiado
    IF OLD.modulo <> NEW.modulo OR OLD.activo <> NEW.activo THEN
        -- Recalcular meta para el módulo anterior (si el operario estaba activo antes)
        IF OLD.activo = 1 THEN
            SELECT COUNT(*) INTO cantidad_empleados_activos
            FROM operarios
            WHERE modulo = OLD.modulo AND activo = 1;

            -- Actualizar las metas para las referencias activas del módulo anterior
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
            WHERE referencias.modulo = OLD.modulo AND referencias.activo = 1;
        END IF;

        -- Recalcular meta para el nuevo módulo (si el operario está activo ahora)
        IF NEW.activo = 1 THEN
            SELECT COUNT(*) INTO cantidad_empleados_activos
            FROM operarios
            WHERE modulo = NEW.modulo AND activo = 1;

            -- Actualizar las metas para las referencias activas del nuevo módulo
            UPDATE metas
            JOIN referencias ON metas.ref_id = referencias.ref_id
            SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
            WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1;
        END IF;
    END IF;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `recalcular_meta_al_insertar_operario`;
DELIMITER $$
CREATE TRIGGER `recalcular_meta_al_insertar_operario` AFTER INSERT ON `operarios` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;

    -- Verificar si el operario está activo
    IF NEW.activo = 1 THEN
        -- Contar cuántos operarios activos hay en el módulo del nuevo operario
        SELECT COUNT(*) INTO cantidad_empleados_activos
        FROM operarios
        WHERE modulo = NEW.modulo AND activo = 1;

        -- Recalcular las metas para las referencias activas del módulo
        UPDATE metas
        JOIN referencias ON metas.ref_id = referencias.ref_id
        SET metas.meta = FLOOR((546 * cantidad_empleados_activos) / referencias.tiempoDeProduccion)
        WHERE referencias.modulo = NEW.modulo AND referencias.activo = 1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `referencias`
--

DROP TABLE IF EXISTS `referencias`;
CREATE TABLE IF NOT EXISTS `referencias` (
  `ref_id` int NOT NULL AUTO_INCREMENT,
  `referencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tiempoDeProduccion` int DEFAULT NULL,
  `modulo` int DEFAULT NULL,
  `activo` int NOT NULL,
  PRIMARY KEY (`ref_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `referencias`
--

INSERT INTO `referencias` (`ref_id`, `referencia`, `tiempoDeProduccion`, `modulo`, `activo`) VALUES
(5, '1212Z', 14, 1, 1),
(6, '123123U', 12, 2, 1),
(7, '312334', 15, 1, 0);

--
-- Disparadores `referencias`
--
DROP TRIGGER IF EXISTS `calcular_meta_al_insertar_referencia`;
DELIMITER $$
CREATE TRIGGER `calcular_meta_al_insertar_referencia` AFTER INSERT ON `referencias` FOR EACH ROW BEGIN
    DECLARE cantidad_empleados_activos INT;
    DECLARE nueva_meta INT;

    -- Contar la cantidad de operarios activos en el mismo módulo que la nueva referencia
    SELECT COUNT(*) INTO cantidad_empleados_activos
    FROM operarios
    WHERE modulo = NEW.modulo AND activo = 1;

    -- Calcular la meta usando la fórmula: (546 * cantidad_empleados_activos) / tiempoDeProduccion
    IF NEW.tiempoDeProduccion > 0 THEN
        SET nueva_meta = CEILING((546 * cantidad_empleados_activos) / NEW.tiempoDeProduccion);
    ELSE
        -- Manejar casos donde tiempoDeProduccion sea 0 (evitar división por cero)
        SET nueva_meta = 0;
    END IF;

    -- Insertar un nuevo registro en la tabla metas con el ref_id de la nueva referencia y la meta calculada
    INSERT INTO metas (ref_id, meta)
    VALUES (NEW.ref_id, nueva_meta);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_produccion`
--

DROP TABLE IF EXISTS `registro_produccion`;
CREATE TABLE IF NOT EXISTS `registro_produccion` (
  `regProd_id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT NULL,
  `op_id` int DEFAULT NULL,
  `ref_id` int DEFAULT NULL,
  `unidadesProducidas` int DEFAULT NULL,
  `MetaPorEficiencia` decimal(10,2) DEFAULT NULL,
  `eficiencia` decimal(10,2) GENERATED ALWAYS AS ((case when (`MetaPorEficiencia` = 0) then 0 else round(((`unidadesProducidas` / `MetaPorEficiencia`) * 100),2) end)) STORED,
  PRIMARY KEY (`regProd_id`),
  KEY `op_id` (`op_id`),
  KEY `ref_id` (`ref_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `registro_produccion`
--

INSERT INTO `registro_produccion` (`regProd_id`, `fecha`, `op_id`, `ref_id`, `unidadesProducidas`, `MetaPorEficiencia`) VALUES
(6, '2025-03-03 13:45:35', 18, 5, 70, 51.43),
(3, '2025-03-03 07:51:45', 31, 5, 75, 75.05),
(4, '2025-03-03 07:52:20', 15, 5, 70, 75.05),
(5, '2025-03-03 09:48:47', 35, 6, 70, 5.05),
(7, '2025-03-03 13:45:41', 17, 5, 73, 51.43),
(8, '2025-03-03 13:45:46', 15, 5, 72, 51.43),
(9, '2025-03-03 13:45:48', 14, 5, 75, 51.43),
(10, '2025-03-03 13:45:50', 13, 5, 70, 51.43),
(11, '2025-03-03 13:45:56', 12, 5, 75, 51.43),
(12, '2025-03-03 13:46:02', 11, 5, 80, 51.43),
(13, '2025-03-03 13:46:07', 10, 5, 76, 51.43),
(14, '2025-03-03 15:31:41', 31, 6, 70, 20.00),
(15, '2025-03-04 06:59:10', 18, 5, 50, 51.43),
(16, '2025-03-04 06:59:15', 17, 5, 52, 51.43),
(17, '2025-03-04 06:59:17', 15, 5, 50, 51.43),
(18, '2025-03-04 06:59:19', 14, 5, 51, 51.43),
(19, '2025-03-04 07:02:36', 36, 6, 10, 20.00),
(26, '2025-03-04 08:13:20', 35, 6, 40, 20.00),
(22, '2025-03-04 07:54:04', 31, 6, 20, 20.00),
(23, '2025-03-04 08:07:38', 16, 6, 19, 20.00),
(25, '2025-03-04 08:12:50', 36, 6, 40, 20.00),
(28, '2025-03-04 08:15:24', 18, 6, 40, 24.95),
(29, '2025-03-04 08:17:20', 17, 6, 1, 30.00),
(30, '2025-03-04 08:35:35', 15, 5, 51, 55.71);

--
-- Disparadores `registro_produccion`
--
DROP TRIGGER IF EXISTS `asignar_ref_id_y_calcular_meta`;
DELIMITER $$
CREATE TRIGGER `asignar_ref_id_y_calcular_meta` BEFORE INSERT ON `registro_produccion` FOR EACH ROW BEGIN
    DECLARE modulo_operario INT;
    DECLARE referencia_id INT;
    DECLARE meta_valor INT;
    DECLARE mensaje_error VARCHAR(255); -- Variable para almacenar el mensaje de error

    -- Paso 1: Obtener el módulo del operario
    SELECT modulo INTO modulo_operario
    FROM operarios
    WHERE op_id = NEW.op_id AND activo = 1;

    -- Verificar si se obtuvo un módulo válido
    IF modulo_operario IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El operario no está activo o no tiene un módulo asignado';
    END IF;

    -- Paso 2: Buscar la primera referencia activa asociada al módulo
    SELECT ref_id INTO referencia_id
    FROM referencias
    WHERE modulo = modulo_operario AND activo = 1
    LIMIT 1;

    -- Verificar si se obtuvo una referencia válida
    IF referencia_id IS NULL THEN
        SET mensaje_error = CONCAT('No se encontró ninguna referencia activa para el módulo ', modulo_operario);
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = mensaje_error;
    END IF;

    -- Paso 3: Asignar el ref_id al nuevo registro
    SET NEW.ref_id = referencia_id;

    -- Paso 4: Obtener la meta asociada a la referencia
    SELECT meta INTO meta_valor
    FROM metas
    WHERE ref_id = referencia_id;

    -- Paso 5: Calcular MetaPorEficiencia
    IF meta_valor IS NOT NULL THEN
        SET NEW.MetaPorEficiencia = ROUND(meta_valor / 9.1, 2);
    ELSE
        SET NEW.MetaPorEficiencia = 0.00;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `user_id` int NOT NULL,
  `nombreDelUsuario` varchar(16) DEFAULT NULL,
  `rol` int DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
