<?php 
header('Access-Control-Allow-Origin: http://localhost:3000');
/* header('Access-Control-Allow-Origin: http://192.168.1.59:3000');
 */
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
require 'baseDeDatos.php';
error_reporting(0);
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $searchBy = mysqli_real_escape_string($mysqli, $_POST['searchBy']);
            $sql = $mysqli->prepare("SELECT * FROM referencias ORDER BY ref_id DESC");
            $sql->execute();
            if (!$sql) {
                http_response_code(400);
                $respuesta = [
                    'ok' => false,
                    'respuesta' => 'Error al ejecutar la consulta'
                ];
                header('Content-Type: application/json');
                echo json_encode($respuesta,true);
                exit;
            } else {
                $resultado = $sql->get_result();
            $contador = $resultado->num_rows;
            $query = $resultado->fetch_all(MYSQLI_ASSOC);
            $respuesta = [
                'ok' => true,
                'respuesta' => $query
            ];
            http_response_code(response_code: 200);
            echo json_encode($respuesta,true);
            }
    } else {
        http_response_code(response_code: 400);
        echo json_encode(['ok'=> 'false'],true);
    }
?>  