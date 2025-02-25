
<?php 
header('Access-Control-Allow-Origin:  http://192.168.1.59:3000');
$localURL = '192.168.1.59:80';
date_default_timezone_set('America/Bogota');
$mysqli = new mysqli("localhost", "root", "", "otraotradb");
if ($mysqli->connect_errno) {
    echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
?>