<?php 

require 'baseDeDatos.php';
error_reporting(0);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Consulta con CASE para transformar el valor de "activo"
    $sql = $mysqli->prepare("
        SELECT 
            ref_id,
            referencia,
            modulo,
            tiempoDeProduccion,
            CASE 
                WHEN activo = 1 THEN 'Activo'
                WHEN activo = 0 THEN 'Inactivo'
                ELSE 'Desconocido' -- Opcional: maneja valores inesperados
            END AS estado
        FROM referencias
        ORDER BY ref_id DESC;
    ");

    $sql->execute();

    if (!$sql) {
        http_response_code(400);
        $respuesta = [
            'ok' => false,
            'respuesta' => 'Error al ejecutar la consulta'
        ];
        header('Content-Type: application/json');
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
        exit;
    } else {
        $resultado = $sql->get_result();
        $contador = $resultado->num_rows;

        if ($contador > 0) {
            $query = $resultado->fetch_all(MYSQLI_ASSOC);
            $respuesta = [
                'ok' => true,
                'respuesta' => $query
            ];
        } else {
            $respuesta = [
                'ok' => false,
                'respuesta' => 'No se encontraron resultados'
            ];
        }

        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode($respuesta, JSON_PRETTY_PRINT);
    }
} else {
    http_response_code(400);
    echo json_encode(['ok' => false, 'respuesta' => 'Método no permitido'], JSON_PRETTY_PRINT);
}
?>