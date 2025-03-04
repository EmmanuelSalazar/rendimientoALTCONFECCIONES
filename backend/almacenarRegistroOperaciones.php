<?php 
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require 'baseDeDatos.php';
require 'config/horarios.php';

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Termina la ejecución aquí
}

// Manejar solicitud POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    // Validar datos
    $fechaString = (new DateTime())->format('Y-m-d H:i:s'); // Fecha y hora actual
    $operador = $postData['operario'] ?? null;
    $unidadesProducidas = $postData['unidadesProducidas'] ?? null;

    if (empty($operador) || empty($unidadesProducidas)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Formulario inválida (CONERR3)'
        ]);
        exit();
    }

    // Calcular la hora límite (1 hora antes de la fecha actual)
    $horaLimite = (new DateTime())->modify('-1 hour')->format('Y-m-d H:i:s');

    // Verificar si ya existe un registro para el mismo op_id en la última hora
    $stmtVerificacion = $mysqli->prepare("SELECT COUNT(*) AS count FROM registro_produccion WHERE op_id = ? AND fecha >= ?");
    $stmtVerificacion->bind_param("is", $operador, $horaLimite);
    $stmtVerificacion->execute();
    $result = $stmtVerificacion->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        // Ya existe un registro para este operario en la última hora
/*         http_response_code(response_code: 400);
 */        $respuesta = [
            'ok' => false,
            'respuesta' => 'Ya existe un registro para este operario en la última hora (CONERR6)'
        ];
        echo json_encode($respuesta, true);
        $stmtVerificacion->close();
        exit();
    }

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO registro_produccion (fecha, op_id, unidadesProducidas) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $fechaString, $operador, $unidadesProducidas);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Error en la base de datos (CONERR1)'
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'respuesta' => 'Método no permitido (CONERR5)'
    ]);
}
?>