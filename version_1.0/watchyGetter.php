 
<?php
header("Access-Control-Allow-Origin: *");
$adat = new \stdClass();
$adat->name =  file_get_contents("test.txt");
$myJSON = json_encode($adat);

echo $myJSON;
?>