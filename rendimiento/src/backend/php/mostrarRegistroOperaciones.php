<?php 
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

require 'baseDeDatos.php';
error_reporting(0);

$respuesta = [
    "ok" => false,
    "respuesta" => []
];
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $sql = $mysqli->prepare("SELECT regProd_id,
                    RP.fecha,
                    O.nombre AS NombreOperario,
                    R.referencia AS Referencia,
                    RP.unidadesProducidas,
                    RP.MetaPorEficiencia AS MetaAjustada
                    FROM registro_produccion RP
                    JOIN Operarios O ON RP.op_id = O.op_id
                    JOIN Referencias R ON RP.ref_id = R.ref_id ORDER BY TIME(RP.fecha) DESC");

    if ($sql) {
        $sql->execute();
        $result = $sql->get_result();

        if ($result->num_rows > 0) {
            $datosCompuestos = [];

            while ($row = $result->fetch_assoc()) {
                $eficiencia = ($row["unidadesProducidas"] / floor($row["MetaAjustada"])) * 100;
                $datosCompuestos[] = [
                    "nombre_operario" => $row["NombreOperario"],
                    "referencia" => $row["Referencia"],
                    "fecha" => $row["fecha"],
                    "unidadesProducidas" => $row["unidadesProducidas"],
                    "metaAjustada" => floor($row["MetaAjustada"]),
                    "eficiencia" => ceil($eficiencia) . "%",
                ];
            }
            $respuesta["ok"] = true;
            $respuesta["respuesta"] = $datosCompuestos;
        } else {
            $respuesta["ok"] = false;
            $respuesta["respuesta"] = "No se encontraron resultados.";
        }
    } else {
        $respuesta["ok"] = false;
        $respuesta["respuesta"] = "Error al ejecutar la consulta.";
    }
} else {
    http_response_code(405); 
    $respuesta["ok"] = false;
    $respuesta["respuesta"] = "Método no permitido.";
}

http_response_code(200);
echo json_encode($respuesta, JSON_PRETTY_PRINT);
?>