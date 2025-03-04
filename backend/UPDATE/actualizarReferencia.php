<?php
require '../baseDeDatos.php';

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Decodificar los datos enviados en el cuerpo de la solicitud
    $datos = json_decode(file_get_contents('php://input'), true);

    // Extraer los datos del cuerpo JSON
    $referencia = $datos['referencia'] ?? NULL;
    $tiempoDeProduccion = $datos['tiempoDeProduccion'] ?? NULL;
    $modulo = $datos['modulo'] ?? NULL;
    $activo = $datos['estado'] ?? NULL; // Cambio: Usar "activo" en lugar de "estado"

    // Validar que los datos necesarios estén presentes
    if (!$referencia || !$tiempoDeProduccion || !$modulo || $activo === NULL) {
        echo json_encode(['ok' => false, 'respuesta' => 'SOLICITUD INVALIDA: ERR 402']);
        exit;
    }

    // Iniciar transacción para asegurar consistencia
    $mysqli->begin_transaction();

    try {
        if ($activo == 1) { // Cambio: Usar "activo" en lugar de "estado"
            // Obtener el módulo de la referencia que se está actualizando
            $moduloQuery = "SELECT modulo FROM referencias WHERE referencia = ?";
            $stmt = $mysqli->prepare($moduloQuery);
            $stmt->bind_param("s", $referencia); // Usamos "s" porque `referencia` es una cadena
            $stmt->execute();
            $result = $stmt->get_result();
            $referenciaActual = $result->fetch_assoc();

            if (!$referenciaActual) {
                throw new Exception("La referencia '$referencia' no existe.");
            }

            $modulo_referencia = $referenciaActual['modulo'];

            // Desactivar todas las demás referencias del mismo módulo
            $resetQuery = "UPDATE referencias SET activo = 0 WHERE modulo = ? AND referencia <> ?";
            $stmt = $mysqli->prepare($resetQuery);
            $stmt->bind_param("is", $modulo_referencia, $referencia); // Usamos "is" porque `modulo` es un entero y `referencia` es una cadena
            $stmt->execute();

            // Actualizar la referencia seleccionada a activo = 1
            $updateQuery = "UPDATE referencias SET activo = 1 WHERE referencia = ?";
            $stmt = $mysqli->prepare($updateQuery);
            $stmt->bind_param("s", $referencia); // Usamos "s" porque `referencia` es una cadena
            $stmt->execute();
        } else {
            // Si el estado no es 1, simplemente actualizar los datos generales de la referencia
            $sql = "UPDATE referencias SET tiempoDeProduccion = ?, modulo = ?, activo = ? WHERE referencia = ?";
            $stmt = $mysqli->prepare($sql);
            $stmt->bind_param("iiis", $tiempoDeProduccion, $modulo, $activo, $referencia); // Usamos "iiis" porque `tiempoDeProduccion`, `modulo` y `activo` son enteros, y `referencia` es una cadena

            if (!$stmt->execute()) {
                throw new Exception("Error al actualizar la referencia.");
            }
        }

        // Confirmar la transacción
        $mysqli->commit();

        echo json_encode(["ok" => true, "respuesta" => 'La referencia ha sido actualizada correctamente.']);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $mysqli->rollback();
        echo json_encode(["ok" => false, "respuesta" => "Error: " . $e->getMessage()]);
    }
}
?>