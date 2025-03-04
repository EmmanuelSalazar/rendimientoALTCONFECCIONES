<?php
require '../baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $id = $_GET['id'] ?? NULL;
    $nuevoOperarioContador = $_GET['operarioContador'] ?? false;

    if (!$id) {
        echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR400']);
        exit;
    }

    // Decodificar los datos enviados en el cuerpo de la solicitud
    $datos = json_decode(file_get_contents('php://input'), true);
    $nombre = $datos['nombreOperario'] ?? NULL;
    $modulo = $datos['modulo'] ?? NULL;
    $actividad = $datos['actividad'] ?? NULL;

    // Iniciar transacción para asegurar consistencia
    $mysqli->begin_transaction();

    try {
        if ($nuevoOperarioContador == "true") {
            // Obtener el módulo del operario que se está actualizando
            $moduloQuery = "SELECT modulo FROM operarios WHERE op_id = ?";
            $stmt = $mysqli->prepare($moduloQuery);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $operario = $result->fetch_assoc();

            if (!$operario) {
                throw new Exception("El operario con ID $id no existe.");
            }

            $modulo_operario = $operario['modulo'];

            // Poner en 0 todos los demás operarios del mismo módulo
            $resetQuery = "UPDATE operarios SET calculadorFinal = 0 WHERE modulo = ? AND op_id <> ?";
            $stmt = $mysqli->prepare($resetQuery);
            $stmt->bind_param("ii", $modulo_operario, $id);
            $stmt->execute();

            // Actualizar el operario seleccionado a calculadorFinal = 1
            $updateQuery = "UPDATE operarios SET calculadorFinal = 1 WHERE op_id = ?";
            $stmt = $mysqli->prepare($updateQuery);
            $stmt->bind_param("i", $id);
            $stmt->execute();

            // Confirmar la transacción
            $mysqli->commit();

            echo json_encode(["ok" => true, "respuesta" => 'El Operario ha sido actualizado correctamente.']);
        } elseif ($nuevoOperarioContador == "false") {
            if (!$nombre || !$modulo) {
                echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 402']);
                exit;
            }

            // Actualizar los datos generales del operario
            $sql = "UPDATE operarios SET nombre = ?, modulo = ?, activo = ? WHERE op_id = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("siii", $nombre, $modulo, $actividad, $id);

            if ($stmt->execute()) {
                echo json_encode(["ok" => true, "respuesta" => 'El Operario ha sido actualizado correctamente.']);
            } else {
                throw new Exception("Error al actualizar el operario.");
            }
        } else {
            echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 403']);
            exit;
        }
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $mysqli->rollback();
        echo json_encode(["ok" => false, "respuesta" => "Error: " . $e->getMessage()]);
    }
}
?>