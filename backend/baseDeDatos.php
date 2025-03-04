
<?php 
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Methods: POST, OPTIONS, DELETE, PUT');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json');
    $localURL = '192.168.1.59:80';
date_default_timezone_set('America/Bogota');
$mysqli = new mysqli("localhost", "root", "", "otraotradb");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
?>