<?php

require 'baseDeDatos.php';
require 'config/horarios.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener los parámetros de la solicitud
    $modulo = $_GET['modulo'] ?? null; // Módulo (opcional)
    $fechaFiltro = $_GET['fecha'] ?? date('Y-m-d'); // Fecha (por defecto, hoy)

    $operariosFiltro = $_GET['operarios'] ?? null; // Lista de operarios (opcional)

    // Validar el módulo
    if (!empty($modulo) && is_numeric($modulo)) {
        $moduloFiltro = intval($modulo);
    } else {
        $moduloFiltro = null; // No filtrar por módulo si no se proporciona un valor válido
    }

    // Validar los operarios
    $operariosArray = [];
    if (!empty($operariosFiltro)) {
        // Dividir la cadena de operarios por comas y validar que sean números
        $operarios = explode(',', $operariosFiltro);
        foreach ($operarios as $op_id) {
            if (is_numeric($op_id)) {
                $operariosArray[] = intval($op_id);
            }
        }
    }

    // Construir la consulta SQL dinámicamente
    $sql = "
        SELECT
            RP.op_id AS ID_Operario,
            O.calculadorFinal AS CalculadorFinal,
            DATE(RP.fecha) AS Fecha,
            O.nombre AS NombreOperario,
            R.referencia AS Referencia,
            R.modulo AS Modulo,
            SUM(RP.unidadesProducidas) AS TotalUnidadesProducidas,
            SUM(RP.MetaPorEficiencia) AS TotalMetaPorEficiencia,
            CASE 
                WHEN SUM(RP.MetaPorEficiencia) = 0 THEN 0
                ELSE ROUND((SUM(RP.unidadesProducidas) / SUM(RP.MetaPorEficiencia)) * 100, 2)
            END AS EficienciaGeneral
        FROM 
            registro_produccion RP
        JOIN 
            operarios O ON RP.op_id = O.op_id
        JOIN 
            referencias R ON RP.ref_id = R.ref_id
        WHERE 
            DATE(RP.fecha) = ?
    ";

    // Agregar filtro por módulo si se proporciona
    if ($moduloFiltro) {
        $sql .= " AND R.modulo = ?";
    }

    // Agregar filtro por operarios si se proporcionan
    if (!empty($operariosArray)) {
        $placeholders = implode(',', array_fill(0, count($operariosArray), '?')); // Crear marcadores de posición
        $sql .= " AND O.op_id IN ($placeholders)";
    }

    $sql .= "
        GROUP BY
            RP.op_id, O.nombre, R.referencia, O.calculadorFinal
        ORDER BY
            EficienciaGeneral DESC;
    ";

    // Preparar la consulta
    $stmt = $mysqli->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error en la consulta SQL: ' . $mysqli->error
        ]);
        exit();
    }

    // Enlazar los parámetros
    $types = 's'; // Tipo de dato para la fecha (string)
    $params = [$fechaFiltro]; // Parámetros a enlazar

    if ($moduloFiltro) {
        $types .= 'i'; // Tipo de dato para el módulo (integer)
        $params[] = $moduloFiltro;
    }

    if (!empty($operariosArray)) {
        $types .= str_repeat('i', count($operariosArray)); // Tipos de dato para los operarios (integer)
        $params = array_merge($params, $operariosArray); // Agregar los IDs de los operarios
    }

    // Enlazar los parámetros dinámicamente
    $stmt->bind_param($types, ...$params);

    // Ejecutar la consulta
    $stmt->execute();
    $result = $stmt->get_result();

    // Procesar los resultados
    $datosCompuestos = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Calcular eficiencia
            $eficiencia = $row["TotalMetaPorEficiencia"] > 0
                ? ceil(($row["TotalUnidadesProducidas"] / $row["TotalMetaPorEficiencia"]) * 100) . "%"
                : "0%";
            $eficienciaInt = $row["TotalMetaPorEficiencia"] > 0
                ? ceil(($row["TotalUnidadesProducidas"] / $row["TotalMetaPorEficiencia"]) * 100)
                : "0";
            $datosCompuestos[] = [
                "id_operario" => $row["ID_Operario"],
                "calculador_final" => $row["CalculadorFinal"], // Incluir la nueva columna
                "nombre_operario" => $row["NombreOperario"],
                "referencia" => $row["Referencia"],
                "fecha" => $row["Fecha"],
                "total_unidades_producidas" => $row["TotalUnidadesProducidas"],
                "total_meta_eficiencia" => floor($row["TotalMetaPorEficiencia"]),
                "eficiencia" => $eficiencia,
                "eficiencia_int" => $eficienciaInt
            ];
        }
    }

    // Construir la respuesta
    $respuesta = [
        "ok" => true,
        "respuesta" => $datosCompuestos
    ];

    // Devolver la respuesta como JSON
    echo json_encode($respuesta, JSON_PRETTY_PRINT);

    // Cerrar la conexión
    $stmt->close();
    $mysqli->close();
} else {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'respuesta' => 'Esta operación no está permitida'
    ]);
}
?>