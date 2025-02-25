<?php 
    header('Access-Control-Allow-Origin: http://localhost:3000');
/*     header('Access-Control-Allow-Origin: http://192.168.1.59:3000');
 */header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
    require 'baseDeDatos.php';
    require 'config/horarios.php';

    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        $modulo = $_GET['modulo'] ?? NULL;
        if ($modulo != 0) {
            $sql = "SELECT
                        DATE(RP.fecha) AS Fecha,
                        O.nombre AS NombreOperario,
                        R.referencia AS Referencia,
                        R.modulo AS Modulo, -- Incluimos el módulo para referencia
                        SUM(RP.unidadesProducidas) AS TotalUnidadesProducidas,
                        SUM(RP.MetaPorEficiencia) AS TotalMetaPorEficiencia
                    FROM registro_produccion RP
                    JOIN Operarios O ON RP.op_id = O.op_id
                    JOIN Referencias R ON RP.ref_id = R.ref_id
                    WHERE 
                        DATE(RP.fecha) = CURDATE() -- Filtramos solo los registros del día actual
                        AND R.modulo = $modulo -- Filtramos por el módulo deseado
                    GROUP BY
                        O.nombre, R.referencia; -- Agrupamos por operario y referencia";

        } elseif($modulo = 0 OR "" OR NULL) {
            $sql = "SELECT
    RP.fecha,
    O.nombre AS NombreOperario,
    R.referencia AS Referencia,
    R.modulo AS Modulo, -- Incluimos el módulo sin filtrarlo
    RP.unidadesProducidas,
    RP.MetaPorEficiencia AS MetaAjustada
FROM registro_produccion RP
JOIN Operarios O ON RP.op_id = O.op_id
JOIN Referencias R ON RP.ref_id = R.ref_id
WHERE 
    DATE(RP.fecha) = CURDATE(); -- Filtramos solo los registros del día actual";
        }
            $stmt = $mysqli->prepare($sql);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $eficiencia = ($row["TotalUnidadesProducidas"] / floor($row["TotalMetaPorEficiencia"])) * 100;

                    $datosCompuestos[] = [
                        "nombre_operario"=> $row["NombreOperario"],
                        "referencia"=> $row["Referencia"],
                        "fecha"=> $row["Fecha"],
                        "total_unidades_producidas"=> $row["TotalUnidadesProducidas"],
                        "total_meta_eficiencia"=> floor($row["TotalMetaPorEficiencia"]),
                        "eficiencia"=> ceil($eficiencia)."%",
                    ];
                }
                $respuesta = [
                    "ok" => true,
                    "respuesta"=> $datosCompuestos
                ];
                echo json_encode($respuesta,true);
            } else {
                $datosCompuestos = []; // Array vacío explícito
                $respuesta = [
                    "ok" => true,
                    "respuesta" => $datosCompuestos
                ];// Siempre array
                    echo json_encode($respuesta, true);
            }

            // Cerrar conexión
            $stmt->close();
            $mysqli->close();


    } else {
        http_response_code(response_code: 400);
        echo json_encode(['ok'=> 'false', 'Respuesta' => 'Esta operacion no está permitida'],true);
    }








// Preparar la consulta

?>