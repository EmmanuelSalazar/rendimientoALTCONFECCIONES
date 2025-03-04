<?php
// Configuración de la base de datos (ajusta según tu entorno)
require '../baseDeDatos.php';

// Obtener la fecha seleccionada (por defecto, hoy)
$fechaFiltro = $_GET['fecha'] ?? date('Y-m-d'); // Si no se especifica, usa la fecha actual
//echo $fechaFiltro;
// Obtener el módulo seleccionado (por defecto, todos los módulos)
$moduloFiltro = null;
if (!empty($_GET['modulo']) && is_numeric($_GET['modulo'])) {
    $moduloFiltro = intval($_GET['modulo']);
}

// Construir la consulta para obtener horas únicas del día seleccionado
$horasQuery = "
    SELECT DISTINCT HOUR(fecha) AS hora 
    FROM registro_produccion rp
    INNER JOIN operarios o ON rp.op_id = o.op_id
    WHERE DATE(rp.fecha) = '$fechaFiltro'
";

if ($moduloFiltro) {
    $horasQuery .= " AND o.modulo = $moduloFiltro";
}

$horasQuery .= " ORDER BY hora ASC";

$horasResult = $mysqli->query($horasQuery);

if (!$horasResult) {
    die("Error en la consulta de horas: " . $mysqli->error);
}

$horas = [];
while ($row = $horasResult->fetch_assoc()) {
    $horas[] = $row['hora'];
}

// Construir consulta SQL dinámica
$columnas = [];
foreach ($horas as $hora) {
    $columnas[] = "SUM(CASE WHEN HOUR(rp.fecha) = $hora THEN rp.unidadesProducidas ELSE 0 END) AS h_$hora";
}

$columnasSQL = implode(', ', $columnas);

$query = "
    SELECT 
        o.op_id,
        o.nombre AS Operario,
        $columnasSQL
    FROM 
        operarios o
    LEFT JOIN 
        registro_produccion rp ON o.op_id = rp.op_id
    WHERE 
        DATE(rp.fecha) = '$fechaFiltro'
";

if ($moduloFiltro) {
    $query .= " AND o.modulo = $moduloFiltro";
}

$query .= "
    GROUP BY 
        o.op_id, o.nombre
    ORDER BY 
        o.nombre
";

// Imprimir la consulta SQL generada (para depuración)
// echo $query; exit();

// Ejecutar consulta
$result = $mysqli->query($query);

if (!$result) {
    die("Error en la consulta principal: " . $mysqli->error);
}

// Almacenar los resultados en un array
$data = [];
while ($row = $result->fetch_assoc()) {
    $operarioData = [
        'Operario' => $row['Operario'],
        'op_id' => $row['op_id']
    ];

    // Agregar las horas y sus valores al array
    foreach ($horas as $hora) {
        $operarioData[formatHour($hora)] = $row["h_$hora"];
    }

    $data[] = $operarioData;
}

// Función para formatear horas
function formatHour($hour) {
    return date("g a", strtotime("$hour:00"));
}

$respuesta = [
    "ok"=> true,
    "respuesta"=> $data,
];

echo json_encode($respuesta, JSON_PRETTY_PRINT);

?>