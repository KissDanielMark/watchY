<?php
header("Access-Control-Allow-Origin: *");
$file = fopen("test.txt","w");
echo fwrite($file,"Indulj!!");
fclose($file);
?>