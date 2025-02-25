<?php 
header('Access-Control-Allow-Origin: http://localhost:3000');
/* header('Access-Control-Allow-Origin: http://192.168.1.59:3000');
 */header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

require 'baseDeDatos.php';

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(); // Termina la ejecución aquí
}

// Manejar solicitud POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    
    $nombreOperario = $postData['nombreOperario'] ?? null;
    $modulo = $postData['modulo'] ?? null;


    if (empty($nombreOperario)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'respuesta' => 'Referencia inválida (CONERR3)'
        ]);
        exit();
    }

    // Insertar en base de datos
    $stmt = $mysqli->prepare("INSERT INTO operarios (nombre, modulo) VALUES (?, ?)");
    $stmt->bind_param("si", $nombreOperario, $modulo);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'ok' => true,
            'respuesta' => 'Solicitud exitosa',
            'Nombre del Operario' => $nombreOperario,
        ], true);
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